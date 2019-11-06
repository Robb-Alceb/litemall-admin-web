<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入门店成员名称"/>
      <el-select v-model="listQuery.role" clearable class="filter-item" placeholder="请选择">
        <el-option-group v-model="roles">
          <el-option :value="id" property="name"/>
        </el-option-group>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column align="center" label="员工名称" prop="name"/>

      <el-table-column align="center" label="联系地址" prop="address"/>

      <el-table-column align="center" label="成员角色" prop="roleIds">
        <template slot-scope="scope">
          <el-tag v-for="roleId in scope.row.roleIds" :key="roleId" type="primary" style="margin-right: 20px;"> {{ formatRole(roleId) }} </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="添加时间" prop="addTime"/>

      <el-table-column align="center" label="联系电话" prop="mobile"/>

      <el-table-column align="center" label="操作" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="warning" size="mini" @click="permissionUpdate(scope.row)">权限</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import ElSelectDropdown from 'element-ui/packages/select/src/select-dropdown'
import { deleteAdmin, listAdmin } from '@/api/admin'
import { roleOptions } from '@/api/role'
export default {
  name: 'ShopMembers',
  components: { ElSelectDropdown },
  data() {
    return {
      roles: [],
      list: [],
      listLoading: false,
      roleOptions: null,
      listQuery: {
        page: 1,
        limit: 20,
        shopId: undefined,
        name: undefined,
        role: undefined,
        sort: 'add_time',
        order: 'desc'
      }
    }
  },
  created() {
    this.getList()
    roleOptions()
      .then(response => {
        this.roleOptions = response.data.data.list
      })
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.shopId = this.$route.query.id
      listAdmin(this.listQuery).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    permissionUpdate(row) {
      this.$router.push({ path: '/shop/role', query: { id: row.id }})
    },
    handleUpdate(row) {
      this.$router.push({ path: '/shop/edit', query: { id: row.id }})
    },
    handleDelete(row) {
      deleteAdmin(row).then(response => {
        this.$notify.success({
          title: '成功',
          message: '删除成功'
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      }).catch(response => {
        this.$notify.error({
          title: '失败',
          message: response.data.errmsg
        })
      })
    },
    formatRole(roleId) {
      for (let i = 0; i < this.roleOptions.length; i++) {
        if (roleId === this.roleOptions[i].value) {
          return this.roleOptions[i].label
        }
      }
      return ''
    }
  }
}
</script>

<style scoped>

</style>
