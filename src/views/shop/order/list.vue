<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-select v-model="listQuery.shopId" clearable style="width: 200px" class="filter-item" :placeholder="$t('Please_select_store_')">
        <el-option v-for="item in shops" :label="item.name" :value="item.id"/>
      </el-select>
      <el-select v-model="listQuery.orderStatus" clearable class="filter-item" :placeholder="this.$t('Please_select')">
        <el-option :value="1" :label="$t('Awaiting_process')"/>
        <el-option :value="2" label="待付款"/>
        <el-option :value="3" label="待发货"/>
        <el-option :value="4" label="已发货"/>
        <el-option :value="5" :label="$t('Receive_confirm')"/>
        <el-option :value="6" :label="$t('Denied')"/>
      </el-select>
      <el-date-picker clearable
        class="filter-date-item"
        v-model="dateRange"
        type="daterange"
        value-format="yyyy-MM-dd"
        range-separator="-"
        start-placeholder="处理开始日期"
        end-placeholder="处理结束日期">
      </el-date-picker>
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
          <el-tag>{{ serviceStatusFilter(scope.row.serviceType)  }}</el-tag>
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

import BackToTop from '@/components/BackToTop'
import Pagination from '@/components/Pagination'
import { getShopOrderList } from '@/api/shop'
import { allForPerm } from '@/api/shop'
export default {
  name: 'ShopOrderList',
  components: { BackToTop, Pagination },
  filters: {

  },
  data() {
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
    return {
      dateRange:[],
      shops:[],
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
        shopId:undefined,
        orderStatus: undefined,
        startDate:undefined,
        endDate:undefined,
        sort: 'add_time',
        order: 'desc'
      }
    }
  },
  created() {
    this.getList()
    allForPerm().then(response=>{
      this.shops = response.data.data.list
    })
  },
  methods: {
    serviceStatusFilter(status) {
      return this.serviceMap[status]
    },
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
      if(this.dateRange && this.dateRange.length == 2){
        this.listQuery.startDate = this.dateRange[0]
        this.listQuery.endDate = this.dateRange[1]
      }else{
        this.listQuery.startDate = undefined
        this.listQuery.endDate = undefined
      }
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
