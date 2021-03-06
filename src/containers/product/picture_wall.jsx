import React,{Component} from 'react'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {BASE_URL} from '../../config'
import {reqDeletePicture} from '../../api/index'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: [
    ],
  };
  //获取图片名称
  getPicture=() => {
    let result = []
    this.state.fileList.forEach((item) => {
      result.push(item.name)
    })
    return result
  }
  // uid: '-1',
  // name: 'image.png',
  // status: 'done',
  // url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  setImgArr=(imgs) => {
    let fileList =[]
    imgs.forEach((item,index) => {
      fileList.push({
        uid:-index,
        name:item,
        status:'done',
        url:`${BASE_URL}/upload/${item}`
      })
    })
    this.setState({fileList})
  }
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  handleChange = async({file,fileList }) => {
    if (file.status==='done') {
       fileList[fileList.length-1].name = file.response.data.name
       fileList[fileList.length-1].url = file.response.data.url 
    }
    if (file.status==='removed') {
      let result = await reqDeletePicture(file.name)
      let {status} = result
      if (status===0) {
        message.success('删除图片成功')
      }else{
        message.error('删除图片失败')
      }
    }
    this.setState({ fileList });
  }
  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <Upload
          action={`${BASE_URL}/manage/img/upload`}
          method='POST'
          name='image'
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 4 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{width:'100%'}}  src={previewImage} />
        </Modal>
      </>
    );
  }
}

