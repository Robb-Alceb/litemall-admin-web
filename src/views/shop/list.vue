<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" :placeholder="$t('Please_enter_store_name')"/>
      <el-select v-model="listQuery.status" clearable class="filter-item" :placeholder="this.$t('Please_select')">
        <el-option :value="1" :label="$t('Open_for_business')"/>
        <el-option :value="2" :label="$t('Closed')"/>
        <el-option :value="3" :label="$t('Renovating')"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('Search')}}</el-button>
      <el-button v-permission="['POST /admin/shop/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">{{$t('Add')}}</el-button>
<!--      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{$t('Find')}}</el-button>-->
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" :element-loading-text="$t('Searching')" border fit highlight-current-row>

      <el-table-column align="center" :label="$t('Store_name')" prop="name"/>

      <el-table-column align="center" :label="$t('Store_address')" prop="streetAddress"/>

      <el-table-column align="center" :label="$t('Store_Manager')" prop="shopkeeper"/>

      <el-table-column align="center" :label="$t('成员')" prop="members"/>

      <el-table-column align="center" :label="$t('Time_added')" prop="addTime"/>

      <el-table-column align="center" :label="$t('Operation_Status')" prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status != 1 ? 'success' : 'error' ">{{ consStatus[scope.row.status]}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('Operate')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['GET /admin/shop/detail']" type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('Details')}}</el-button>
          <el-button v-permission="['DELETE /admin/shop/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">{{$t('Delete')}}</el-button>
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
  import ElSelectDropdown from 'element-ui/packages/select/src/select-dropdown'
  import { listShop, deleteShop } from '@/api/shop'
  import BackToTop from '@/components/BackToTop'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'ShopList',
  components: { ElSelectDropdown, BackToTop, Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        status: undefined,
        name: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      goodsDetail: '',
      detailDialogVisible: false,
      downloadLoading: false,
      consStatus:['',this.$t('Open_for_business'), this.$t('Closed'), this.$t('Renovating')]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listShop(this.listQuery).then(response => {
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
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {
      this.$router.push({ path: '/shop/create' })
    },
    handleUpdate(row) {
      this.$router.push({ path: '/shop/overview', query: { id: row.shopId }})
    },
    showDetail(detail) {
      this.goodsDetail = detail
      this.detailDialogVisible = true
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
      deleteShop(row.shopId).then(response => {
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
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['门店名称', '门店地址', '门店店长', '成员', '添加时间', '运营状态']
        const filterVal = ['name', 'address', 'shopkeeper', 'members', 'addTime', 'status']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '门店信息')
        this.downloadLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
