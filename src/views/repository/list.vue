<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.userId" clearable class="filter-item" style="width: 200px;" :placeholder="$t('Servicing_number')"/>
      <el-select v-model="listQuery.orderStatusArray" multiple style="width: 200px" class="filter-item" :placeholder="$t('Please_select_request_status')">
        <el-option v-for="(key, value) in statusMap" :key="key" :label="key" :value="value"/>
      </el-select>
      <el-button v-permission="['GET /admin/repository/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('Search')}}</el-button>
<!--      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{$t('Find')}}</el-button>-->
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" :element-loading-text="$t('Searching')" border fit highlight-current-row>

      <el-table-column align="center" min-width="100" :label="$t('Servicing_number')" prop="repSn"/>

      <el-table-column align="center" min-width="100" :label="$t('Request_time')" prop="addTime"/>

      <el-table-column align="center" :label="$t('Member_account')" prop="userName"/>

      <el-table-column align="center" :label="$t('Service_types')" prop="type">
        <template slot-scope="scope">
          <el-tag>{{ typeFilter(scope.row.type) }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('Store_location')" prop="shopName"/>

      <el-table-column align="center" :label="$t('Request_status')" prop="status">
        <template slot-scope="scope">
          <el-tag>{{ orderStatusFilter(scope.row.status) }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('Processing_time')" prop="updateTime"/>

      <el-table-column align="center" :label="$t('Operate')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['GET /admin/order/detail']" type="primary" size="mini" @click="handleDetail(scope.row)">{{$t('Details')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>


<script>

  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  export default {
    name: "repositoryList",
    components: { Pagination },
    data(){
      const typeMap = {
        1: this.$t('Purchase')
      }
      const statusMap = {
        1: this.$t('Awaiting_process'),
        2: this.$t('Processed'),
        3: this.$t('Cancelled'),
        4: this.$t('Denied')
      }
      return {
        typeMap,
        statusMap,
        downloadLoading:false,
        list: [{
          repSn: "N 10001",
          addTime: "2019-08-04 22:09:23",
          userName: "张三",
          type: 1,
          shopName: "门店1",
          status: 1,
          updateTime: "2019-10-04 22:09:23"
        },{
          repSn: "N 10002",
          addTime: "2019-08-04 22:09:23",
          userName: "张三",
          type: 1,
          shopName: "门店1",
          status: 2,
          updateTime: "2019-10-04 22:09:23"
        },{
          repSn: "N 10003",
          addTime: "2019-08-04 22:09:23",
          userName: "李四",
          type: 1,
          shopName: "门店5",
          status: 4,
          updateTime: "2019-10-04 22:09:23"
        }],
        total: 0,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 20,
          id: undefined,
          name: undefined,
          orderStatusArray: [],
          sort: 'add_time',
          order: 'desc'
        },
        statusMap,
        typeMap
      }
    },
    created() {
      this.getList()
    },
    methods: {
      orderStatusFilter(row){
        return this.statusMap[row]
      },
      typeFilter(row){
        return this.typeMap[row]
      },
      getList(){

      },
      handleDetail(row){

      },
      handleFilter(){

      },
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['订单ID', '订单编号', '用户ID', '订单状态', '是否删除', '收货人', '收货联系电话', '收货地址']
          const filterVal = ['id', 'orderSn', 'userId', 'orderStatus', 'isDelete', 'consignee', 'mobile', 'address']
          excel.export_json_to_excel2(tHeader, this.list, filterVal, '订单信息')
          this.downloadLoading = false
        })
      }
    },
    filters: {

    }
  }
</script>

<style scoped>

</style>
