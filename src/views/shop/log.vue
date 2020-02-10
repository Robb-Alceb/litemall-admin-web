<template>

  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.content" clearable class="filter-item" style="width: 200px;" :placeholder="$t('Operator_details')"/>
      <el-input v-model="listQuery.createUserName" clearable class="filter-item" style="width: 200px;" :placeholder="$t('Operator')"/>
      <el-select v-model="listQuery.shopId" clearable style="width: 200px" class="filter-item" :placeholder="$t('Please_select_store_')">
        <el-option v-for="item in shops" :label="item.name" :value="item.id"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('Search')}}</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" :element-loading-text="$t('Searching')" border fit highlight-current-row>

      <el-table-column align="center" :label="$t('Journal_entry_number')" prop="id"/>

      <el-table-column align="center" :label="$t('Operator_details')" prop="content"/>

      <el-table-column align="center" :label="$t('Operator')" prop="createUserName"/>

      <el-table-column align="center" :label="$t('Operating_time')" prop="addTime"/>

      <el-table-column align="center" :label="$t('IP_Address')" prop="ipAddr"/>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { getLogs } from '@/api/shop'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { allForPerm } from '@/api/shop'
export default {
  name: 'ShopLog',
  components: { Pagination },
  data() {
    return {
      shops: [],
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        shopId: undefined,
        content: undefined,
        createUserName: undefined,
        sort: 'add_time',
        order: 'desc'
      }
    }
  },
  created() {
    const shopId = this.$route.query.id
    if (shopId) {
      this.listQuery.shopId = shopId
    }
    allForPerm().then(response=>{
      this.shops = response.data.data.list
    })
    this.getList()
  },
  methods: {
    getList() {
      getLogs(this.listQuery).then((res) => {
        this.list = res.data.data.list
        this.total = res.data.data.total
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
    }
  }
}
</script>

<style scoped>

</style>
