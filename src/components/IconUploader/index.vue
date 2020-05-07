<template>

<div>
  <div class="cropper-content">
    <div class="cropper">
      <vueCropper
        ref="cropper"
        :img="option.img"
        :outputSize="option.size"
        :outputType="option.outputType"
        :info="true"
        :full="option.full"
        :canMove="option.canMove"
        :canMoveBox="option.canMoveBox"
        :original="option.original"
        :autoCrop="option.autoCrop"
        :autoCropWidth="option.autoCropWidth"
        :autoCropHeight="option.autoCropHeight"
        :fixedBox="option.fixedBox"
        @realTime="realTime"
        @imgLoad="imgLoad"
      ></vueCropper>
    </div>
    <div class="show-preview" :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden', 'margin': '5px'}">
      <div :style="previews.div" class="preview">
        <img :src="previews.url" :style="previews.img">
      </div>
    </div>
  </div>

  <div class="footer-btn">
    <div class="scope-btn">
      <label class="btn" for="uploads">更换图片</label>
      <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">

      <button  @click="changeScale(1)">+</button>
      <button  @click="changeScale(-1)">-</button>
      <button  @click="rotateLeft">↺</button>
      <button  @click="rotateRight">↻</button>
    </div>
    <div class="upload-btn">
      <button  @click="down('blob')">下载</button>
    </div>
  </div>
</div>
</template>


<script>
  import {VueCropper} from 'vue-cropper'
  import { uploadPath } from '@/api/storage'
  import request from '@/utils/request'

  export default {
    data() {
      return {
        headImg:'',
        //剪切图片上传
        crap: false,
        previews: {},
        option: {
          img: '',
          outputSize:1, //剪切后的图片质量（0.1-1）
          full: false,//输出原图比例截图 props名full
          outputType: 'png',
          canMove: true,
          original: false,
          canMoveBox: true,
          autoCrop: true,
          autoCropWidth: 150,
          autoCropHeight: 150,
          fixedBox: false
        },
        fileName:'',  //本机文件地址
        downImg: '#',
        imgFile:'',
        uploadImgRelaPath:'', //上传后的图片的地址（不带服务器域名）
      }
    },
    components: {
      VueCropper
    },
    methods: {
      //放大/缩小
      changeScale(num) {
        console.log('changeScale')
        num = num || 1;
        this.$refs.cropper.changeScale(num);
      },
      //坐旋转
      rotateLeft() {
        console.log('rotateLeft')
        this.$refs.cropper.rotateLeft();
      },
      //右旋转
      rotateRight() {
        console.log('rotateRight')
        this.$refs.cropper.rotateRight();
      },
      //上传图片（点击上传按钮）
      finish(type) {
        console.log('finish')
        let _this = this;
        let formData = new FormData();
        // 输出
        if (type === 'blob') {
          this.$refs.cropper.getCropBlob((data) => {
            let img = window.URL.createObjectURL(data)
            this.model = true;
            this.modelSrc = img;
            formData.append("file", data, this.fileName);
            request({
              url: uploadPath,
              method: 'post',
              formData
            }).then((response)=>{
              var res = response.data;
              if(res.success == 1){
                $('#btn1').val('');
                _this.imgFile = '';
                _this.headImg = res.realPathList[0];  //完整路径
                _this.uploadImgRelaPath = res.relaPathList[0];  //非完整路径
                _this.$message({　　//element-ui的消息Message消息提示组件
                  type: 'success',
                  message: '上传成功'
                });
              }
            })
            /*            this.$http.post(uploadPath, formData, {contentType: false, processData: false, headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
                          .then((response)=>{
                            var res = response.data;
                            if(res.success == 1){
                              $('#btn1').val('');
                              _this.imgFile = '';
                              _this.headImg = res.realPathList[0];  //完整路径
                              _this.uploadImgRelaPath = res.relaPathList[0];  //非完整路径
                              _this.$message({　　//element-ui的消息Message消息提示组件
                                type: 'success',
                                message: '上传成功'
                              });
                            }
                          })*/
          })
        } else {
          this.$refs.cropper.getCropData((data) => {
            this.model = true;
            this.modelSrc = data;
          })
        }
      },
      // 实时预览函数
      realTime(data) {
        console.log('realTime')
        this.previews = data
      },
      //下载图片
      down(type) {
        console.log('down')
        var aLink = document.createElement('a')
        aLink.download = 'author-img'
        if (type === 'blob') {
          this.$refs.cropper.getCropBlob((data) => {
            this.downImg = window.URL.createObjectURL(data)
            aLink.href = window.URL.createObjectURL(data)
            aLink.click()
          })
        } else {
          this.$refs.cropper.getCropData((data) => {
            this.downImg = data;
            aLink.href = data;
            aLink.click()
          })
        }
      },
      //选择本地图片
      uploadImg(e, num) {
        console.log('uploadImg');
        var _this = this;
        //上传图片
        var file = e.target.files[0]
        _this.fileName = file.name;
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
          alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
          return false
        }
        var reader = new FileReader();
        reader.onload =(e) => {
          let data;
          if (typeof e.target.result === 'object') {
            // 把Array Buffer转化为blob 如果是base64不需要
            data = window.URL.createObjectURL(new Blob([e.target.result]))
          }
          else {
            data = e.target.result
          }
          if (num === 1) {
            _this.option.img = data
          } else if (num === 2) {
            _this.example2.img = data
          }
        }
        // 转化为base64
        // reader.readAsDataURL(file)
        // 转化为blob
        reader.readAsArrayBuffer(file);

      },
      imgLoad (msg) {
        console.log('imgLoad')
        console.log(msg)
      }
    },

  }
</script>

<style scoped>
  .cropper-content {
    display: flex;
    display: -webkit-flex;
    justify-content: flex-end;
    -webkit-justify-content: flex-end;
  }
  .cropper{
    width: 350px;
    height: 300px;
  }
  .show-preview {
    flex: 1;
    -webkit-flex: 1;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    -webkit-justify-content: center;
  }
  .preview{
    overflow: hidden;
    border-radius: 50%;
    border:1px solid #cccccc;
    background: #cccccc;
    margin-left: 40px;
  }
  .footer-btn {
    margin-top: 30px;
    display: flex;
    display: -webkit-flex;
    justify-content: flex-end;
    -webkit-justify-content: flex-end;
  }
  .scope-btn{
    width: 350px;
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    -webkit-justify-content: space-between;
  }
  .upload-btn{
    flex: 1;
    -webkit-flex: 1;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    -webkit-justify-content: center;
  }
  .btn {
    outline: none;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: .1s;
    transition: .1s;
    font-weight: 500;
    padding: 8px 15px;
    font-size: 12px;
    border-radius: 3px;
    color: #fff;
    background-color: #67c23a;
    border-color: #67c23a;
  }
</style>
