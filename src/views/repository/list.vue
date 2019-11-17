<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.userId" clearable class="filter-item" style="width: 200px;" placeholder="服务编号"/>
      <el-select v-model="listQuery.orderStatusArray" multiple style="width: 200px" class="filter-item" placeholder="请选择申请状态">
        <el-option v-for="(key, value) in statusMap" :key="key" :label="key" :value="value"/>
      </el-select>
      <el-button v-permission="['GET /admin/repository/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column align="center" min-width="100" label="服务编号" prop="repSn"/>

      <el-table-column align="center" min-width="100" label="申请时间" prop="addTime"/>

      <el-table-column align="center" label="用户账号" prop="userName"/>

      <el-table-column align="center" label="服务类型" prop="type">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.type | typeFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="所在门店" prop="shopName"/>

      <el-table-column align="center" label="申请状态" prop="status">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.status | orderStatusFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="处理时间" prop="updateTime"/>

      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['GET /admin/order/detail']" type="primary" size="mini" @click="handleDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>


<script>
  const typeMap = {
    1: '进货'
  }
  const statusMap = {
    1: '待处理',
    2: '已处理',
    3: '已取消',
    4: '已拒绝'
  }
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  export default {
    name: "repositoryList",
    components: { Pagination },
    data(){
      return {
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
      orderStatusFilter(row){
        return statusMap[row]
      },
      typeFilter(row){
        return typeMap[row]
      }
    }
  }
</script>

<style scoped>

</style>
