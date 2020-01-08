<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.goodsSn" clearable class="filter-item" style="width: 200px;" :placeholder="$t('Please_enter_merchandise_ID')"/>
      <el-input v-model="listQuery.userName" clearable class="filter-item" style="width: 200px;" :placeholder="$t('Please_enter_operator')"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('Search')}}</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" :element-loading-text="$t('Searching')" border fit highlight-current-row>

      <el-table-column align="center" :label="$t('Merchandise_code')" prop="goodsSn"/>

      <el-table-column align="center" label="商品名" prop="goodsName"/>

      <el-table-column align="center" :label="$t('Operator_details')" prop="content"/>

      <el-table-column align="center" :label="$t('Operator')" prop="userName"/>

      <el-table-column align="center" :label="$t('Operating_time')" prop="addTime"/>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-tooltip placement="top" :content="$t('Back_to_top')">
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
        goodsId:undefined,
        goodsSn: undefined,
        userName: undefined,
        sort: 'add_time',
        order: 'desc'
      }
    }
  },
  created() {
    if(this.$route.query.id){
      this.listQuery.goodsId = parseInt(this.$route.query.id)
    }
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
