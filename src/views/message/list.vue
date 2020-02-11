<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.title" clearable class="filter-item" style="width: 200px;" placeholder="请输入消息标题"/>
      <el-select v-model="listQuery.type" class="filter-item" clearable>
        <el-option :value="1" label="系统消息"></el-option>
        <el-option :value="2" label="站内消息"></el-option>
      </el-select>
      <el-button v-permission="['GET /admin/message/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('Search')}}</el-button>
      <el-button v-permission="['POST /admin/message/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">{{$t('Add')}}</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" :element-loading-text="$t('Searching')" border fit highlight-current-row>

      <el-table-column align="center" label="消息编号" prop="id"/>

      <el-table-column align="center" label="消息标题" prop="title"/>

      <el-table-column align="center" label="消息类型" prop="type">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type == 1 ? 'success' : 'error'">{{messageTypeMap[scope.row.type]}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="发布时间" prop="addTime"/>

      <el-table-column align="center" label="发布人员" prop="addUserName"/>

      <el-table-column align="center" label="接收对象" prop="receiverNumber">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type == 1">所有用户</el-tag>
<!--          <span v-else>{{scope.row.receiverNumber}}</span>-->
          <el-tag v-else v-for="item in scope.row.receiverLevels">{{userLevelOption[item]}}</el-tag>
        </template>
      </el-table-column>


      <el-table-column align="center" :label="$t('Operate')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['GET /admin/message/detail']" type="primary" size="mini" @click="handleDetail(scope.row)">查看</el-button>
          <el-button v-permission="['DELETE /admin/message/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">{{$t('Delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-tooltip placement="top" :content="$t('Back_to_top')">
      <back-to-top :visibility-height="100" />
    </el-tooltip>

    <!-- 回复反馈对话框 -->
    <el-dialog :visible.sync="messageDialogVisible" title="详情">
      <el-form>
        <el-form-item label="消息标题" prop="title">
          <el-input v-model="message.title" :disabled="true"/>
        </el-form-item>
        <el-form-item label="消息内容" prop="content">
          <el-input type="textarea" autosize v-model="message.content" :disabled="true"/>
        </el-form-item>
      </el-form>
<!--      <el-row>
        <el-col :span="8" align="right">
          消息标题：
        </el-col>
        <el-col :span="16">
          {{message.title}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" align="right">
          消息内容：
        </el-col>
        <el-col :span="16">
          {{message.content}}
        </el-col>
      </el-row>-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="messageDialogVisible = false">{{$t('Confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import ElSelectDropdown from 'element-ui/packages/select/src/select-dropdown'
  import BackToTop from '@/components/BackToTop'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import {listMessage, deleteMessage } from '@/api/message'
  const messageTypeMap = {
    1: '系统消息',
    2: '站内消息'
  }
  export default {
    name: "messageList",
    components: { ElSelectDropdown, BackToTop, Pagination },
    data(){
      const userLevelOption = {
        0: this.$t('普通会员'),
        1: this.$t('白银会员'),
        2: this.$t('黄金会员'),
        3: this.$t('铂金会员'),
        4: this.$t('钻石会员')
      }
      return {
        userLevelOption,
        messageTypeMap,
        list: [],
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          title: undefined,
          type: undefined,
          sort: 'add_time',
          order: 'desc'
        },
        messageDialogVisible: false,
        message: {
          title: undefined,
          content: undefined
        }
      }
    },
    created(){
      this.getList()
    },
    methods: {
      getList(){
        listMessage(this.listQuery).then(response=>{
          this.list = response.data.data.list
          this.total = response.data.data.total
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      },
      handleDetail(row){
        this.messageDialogVisible = true
        this.message.title = row.title
        this.message.content = row.content
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
        deleteMessage(row.id).then(response => {
          this.$notify.success({
            title: this.$t('Success!'),
            message: this.$t('Deleted')
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        }).catch(response => {
          this.$notify.error({
            title: this.$t('Failed'),
            message: response.data.errmsg
          })
        })
      },
      handleFilter(){
        this.getList()
      },
      handleCreate(){
        this.$router.push({path:'/message/create'})
      }
    }
  }
</script>

<style scoped>

</style>
