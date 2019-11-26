<template>
  <div class="app-container">
    <el-card class="box-card">
      <h3>新增货品</h3>
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
      <el-button type="primary" @click="handleCreate">新增货品</el-button>
    </div>

  </div>
</template>

<script>
import { createMerchandise } from '@/api/repository'
import { MessageBox } from 'element-ui'
import { uploadPath } from '@/api/storage'
import { getToken } from '@/utils/auth'
export default {
  name: 'CreateMerchandise',
  data() {
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
      merchandise: {
        merchandiseSn: undefined,
        name: undefined,
        picUrl: '',
        sellingPrice: undefined,
        purchasePrice: undefined,
        number: undefined,
        unit: undefined
      },
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
  computed: {
    headers() {
      return {
        'X-Litemall-Admin-Token': getToken()
      }
    }
  },
  methods: {
    handleCreate: function() {
      createMerchandise(this.merchandise)
        .then(response => {
          this.$notify.success({
            title: '成功',
            message: '创建成功'
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
    handleCancel: function() {
      this.$router.push({ path: '/repository/merchandise' })
    }
  }
}
</script>

<style scoped>

</style>
