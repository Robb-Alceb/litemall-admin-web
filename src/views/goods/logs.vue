<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.goodsSn" clearable class="filter-item" style="width: 200px;" placeholder="请输入商品编号"/>
      <el-input v-model="listQuery.addUserName" clearable class="filter-item" style="width: 200px;" placeholder="请输入操作者"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column align="center" label="商品编号" prop="goodsSn"/>

      <el-table-column align="center" label="操作内容" prop="content"/>

      <el-table-column align="center" label="操作者" prop="addUserName"/>

      <el-table-column align="center" label="操作时间" prop="addTime"/>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibility-height="100" />
    </el-tooltip>

  </div>
</template>

<script>
import { getGoodsLogs } from '@/api/goods'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import BackToTop from '@/components/BackToTop'
export default {
  name: 'GoodsLogs',
  components: { Pagination, BackToTop },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        goodsSn: undefined,
        addUserName: undefined,
        sort: 'add_time',
        order: 'desc'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getGoodsLogs(this.listQuery).then((res) => {
        this.listLoading = false
        this.list = res.data.data.list
        this.total = res.data.data.total
      })
    },
    handleFilter() {
      this.getList()
    }
  }
}
</script>

<style scoped>

</style>
