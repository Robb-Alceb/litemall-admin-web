<template>
  <div class="app-container">

    <el-card class="box-card">
      <h3>{{$t('新增礼物卡')}}</h3>

      <el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="150px">
        <el-form-item :label="$t('礼物卡名称')" prop="name">
          <el-input v-model="dataForm.name"/>
        </el-form-item>
        <el-form-item :label="$t('图片')" prop="picUrl">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadPicUrl"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif">
            <img v-if="dataForm.picUrl" :src="dataForm.picUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
<!--            <span v-if="dataForm.picUrl" @click.stop="handleRemove1" class="el-upload-list&#45;&#45;picture-card">
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-edit">
                  <i class="el-icon-edit"></i>
                </span>
                <span class="el-upload-list__item-delete" @click.stop="handleRemove1">
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </span>-->
            <label v-if="dataForm.picUrl" class="el-upload-list__item-status-label avatar-uploader__status_label" @click.stop="handleRemove()"><i class="el-icon-delete"></i></label>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('礼物卡类型')" prop="type">
          <el-radio-group v-model="dataForm.type">
            <el-radio :label="1">{{$t('全场通用')}}</el-radio>
<!--            <el-radio :label="2" >{{$t('指定类目')}}</el-radio>-->
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('描述')" prop="desc">
          <el-input v-model="dataForm.desc" type="textarea" placeholder="" autosize/>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="op-container">
      <el-button @click="handleCancel">{{$t('Cancel')}}</el-button>
      <el-button v-permission="['POST /admin/giftcard/create']" type="primary" @click="handleCreate">新增礼物卡</el-button>
    </div>
  </div>
</template>

<script>
  import { uploadPath } from '@/api/storage'
  import { getToken } from '@/utils/auth'
  import { createGiftCard } from "@/api/gift";

  export default {
    name: "giftCardCreate",
    computed: {
      headers() {
        return {
          'X-Litemall-Admin-Token': getToken()
        }
      }
    },
    data(){
      return {
        dataForm: {
          type: 1,
          picUrl: ''
        },
        uploadPath,
        rules: {
          name: [{ required: true, message: this.$t('礼物卡名称必填'), trigger: 'blur' }]
        }
      }
    },
    methods: {
      uploadPicUrl: function(response) {
        console.log(response.data)
        this.dataForm.picUrl = response.data.url
      },
      handleCancel(){
        this.$router.push({path:'/promotion/giftcard'})
      },
      handleCreate(){
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            createGiftCard(this.dataForm)
              .then(() => {
                this.$notify.success({
                  title: this.$t('Success!'),
                  message: this.$t('Success!')
                })
                this.$router.push({path:'/promotion/giftcard'})
              })
              .catch(response => {
                this.$notify.error({
                  title: this.$t('Failed'),
                  message: response.data.errmsg
                })
              })
          }
        })

      },
      handleRemove: function() {
          this.dataForm.picUrl = undefined
      }
    }
  }
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    width: 145px;
    height: 145px;
    display: block;
  }
  .avatar-uploader__status_label{
    display: block;
    color: red;
    cursor: pointer;
  }
</style>
