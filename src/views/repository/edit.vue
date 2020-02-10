<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{$t('Product_details')}}</span>
        <el-button style="float: right; padding: 3px 0;margin-right: 10px;" type="text" @click="handleLogs(merchandise)">{{this.$t('View_Journals')}}</el-button>
      </div>
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
      <el-button type="primary" @click="handleEdit">{{$t('Edit_product')}}</el-button>
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
          callback(new Error(this.$t('Sale_price_must_be_a_number')))
        } else {
          callback()
        }
      }
      return {
        uploadPath,
        merchandiseId: undefined,
        merchandise: {},
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
        this.$router.push({path:'/repository/logs',query:{id:row.id}})
      },
      handleCancel(){
        this.$router.push({path:'/repository/merchandise'})
      },
      handleEdit(){
        editMerchandise({litemallMerchandise:this.merchandise}).then(response => {
          this.$notify.success({
            title: this.$t('Success!'),
            message: '修改成功'
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
    }
  }
</script>

<style scoped>

</style>
