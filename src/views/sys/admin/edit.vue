<template>
  <div class="app-container">
    <el-card class="box-card">
      <h3>用户详情</h3>
      <el-form ref="dataForm" :rules="rules" :model="admin" label-width="150px">
        <el-form-item label="用户名称" prop="nickName">
          <el-input v-model="admin.nickName"/>
        </el-form-item>
        <el-form-item label="用户头像" prop="avatar">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadAvatar"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif">
            <img v-if="admin.avatar" :src="admin.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <el-input v-model="admin.address"/>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="admin.mobile"/>
        </el-form-item>
        <el-form-item label="成员角色" prop="roleIds">
          <el-col>
            <el-select  v-model="admin.roleIds" multiple collapse-tags>
              <el-option v-for="item in roles" :value="item.value" :label="item.label"/>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="所属门店" prop="shop">
          <el-select v-model="admin.shopId">
            <el-option v-for="item in shops" :value="item.shopId" :label="item.name"/>
          </el-select>
        </el-form-item>
        <el-form-item label="登录账号" prop="username">
          <el-input v-model="admin.username"/>
        </el-form-item>
        <el-form-item label="登录密码" prop="name">
          <el-input v-model="admin.password"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="name">
          <el-input v-model="admin.confirm"/>
        </el-form-item>
<!--        <el-form-item>
          <el-input v-model="admin.desc" type="textarea"/>
        </el-form-item>-->
      </el-form>
    </el-card>

    <div class="op-container">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleEdit">更新用户</el-button>
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
</style>

<script>
import { uploadPath } from '@/api/storage'
import { updateAdmin, readAdmin } from '@/api/admin'
import { roleOptions } from '@/api/role'
import { getToken } from '@/utils/auth'
import { listShop } from '@/api/shop'
export default {
  name: 'Edit',
  data() {
    return {
      uploadPath,
      admin: {},
      roles: [],
      shops: [],
      rules: {
        username: [
          { required: true, message: '管理员名称不能为空', trigger: 'blur' }
        ],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.initData()
    const shopId = this.$route.query.shopId || null
    roleOptions(shopId).then(res => {
      this.roles = res.data.data.list
    })
    listShop().then(res=>{
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
    initData() {
      const id = this.$route.query.id
      if (!id) {
        return
      }
      readAdmin(id).then((res) => {
        this.admin = res.data.data
      })
    },
    handleEdit() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateAdmin(this.dataForm)
            .then(() => {
              for (const v of this.list) {
                if (v.id === this.dataForm.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.dataForm)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '更新管理员成功'
              })
            })
            .catch(response => {
              this.$notify.error({
                title: '失败',
                message: response.data.errmsg
              })
            })
        }
      })
    },
    uploadAvatar: function(response) {
      this.dataForm.avatar = response.data.url
    },
    handleCancel(){
      this.$router.push({ path: '/sys/admin'})
    }
  }
}
</script>

<style scoped>

</style>
