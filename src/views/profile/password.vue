<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
      <el-form-item :label="$t('Old_password')" prop="oldPassword">
        <el-input v-model="dataForm.oldPassword" type="password"/>
      </el-form-item>
      <el-form-item :label="$t('New_password')" prop="newPassword">
        <el-input v-model="dataForm.newPassword" type="password" auto-complete="off"/>
      </el-form-item>
      <el-form-item :label="$t('Confirm_password')" prop="newPassword2">
        <el-input v-model="dataForm.newPassword2" type="password" auto-complete="off"/>
      </el-form-item>
    </el-form>
    <div style="margin-left:100px;">
      <el-button @click="cancel">{{$t('Cancel')}}</el-button>
      <el-button type="primary" @click="change">{{$t('Confirm')}}</el-button>
    </div>
  </div>
</template>

<script>
import { changePassword } from '@/api/profile'

export default {
  name: 'ChangePassword',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('Please_enter_password')))
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('Please_re-enter_password')))
      } else if (value !== this.dataForm.newPassword) {
        callback(new Error(this.$t('Passwords_entered_do_not_match')))
      } else {
        callback()
      }
    }
    return {
      dataForm: {
        oldPassword: '',
        newPassword: '',
        newPassword2: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: this.$t('Old_password_cannot_be_empty'), trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: this.$t('New_password_cannot_be_empty'), trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        newPassword2: [
          { required: true, message: this.$t('Confirm_password_cannot_be_empty'), trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.dataForm = {
        oldPassword: '',
        newPassword: '',
        newPassword2: ''
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    change() {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return
        }
        changePassword(this.dataForm).then(response => {
          this.$notify.success({
            title: this.$t('Success!'),
            message: this.$t('Password_change_successful')
          })
        }).catch(response => {
          this.$notify.error({
            title: this.$t('Failed'),
            message: response.data.errmsg
          })
        })
      })
    }
  }
}
</script>
