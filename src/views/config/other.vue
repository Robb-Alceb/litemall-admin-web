<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-width="300px">
      <el-form-item label="用户积分抵扣金额配置" prop="keyValue">
        <el-input v-model.number="dataForm.keyValue" class="input-width">
          <template slot="append"> {{$t('$')}}</template>
        </el-input>
        <span class="info">{{$t('配置用户1积分抵扣金额')}}</span>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancel">{{$t('Cancel')}}</el-button>
        <el-button type="primary" @click="update">{{$t('Confirm')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { otherConfig, updateOtherConfig } from '@/api/config'
  export default {
    name: "other",
    data() {
      const validateKeyValue = (rule, value, callback) => {
        console.log('value' + value)
        if (!value) {
          callback(new Error(this.$t('值不能为空')))
        } else if(!/^-?\d+\.?\d{0,2}$/.test(value)){
          callback(new Error(this.$t('值不能超过两位小数')))
        } else {
          callback()
        }
      }
      return {
        dataForm: {
          keyName: 'litemall_integral_amount',
          keyValue: undefined
        },
        rules: {
          keyValue: [/*{ required: true, message: this.$t('值不能为空'), trigger: 'blur' }*/
            { validator: validateKeyValue, trigger: 'change' }
          ]
        }
      }
    },
    created() {
      this.init()
    },
    methods: {
      init: function() {
        otherConfig(this.dataForm).then(response => {
          this.dataForm.keyValue = response.data.data.litemall_integral_amount
        })
      },
      cancel() {
        this.init()
      },
      update() {
        updateOtherConfig(this.dataForm)
          .then(response => {
            this.$notify.success({
              title: this.$t('Success!'),
              message: '订单参数配置成功'
            })
          })
          .catch(response => {
            this.$notify.error({
              title: this.$t('Failed'),
              message: response.data.errmsg
            })
          })
      }
    }
  }
</script>

<style scoped>

</style>
