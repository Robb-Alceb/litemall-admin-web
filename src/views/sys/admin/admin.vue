<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.nickname" clearable class="filter-item" style="width: 200px;" :placeholder="$t('Name')"/>
      <el-select v-model="listQuery.shopId" clearable class="filter-item" :placeholder="$t('请选择门店')">
        <el-option v-for="item in shops" :value="item.id" :label="item.name"></el-option>
      </el-select>
      <el-select v-model="listQuery.roleId" clearable class="filter-item" :placeholder="$t('请选择角色')">
        <el-option v-for="item in roleOptions" :value="item.value" :label="item.label"></el-option>
      </el-select>
      <el-button v-permission="['GET /admin/admin/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('Search')}}</el-button>
      <el-button v-permission="['POST /admin/admin/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">{{$t('Add')}}</el-button>
<!--      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{$t('Find')}}</el-button>-->
    </div>


    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" :element-loading-text="$t('Searching')" border fit highlight-current-row>

      <el-table-column align="center" :label="$t('所属门店')">
        <template slot-scope="scope">
          <span v-for="item in shops" v-if="item.id == scope.row.shopId">
            {{item.name}}
          </span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('Partner_name')" prop="nickName"/>

      <el-table-column align="center" :label="$t('Account_login')" prop="username"/>

      <el-table-column align="center" :label="$t('员工代号')" prop="code"/>

      <el-table-column align="center" :label="$t('社保号码')" prop="socialSecurityNumber"/>

      <el-table-column align="center" :label="$t('性别')" prop="gender">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.gender == 1" type="waring" style="margin-right: 20px;"> {{ $t('其他') }} </el-tag>
          <el-tag v-else-if="scope.row.gender == 2" type="danger" style="margin-right: 20px;"> {{ $t('女') }} </el-tag>
          <el-tag v-else-if="scope.row.gender == 3" type="primary" style="margin-right: 20px;"> {{ $t('男') }} </el-tag>
          <el-tag v-else type="info" style="margin-right: 20px;"> {{ $t('保密') }} </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('生日')" prop="birthday">

      </el-table-column>

      <el-table-column align="center" :label="$t('Address')" prop="location"/>

      <el-table-column align="center" :label="$t('Partner_role')" prop="roleIds">
        <template slot-scope="scope">
          <el-tag v-for="roleId in scope.row.roleIds" type="primary" style="margin-right: 20px;"> {{ formatRole(roleId) }} </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('Time_added')" prop="addTime"/>

      <el-table-column align="center" :label="$t('Contact_number')" prop="mobile"/>


      <el-table-column align="center" :label="$t('邮箱')" prop="email"/>

      <el-table-column align="center" :label="$t('Operate')" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('Edit')}}</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">{{$t('Delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="管理员名称" prop="username">
          <el-input v-model="dataForm.username"/>
        </el-form-item>
        <el-form-item label="管理员密码" prop="password">
          <el-input v-model="dataForm.password" type="password" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="管理员头像" prop="avatar">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadAvatar"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif">
            <img v-if="dataForm.avatar" :src="dataForm.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="管理员角色" prop="roleIds">
          <el-select v-model="dataForm.roleIds" multiple :placeholder="$t('Please_select')">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('Cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('Confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('Confirm')}}</el-button>
      </div>
    </el-dialog>

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
import { listAdmin, createAdmin, updateAdmin, deleteAdmin } from '@/api/admin'
import { roleOptions } from '@/api/role'
import { uploadPath } from '@/api/storage'
import { getToken } from '@/utils/auth'
import { allForPerm } from '@/api/shop'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination


export default {
  name: 'Admin',
  components: { Pagination },
  data() {
    return {
      uploadPath,
      list: null,
      total: 0,
      roleOptions: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        nickname: undefined,
        shopId: undefined,
        roleId: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        username: undefined,
        password: undefined,
        avatar: undefined,
        roleIds: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: this.$t('Edit'),
        create: this.$t('Create')
      },
      rules: {
        username: [
          { required: true, message: this.$t('Controller_name_cannot_be_empty'), trigger: 'blur' }
        ],
        password: [{ required: true, message: this.$t('Password_cannot_be_empty'), trigger: 'blur' }]
      },
      downloadLoading: false,
      shops:[],
    }
  },
  computed: {
    headers() {
      return {
        'X-Litemall-Admin-Token': getToken()
      }
    }
  },
  created() {
    this.getList()

    roleOptions()
      .then(response => {
        this.roleOptions = response.data.data.list
      })
    allForPerm().then(response=>{
      this.shops = response.data.data.list
    })
  },
  methods: {
    formatRole(roleId) {
      for (let i = 0; i < this.roleOptions.length; i++) {
        if (roleId === this.roleOptions[i].value) {
          return this.roleOptions[i].label
        }
      }
      return ''
    },
    getList() {
      this.listLoading = true
      if(this.$route.query.shopId){
        let shopId  = this.$route.query.shopId;
        this.listQuery.shopId = shopId;
      }
      listAdmin(this.listQuery)
        .then(response => {
          this.list = response.data.data.list
          this.total = response.data.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        username: undefined,
        password: undefined,
        avatar: undefined,
        roleIds: []
      }
    },
    uploadAvatar: function(response) {
      this.dataForm.avatar = response.data.url
    },
    handleCreate() {
/*      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })*/

      this.$router.push({ path: '/sys/admin/create',query: { shopId: this.listQuery.shopId }})
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createAdmin(this.dataForm)
            .then(response => {
              this.list.unshift(response.data.data)
              this.dialogFormVisible = false
              this.$notify.success({
                title: this.$t('Success!'),
                message: this.$t('Controller_added_successfully')
              })
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
    handleUpdate(row) {
/*      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })*/
      this.$router.push({ path: '/sys/admin/edit' ,query: { id: row.id, shopId: this.listQuery.shopId }})
    },
    updateData() {
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
                title: this.$t('Success!'),
                message: '更新管理员成功'
              })
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
    handleDelete(row) {
      this.$confirm(this.$t('Confirm_Delete?'), this.$t('Hint'), {
        confirmButtonText: this.$t('Confirm'),
        cancelButtonText: this.$t('Cancel'),
        type: 'warning'
      }).then(() => {
        this.doDelete(row)
      });
    },
    doDelete(row){
      deleteAdmin(row)
        .then(response => {
          this.$notify.success({
            title: this.$t('Success!'),
            message: this.$t('Controller_deleted')
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
        .catch(response => {
          this.$notify.error({
            title: this.$t('Failed'),
            message: response.data.errmsg
          })
        })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['管理员ID', '管理员名称', '管理员头像']
        const filterVal = ['id', 'username', 'avatar']
        excel.export_json_to_excel2(
          tHeader,
          this.list,
          filterVal,
          '管理员信息'
        )
        this.downloadLoading = false
      })
    }
  }
}
</script>
