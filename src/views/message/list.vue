<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.title" clearable class="filter-item" style="width: 200px;" placeholder="请输入消息标题"/>
      <el-select v-model="listQuery.type" clearable>
        <el-option :value="1" label="系统消息"></el-option>
        <el-option :value="2" label="站内消息"></el-option>
      </el-select>
      <el-button v-permission="['GET /admin/message/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button v-permission="['POST /admin/message/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column align="center" label="消息编号" prop="messageSn"/>

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
          <span v-if="scope.row.type == 1">所有用户</span>
          <span v-else>{{scope.row.receiverNumber}}人</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['GET /admin/message/detail']" type="primary" size="mini" @click="handleDetail(scope.row)">查看</el-button>
          <el-button v-permission="['DELETE /admin/message/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibility-height="100" />
    </el-tooltip>

    <!-- 回复反馈对话框 -->
    <el-dialog :visible.sync="messageDialogVisible" title="详情">
      <el-row>
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
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="messageDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import ElSelectDropdown from 'element-ui/packages/select/src/select-dropdown'
  import BackToTop from '@/components/BackToTop'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  const messageTypeMap = {
    1: '系统消息',
    2: '站内消息'
  }
  export default {
    name: "messageList",
    components: { ElSelectDropdown, BackToTop, Pagination },
    data(){
      return {
        list: [],
        total: 0,
        listLoading: false,
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

      },
      handleDetail(row){
        this.messageDialogVisible = true
        this.message.title = row.title
        this.message.content = row.content
      },
      handleDelete(){

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
