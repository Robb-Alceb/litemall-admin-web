<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.username" clearable class="filter-item" style="width: 200px;" placeholder="请输入用户名"/>
<!--      <el-input v-model="listQuery.mobile" clearable class="filter-item" style="width: 200px;" placeholder="请输入手机号"/>-->
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('Search')}}</el-button>
<!--      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{$t('Find')}}</el-button>-->
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" :element-loading-text="$t('Searching')" border fit highlight-current-row @sort-change="handleSort">
      <el-table-column align="center" width="100px" :label="$t('Member_ID')" prop="id" sortable="custom"/>

      <el-table-column align="center" label="用户名" prop="username" sortable="custom"/>

      <el-table-column align="center" label="用户姓名" prop="nickname"/>

      <el-table-column align="center" label="性别" prop="gender">
        <template slot-scope="scope">
          <el-tag >{{ genderDic[scope.row.gender] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="生日" prop="birthday"/>

      <el-table-column align="center" label="手机号码" prop="mobile"/>

      <el-table-column align="center" label="邮箱" prop="email"/>

      <el-table-column align="center" label="会员等级" prop="userLevel" sortable="custom">
        <template slot-scope="scope">
          <el-tag >{{ levelDic[scope.row.userLevel] }}</el-tag>
        </template>
      </el-table-column>

<!--      <el-table-column align="center" label="消费金额" prop="mobile"/>-->

      <el-table-column align="center" label="账号状态" prop="status" sortable="custom">
        <template slot-scope="scope">
          <el-tag>{{ statusDic[scope.row.status] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="可用积分" prop="points"/>

      <el-table-column align="center" :label="$t('Operate')" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-row>
            <el-button v-permission="['PUT /admin/user/update']" type="primary" size="small" @click="handleEdit(scope.row)">{{$t('修改')}}</el-button>
            <el-button v-permission="['PUT /admin/user/resetpwd']" type="primary" size="small" @click="handleReset(scope.row)">{{$t('重置密码')}}</el-button>
          </el-row>
          <el-row style="padding-top: 10px;">
            <el-button v-permission="['GET /admin/user/detail']" type="primary" size="small" @click="handleDetail(scope.row)">{{$t('Details')}}</el-button>
            <el-button v-permission="['PUT /admin/user/integral']" type="primary" size="small" @click="handleIntegral(scope.row)">{{$t('赠送积分')}}</el-button>
          </el-row>
        </template>
      </el-table-column>
<!--
      <el-table-column align="center" label="手机号码" prop="mobile"/>

      <el-table-column align="center" label="性别" prop="gender">
        <template slot-scope="scope">
          <el-tag >{{ genderDic[scope.row.gender] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="生日" prop="birthday"/>

-->




    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 重置密码对话框 -->
    <el-dialog :visible.sync="resetDialogVisible" :title="$t('重置密码')">
      <el-form ref="feedbackForm" :model="resetForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="填写新密码" prop="newPwd">
          <el-input v-model="resetForm.newPwd" :placeholder="$t('新密码，不填则系统生成')" />
        </el-form-item>
        <el-form-item v-if="pwd" label="新密码" prop="pwd">
          <el-input v-model="pwd"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetDialogVisible = false">{{$t('Cancel')}}</el-button>
        <el-button type="primary" @click="resetConfirm">{{$t('Confirm')}}</el-button>
      </div>
    </el-dialog>

    <!-- 赠送积分对话框 -->
    <el-dialog :visible.sync="integralDialogVisible" :title="$t('赠送积分')">
      <el-form ref="feedbackForm" :model="integralForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="填写新密码" prop="integral">
          <el-input v-model.number="integralForm.integral" :placeholder="$t('赠送积分')" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="integralDialogVisible = false">{{$t('Cancel')}}</el-button>
        <el-button type="primary" @click="integralConfirm">{{$t('Confirm')}}</el-button>
      </div>
    </el-dialog>

    <!-- 修改用户信息对话框 -->
    <el-dialog :visible.sync="editDialogVisible" :title="$t('修改用户信息')">
      <el-form ref="editForm" :model="editForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('账号')" prop="username">
          <el-input v-model.number="editForm.username" disabled/>
        </el-form-item>
        <el-form-item :label="$t('性别')" prop="gender">
          <el-select v-model="editForm.gender" clearable>
            <el-option :value="1" :label="$t('其他')"></el-option>
            <el-option :value="2" :label="$t('女')"></el-option>
            <el-option :value="3" :label="$t('男')"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('生日')" prop="birthday">
          <el-date-picker clearable
                          class="filter-date-item"
                          v-model="editForm.birthday"
                          type="date"
                          value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('昵称')" prop="nickname">
          <el-input v-model.number="editForm.nickname"/>
        </el-form-item>
        <el-form-item :label="$t('邮箱')" prop="email">
          <el-input v-model="editForm.email"/>
        </el-form-item>
        <el-form-item :label="$t('手机号码')" prop="mobile">
          <el-input v-model="editForm.mobile"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">{{$t('Cancel')}}</el-button>
        <el-button type="primary" @click="updateConfirm">{{$t('Confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, resetUserPwd, updateIntegral, updateUser } from '@/api/user'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import {toLine} from '@/utils/stringConvert'


export default {
  name: 'User',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        username: undefined,
        mobile: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      downloadLoading: false,
      genderDic: ['', '其他', '女', '男'],
      levelDic: ['普通会员', '白银会员', '黄金会员', '铂金会员', '钻石会员'],
      statusDic: [this.$t('Usable'), '禁用', '注销'],
      resetDialogVisible: false,
      resetForm: {
        userId: undefined,
        newPwd: undefined
      },
      pwd: undefined,

      integralDialogVisible: false,
      integralForm: {
        userId: undefined,
        integral: undefined
      },
      editDialogVisible: false,
      editForm: {

      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDetail(row){
      this.$router.push({path:'/user/overview',query:{id:row.id}})
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['用户名', '手机号码', '性别', '生日', '状态']
        const filterVal = ['username', 'mobile', 'gender', 'birthday', 'status']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '用户信息')
        this.downloadLoading = false
      })
    },
    handleSort(item){
      console.log(item);
      if(item.order == 'ascending') {
        this.listQuery.order = 'asc'
      }else if(item.order == 'descending'){
        this.listQuery.order = 'desc'
      }
      this.listQuery.sort = toLine(item.prop)
      this.handleFilter();
    },
    handleReset(row){
      this.resetDialogVisible = !this.resetDialogVisible
      this.resetForm.userId = row.id
      this.resetForm.newPwd = undefined
      this.pwd = undefined
    },
    resetConfirm(){
      resetUserPwd(this.resetForm).then(response => {
        // this.resetDialogVisible = false
        this.$notify.success({
          title: this.$t('Success!'),
          message: this.$t('重置成功')
        })
        this.pwd = response.data.data
      }).catch(response => {
        this.$notify.error({
          title: this.$t('Failed'),
          message: response.data.errmsg
        })
      })
    },
    handleIntegral(row){
        this.integralDialogVisible = !this.integralDialogVisible
        this.integralForm.userId = row.id
        this.integralForm.integral = undefined
    },
    integralConfirm(){
      updateIntegral(this.integralForm).then(response => {
        this.integralDialogVisible = false
        this.$notify.success({
          title: this.$t('Success!'),
          message: this.$t('成功')
        })
        this.getList();
      }).catch(response => {
        this.$notify.error({
          title: this.$t('Failed'),
          message: response.data.errmsg
        })
      })
    },
    handleEdit(row){
      this.editDialogVisible = !this.editDialogVisible
      this.editForm = row
    },
    updateConfirm(){
      updateUser(this.editForm).then(response => {
        this.editDialogVisible = false
        this.$notify.success({
          title: this.$t('Success!'),
          message: this.$t('成功')
        })
        this.getList();
      }).catch(response => {
        this.$notify.error({
          title: this.$t('Failed'),
          message: response.data.errmsg
        })
      })
    }
  }
}
</script>
