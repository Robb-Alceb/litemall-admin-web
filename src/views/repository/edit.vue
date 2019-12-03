<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>货品详情</span>
        <el-button style="float: right; padding: 3px 0;margin-right: 10px;" type="text" @click="handleLogs(merchandise)">查看日志</el-button>
      </div>
      <el-form ref="merchandise" :rules="rules" :model="merchandise" label-width="150px">
        <el-form-item label="货品编号" prop="merchandiseSn">
          <el-input v-model="merchandise.merchandiseSn"/>
        </el-form-item>
        <el-form-item label="货品名称" prop="name">
          <el-input v-model="merchandise.name"/>
        </el-form-item>
        <el-form-item label="货品图片">
          <el-upload
            :action="uploadPath"
            :show-file-list="false"
            :headers="headers"
            :on-success="uploadPicUrl"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif">
            <img v-if="merchandise.picUrl" :src="merchandise.picUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="销售价格" prop="sellingPrice">
          <el-input v-model="merchandise.sellingPrice"/>
        </el-form-item>
        <el-form-item label="进货价格" prop="purchasePrice">
          <el-input v-model="merchandise.purchasePrice"/>
        </el-form-item>
        <el-form-item label="货品数量" prop="number">
          <el-input v-model.number="merchandise.number"/>
        </el-form-item>
        <el-form-item label="货品单位" prop="unit">
          <el-input v-model="merchandise.unit" placeholder=""/>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="op-container">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleEdit">修改货品</el-button>
    </div>

  </div>
</template>

<script>
  import {readMerchandise, editMerchandise} from '@/api/repository'
  import { MessageBox } from 'element-ui'
  import { uploadPath } from '@/api/storage'
  import { getToken } from '@/utils/auth'
  export default {
    name: "editMerchandise",
    data(){
      const validateDouble = (rule, value, callback) => {
        console.log('value' + value)
        if (!/^[0-9,.]*$/.test(value)) {
          callback(new Error('销售价格必须为数字'))
        } else {
          callback()
        }
      }
      return {
        uploadPath,
        merchandiseId: undefined,
        merchandise: {},
        rules: {
          merchandiseSn: [{ required: true, message: '货品编号不能为空', trigger: 'blur' }],
          name: [{ required: true, message: '货品名称不能为空', trigger: 'blur' }],
          sellingPrice: [{ required: true, message: '销售价格不能为空', trigger: 'change' },
            { validator: validateDouble, trigger: 'change' }],
          purchasePrice: [{ required: true, message: '进货价格不能为空', trigger: 'change' },
            { validator: validateDouble, trigger: 'change' }],
          number: [{ required: true, message: '货品数量不能为空', trigger: 'change' },
            { type: 'number', message: '货品数量必须为数字' }],
          unit: [{ required: true, message: '单位不能为空', trigger: 'blur' }]
        }
      }
    },
    created(){
      this.detail()
    },
    computed: {
      headers() {
        return {
          'X-Litemall-Admin-Token': getToken()
        }
      }
    },
    methods: {
      detail(){
        readMerchandise(this.$route.query.id).then(res=>{
          this.merchandise = res.data.data
        });
      },
      handleLogs(row){
        this.$router.push({path:'repository/logs',query:{id:row.id}})
      },
      handleCancel(){
        this.$router.push({path:'repository/list'})
      },
      handleEdit(){
        editMerchandise({litemallMerchandise:this.merchandise}).then(response => {
          this.$notify.success({
            title: '成功',
            message: '修改成功'
          })
          this.$router.push({ path: '/repository/merchandise' })
        })
          .catch(response => {
            MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
              confirmButtonText: '确定',
              type: 'error'
            })
          })
      },
      uploadPicUrl: function(response) {
        this.merchandise.picUrl = response.data.url
      },
    }
  }
</script>

<style scoped>

</style>
