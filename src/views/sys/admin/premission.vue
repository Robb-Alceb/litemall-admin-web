<template>
  <div class="app-container">
    <div v-for="index,item in systemPermissions">
      <el-form>
        <el-form-item>
          <div style="margin: 15px 0;"></div>
<!--          <el-checkbox-group v-model="item" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
          </el-checkbox-group>-->
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
  import { getPermission, updatePermission } from '@/api/role'
  export default {
    name: 'rolePremission',
    data(){
      return {
        systemPermissions: null,
        assignedPermissions: null,
      }
    },
    created() {
      let id = this.$router.query.id
      getPermission({ roleId: id })
        .then(response => {
          this.systemPermissions = response.data.data.systemPermissions
          this.assignedPermissions = response.data.data.assignedPermissions
        })
    },
    methods:{
      updatePermission() {
        this.permissionForm.permissions = this.$refs.tree.getCheckedKeys(true)
        updatePermission(this.permissionForm)
          .then(response => {
            this.$notify.success({
              title: this.$t('Success!'),
              message: this.$t('Access_granted')
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
