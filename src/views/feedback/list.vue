<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.username" clearable class="filter-item" style="width: 200px;" placeholder="请输入用户名称"/>
      <el-button v-permission="['GET /admin/feedback/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column align="center" label="用户名称" prop="username"/>

      <el-table-column align="center" label="手机号" prop="mobile"/>

      <el-table-column align="center" label="反馈内容" prop="content"/>

      <el-table-column align="center" label="添加时间" prop="addTime"/>

      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status != 1 ? 'success' : 'error' ">{{ consStatus[scope.row.status]}}</el-tag>
        </template>
      </el-table-column>

<!--      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['DELETE /admin/shop/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>-->
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibility-height="100" />
    </el-tooltip>

  </div>
</template>

<script>
  import ElSelectDropdown from 'element-ui/packages/select/src/select-dropdown'
  import { listFeedback } from '@/api/feedback'
  import BackToTop from '@/components/BackToTop'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  export default {
    name: "feedbackList",
    components: { ElSelectDropdown, BackToTop, Pagination },
    components: { ElSelectDropdown, BackToTop, Pagination },
    data() {
      return {
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
      }
    }
  }
</script>

<style scoped>

</style>
