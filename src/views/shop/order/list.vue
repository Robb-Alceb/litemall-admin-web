<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-select v-model="listQuery.orderStatus" clearable class="filter-item" :placeholder="this.$t('Please_select')">
        <el-option :value="1" :label="$t('Awaiting_process')"/>
        <el-option :value="2" label="待付款"/>
        <el-option :value="3" label="待发货"/>
        <el-option :value="4" label="已发货"/>
        <el-option :value="5" :label="$t('Receive_confirm')"/>
        <el-option :value="6" :label="$t('Denied')"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('Search')}}</el-button>
      <!--      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleApplying">申请</el-button>-->
      <!--      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{$t('Find')}}</el-button>-->
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" :element-loading-text="$t('Searching')" border fit highlight-current-row>

      <el-table-column align="center" :label="$t('Servicing_number')" prop="orderSn"/>

      <el-table-column align="center" :label="$t('Request_time')" prop="addTime"/>

      <el-table-column align="center" :label="$t('Member_account')" prop="username"/>

      <el-table-column align="center" :label="$t('Service_types')" prop="serviceType">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.serviceType | serviceStatusFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('Store_location')" prop="shopName"/>

      <el-table-column align="center" :label="$t('Request_status')" prop="orderStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.orderStatus != 6 &&  scope.row.orderStatus != 5? 'success' : 'error' ">{{ statusMap[scope.row.orderStatus] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('Processing_time')" prop="updateTime"/>

      <el-table-column align="center" :label="$t('Operate')" width="100" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleDetail(scope.row)">{{$t('Details')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-tooltip placement="top" :content="$t('Back_to_top')">
      <back-to-top :visibility-height="100" />
    </el-tooltip>

  </div>
</template>

<script>
const statusMap = {
  1: this.$t('Awaiting_process'),
  2: '待付款',
  3: '待发货',
  4: this.$t('Sent_for_delivery'),
  5: this.$t('Receive_confirm'),
  6: this.$t('Denied')
}
const serviceMap = {
  1:'门店进货'
}
import BackToTop from '@/components/BackToTop'
import Pagination from '@/components/Pagination'
import { getShopOrderList } from '@/api/shop'
export default {
  name: 'ShopOrderList',
  components: { BackToTop, Pagination },
  filters: {
    serviceStatusFilter(status) {
      return serviceMap[status]
    }
  },
  data() {
    return {
      statusMap,
      serviceMap,
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
