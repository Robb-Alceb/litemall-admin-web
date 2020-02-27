<template>
  <div class="app-container">
    <el-card class="box-card">
      <h3>{{$t('Add_Products')}}</h3>
      <el-form ref="merchandise" :rules="rules" :model="merchandise" label-width="150px">
        <el-form-item :label="$t('Product_code')" prop="merchandiseSn">
          <el-input v-model="merchandise.merchandiseSn"/>
        </el-form-item>
        <el-form-item :label="$t('Product_name')" prop="name">
          <el-input v-model="merchandise.name"/>
        </el-form-item>
        <el-form-item :label="$t('Merchandise_picture')">
          <el-upload
            :action="uploadPath"
            :show-file-list="false"
            :headers="headers"
            :on-success="uploadPicUrl"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif">
            <img v-if="merchandise.picUrl" :src="merchandise.picUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
            <label v-if="merchandise.picUrl" class="el-upload-list__item-status-label avatar-uploader__status_label" @click.stop="handleRemove()"><i class="el-icon-delete"></i></label>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('Sale_price')" prop="sellingPrice">
          <el-input v-model="merchandise.sellingPrice"/>
        </el-form-item>
        <el-form-item :label="$t('Purchase_price')" prop="purchasePrice">
          <el-input v-model="merchandise.purchasePrice"/>
        </el-form-item>
        <el-form-item :label="$t('Number_of_merchandise')" prop="number">
          <el-input v-model.number="merchandise.number"/>
        </el-form-item>
        <el-form-item :label="$t('Product_unit')" prop="unit">
          <el-input v-model="merchandise.unit" placeholder=""/>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="op-container">
      <el-button @click="handleCancel">{{$t('Cancel')}}</el-button>
      <el-button type="primary" @click="handleCreate">{{$t('Add_Products')}}</el-button>
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
        callback(new Error(this.$t('Sale_price_must_be_a_number')))
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
        merchandiseSn: [{ required: true, message: this.$t('Product_code_cannot_be_empty'), trigger: 'blur' }],
        name: [{ required: true, message: this.$t('Product_name_cannot_be_empty'), trigger: 'blur' }],
        sellingPrice: [{ required: true, message: this.$t('Sale_price_cannot_be_empty'), trigger: 'change' },
          { validator: validateDouble, trigger: 'change' }],
        purchasePrice: [{ required: true, message: this.$t('Buy-in_cost_cannot_be_empty'), trigger: 'change' },
          { validator: validateDouble, trigger: 'change' }],
        number: [{ required: true, message: this.$t('Product_amount_cannot_be_empty'), trigger: 'change' },
          { type: 'number', message: this.$t('Product_amount_must_be_a_number') }],
        unit: [{ required: true, message: this.$t('Unit_cannot_be_empty'), trigger: 'blur' }]
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
            title: this.$t('Success!'),
            message: this.$t('Creation_successful')
          })
          this.$router.push({ path: '/repository/merchandise' })
        })
        .catch(response => {
          MessageBox.alert(this.$t('Error') + response.data.errmsg, this.$t('Warning'), {
            confirmButtonText: this.$t('Confirm'),
            type: 'error'
          })
        })
    },
    uploadPicUrl: function(response) {
      this.merchandise.picUrl = response.data.url
    },
    handleCancel: function() {
      this.$router.push({ path: '/repository/merchandise' })
    },
    handleRemove: function () {
      this.merchandise.picUrl = undefined
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
