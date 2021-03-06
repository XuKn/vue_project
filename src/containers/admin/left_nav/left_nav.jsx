import React, { Component } from 'react'
import { Menu} from 'antd';
import navImg from '../../../static/images/login.png'
import './css/left_nav.less'
import menuConfig from '../../../config/menu-config'
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { createSaveTitleAction } from '../../../redux/action_creators/menu_action';

const { SubMenu } = Menu;

class left_nav extends Component {
  //保存标题
  save=(data) => {
    this.props.saveTitle(data)
  }
  //是否有其中的key
  hasItem=(item) => {
    const {userName,menus} = this.props
    if (userName==='admin') {
      return item
    }
    else if (!item.children) {
      return menus.find((item1) => {
        return item1 ===item.key
      })
    }else if (item.children) {
        return item.children.some((item2) => {
          return menus.indexOf(item2.key) !== -1
        })
      }
  }
  //遍历导航菜单
  createMenu = (target) => {
   return target.map((item)=>{
     if (this.hasItem(item)) {
      if (!item.children) { 
        return(<Menu.Item key={item.key} onClick={() => {
         this.save(item.title)
        }}
              icon={item.icon}><Link to={item.path}>
             {item.title}
             </Link>
              </Menu.Item>)
            
       }else{
         return(
           <SubMenu key={item.key} icon={item.icon} title={item.title}>
             {this.createMenu(item.children)}
           </SubMenu>
         )
       }
     }  
     return null 
    })
  }
  
  render() {
    const{pathname} =this.props.location
    return (
      <div>
        <div className='left_nav'>
          <img src={navImg} alt='logo'/>
          <h1>商品管理</h1>
        </div>
        <Menu
          defaultSelectedKeys={pathname.indexOf('product')!==-1?'product':pathname.split('/').reverse()[0]}
          defaultOpenKeys={pathname.split('/').splice(2)}
          mode="inline"
          theme="dark"
        >
          {this.createMenu(menuConfig)}
        </Menu>
      </div>
    );
  }
}
export default connect(
  state=>({menus:state.userInfo.user.role.menus,
    userName:state.userInfo.user.username
  }),
  {
    saveTitle:createSaveTitleAction
  }
)(withRouter(left_nav))