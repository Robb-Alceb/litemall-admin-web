<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-select v-model="listQuery.status" clearable class="filter-item" placeholder="请选择">
        <el-option :value="1" label="待处理"/>
        <el-option :value="2" label="待付款"/>
        <el-option :value="3" label="待发货"/>
        <el-option :value="4" label="已发货"/>
        <el-option :value="5" label="确认收货"/>
        <el-option :value="6" label="已拒绝"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <!--      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleApplying">申请</el-button>-->
      <!--      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>-->
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column align="center" label="服务编号" prop="orderSn"/>

      <el-table-column align="center" label="申请时间" prop="addTime"/>

      <el-table-column align="center" label="用户账号" prop="userName"/>

      <el-table-column align="center" label="服务类型" prop="serviceType"/>

      <el-table-column align="center" label="所在门店" prop="shopName"/>

      <el-table-column align="center" label="申请状态" prop="orderStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.orderStatus != 1 ? 'success' : 'error' ">{{ statusMap[scope.row.orderStatus] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="处理时间" prop="updateTime"/>

      <el-table-column align="center" label="操作" width="100" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibility-height="100" />
    </el-tooltip>

  </div>
</template>

<script>
const statusMap = {
  1: '待处理',
  2: '待付款',
  3: '待发货',
  4: '已发货 ',
  5: '确认收货',
  6: '已拒绝'
}
import BackToTop from '@/components/BackToTop'
import Pagination from '@/components/Pagination'
import { getShopOrderList } from '@/api/shop'
export default {
  name: 'ShopOrderList',
  components: { BackToTop, Pagination },
  data() {
    return {
      statusMap,
      list: [{
        orderSn: 'O00001',
        addTime: '2019-01-01 20:20:00',
        userName: '上海店长',
        serviceType: '门店进货',
        shopName: '上海门店',
        orderStatus: 1,
        updateTime: '2019-01-01 20:20:00'
      }],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        status: undefined,
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
      this.listLoading = true
      getShopOrderList(this.listQuery).then(response => {
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
      this.getList()
    },
    handleDetail(row) {
      this.$router.push({ path: '/shop/order/detail', query: { id: row.id }})
    }
  }
}
</script>

<style scoped>

</style>
