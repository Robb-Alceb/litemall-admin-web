<template>
  <div class="app-container">
    <el-card class="box-card">
      <h3>添加用户</h3>
      <el-form ref="dataForm" :rules="rules" :model="admin" label-width="150px">
        <el-form-item :label="$t('Partner_name')" prop="nickName">
          <el-input v-model="admin.nickName"/>
        </el-form-item>

        <el-form-item :label="$t('员工代号')" prop="code">
          <el-input v-model="admin.code"/>
        </el-form-item>
        <el-form-item :label="$t('社保号码')" prop="socialSecurityNumber">
          <el-input v-model="admin.socialSecurityNumber"/>
        </el-form-item>
        <el-form-item :label="$t('性别')" prop="gender">
          <el-select v-model="admin.gender" clearable>
            <el-option :value="1" :label="$t('其他')"></el-option>
            <el-option :value="2" :label="$t('女')"></el-option>
            <el-option :value="3" :label="$t('男')"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('生日')" prop="birthday">
          <el-date-picker clearable
              class="filter-date-item"
              v-model="admin.birthday"
              type="date"
              value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('Partner_picture')" prop="avatar">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadAvatar"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif">
            <img v-if="admin.avatar" :src="admin.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
            <label v-if="admin.avatar" class="el-upload-list__item-status-label avatar-uploader__status_label" @click.stop="handleRemove()"><i class="el-icon-delete"></i></label>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('Address')" prop="location">
          <el-input v-model="admin.location"/>
        </el-form-item>
        <el-form-item :label="$t('Contact_number')" prop="mobile">
        <el-input v-model="admin.mobile"/>
      </el-form-item>
        <el-form-item :label="$t('邮箱')" prop="email">
          <el-input v-model="admin.email"/>
        </el-form-item>
        <el-form-item :label="$t('Partner_role')" prop="roleIds">
          <el-col>
            <el-select  v-model="admin.roleIds" multiple collapse-tags>
              <el-option v-for="item in roles" :value="item.value" :label="item.label"/>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('Store_belong')" prop="shop">
          <el-select v-model="admin.shopId" clearable>
            <el-option v-for="item in shops" :value="item.shopId" :label="item.name"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('Account_login')" prop="username">
          <el-input v-model="admin.username"/>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input v-model="admin.password" show-password/>
        </el-form-item>
<!--        <el-form-item label="确认密码" prop="name">
          <el-input v-model="admin.confirm" show-password/>
        </el-form-item>-->
        <el-form-item>
          <el-input v-model="admin.desc" type="textarea"/>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="op-container">
      <el-button @click="handleCancel">{{$t('Cancel')}}</el-button>
      <el-button type="primary" @click="handleCreate">新增用户</el-button>
    </div>
  </div>
</template>

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
  }
</style>

<script>
  import { uploadPath } from '@/api/storage'
  import { createAdmin } from '@/api/admin'
  import { roleOptions } from '@/api/role'
  import { getToken } from '@/utils/auth'
  import { listShop } from '@/api/shop'
  export default {
    name: 'createAdmin',
    data() {
      return {
        uploadPath,
        admin: {avatar:''},
        roles: [],
        shops: [],
        rules: {
          username: [
            { required: true, message: this.$t('Controller_name_cannot_be_empty'), trigger: 'blur' }
          ],
          password: [{ required: true, message: this.$t('Password_cannot_be_empty'), trigger: 'blur' },
            { min: 6, max: 16, message: this.$t('Password_length_from_6_-_16_characters'), trigger: 'blur' }],
          code: [
            { required: true, message: this.$t('员工代号不能为空'), trigger: 'blur' }
          ],
          nickName: [
            { required: true, message: this.$t('员工名称不能为空'), trigger: 'blur' }
          ],
          socialSecurityNumber: [
            { required: true, message: this.$t('社保号码不能为空'), trigger: 'blur' }
          ],
          gender: [
            { required: true, message: this.$t('性别不能为空'), trigger: 'blur' }
          ],
          birthday: [
            { required: true, message: this.$t('生日不能为空'), trigger: 'blur' }
          ],
          location: [
            { required: true, message: this.$t('联系地址不能为空'), trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: this.$t('联系电话不能为空'), trigger: 'blur' }
          ],
          email: [
            { required: true, message: this.$t('邮箱不能为空'), trigger: 'blur' }
          ],
          password: [
            { required: true, message: this.$t('邮箱不能为空'), trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      const shopId = this.$route.query.shopId || null
      roleOptions(shopId).then(res => {
        this.roles = res.data.data.list
      })
      listShop({shopId}).then(res=>{
        this.shops = res.data.data.list
      })
    },
    computed: {
      headers() {
        return {
          'X-Litemall-Admin-Token': getToken()
        }
      }
    },
    methods: {
      handleCreate() {
        this.$refs['dataForm'].validate(valid => {
          console.log(this.dataForm);
          if (valid) {
            createAdmin(this.admin)
              .then(() => {
                this.$notify.success({
                  title: this.$t('Success!'),
                  message: this.$t('New_controller_added_successfully')
                })
                this.$router.push({path:'/sys/admin'})
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
      uploadAvatar: function(response) {
        this.admin.avatar = response.data.url
      },
      handleCancel(){
        this.$router.push({ path: '/sys/admin'})
      },
      handleRemove(){
        this.admin.avatar = undefined
      }
    }
  }
</script>

<style scoped>

</style>
