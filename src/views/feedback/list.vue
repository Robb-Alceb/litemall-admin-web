<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.username" clearable class="filter-item" style="width: 200px;" placeholder="请输入用户名称"/>
      <el-button v-permission="['GET /admin/feedback/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('Search')}}</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" :element-loading-text="$t('Searching')" border fit highlight-current-row>

      <el-table-column align="center" label="用户名称" prop="username"/>

      <el-table-column align="center" label="手机号" prop="mobile"/>

      <el-table-column align="center" label="反馈时间" prop="addTime"/>

      <el-table-column align="center" label="反馈内容" prop="content"/>

      <el-table-column align="center" :label="$t('Status')" prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status == 1 ? 'success' : 'error' ">{{ statusMap[scope.row.status]}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('Operate')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/feedback/reply']" type="primary" size="mini" @click="handleReply(scope.row)">{{$t('Undo')}}</el-button>
          <el-button v-permission="['POST /admin/feedback/ignore']" type="info" size="mini" @click="handleIgnore(scope.row)">忽略</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-tooltip placement="top" :content="$t('Back_to_top')">
      <back-to-top :visibility-height="100" />
    </el-tooltip>

    <!-- 回复反馈对话框 -->
    <el-dialog :visible.sync="feedbackDialogVisible" :title="$t('Undo')">
      <el-form ref="feedbackForm" :model="feedbackForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="内容" prop="reply">
          <el-input v-model="feedbackForm.content" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="feedbackDialogVisible = false">{{$t('Cancel')}}</el-button>
        <el-button type="primary" @click="doReply">{{$t('Confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import ElSelectDropdown from 'element-ui/packages/select/src/select-dropdown'
  import { listFeedback, replyFeedback, ignoreFeedback } from '@/api/feedback'
  import BackToTop from '@/components/BackToTop'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  const statusMap = ['未处理', '已回复', '已忽略']
  export default {
    name: "feedbackList",
    components: { ElSelectDropdown, BackToTop, Pagination },
    data() {
      return {
        statusMap,
        list: [],
        total: 0,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 20,
          username: undefined,
          sort: 'add_time',
          order: 'desc'
        },
        feedbackDialogVisible:false,
        feedbackForm: {
          id: undefined,
          reply: undefined
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList(){
        listFeedback(this.listQuery).then(res=>{
          this.list = res.data.data.list
        })
      },
      handleFilter(){
        this.getList()
      },
      handleReply(row){
        this.feedbackDialogVisible = true
        this.feedbackForm.id = row.id
      },
      doReply(){
        replyFeedback(this.feedbackForm).then(response => {
          this.feedbackDialogVisible = false
          this.$notify.success({
            title: this.$t('Success!'),
            message: this.$t('Reply_Successful!')
          })
          this.getList()
        }).catch(response => {
          this.$notify.error({
            title: this.$t('Failed'),
            message: response.data.errmsg
          })
        })
      },
      handleIgnore(row){
        let data = {
          id: row.id
        }
        ignoreFeedback(data).then(response => {
          this.$notify.success({
            title: this.$t('Success!'),
            message: this.$t('Success!')
          })
          this.getList()
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

<style scoped>

</style>
