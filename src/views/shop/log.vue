<template>

  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.content" clearable class="filter-item" style="width: 200px;" placeholder="操作内容"/>
      <el-input v-model="listQuery.createUserName" clearable class="filter-item" style="width: 200px;" placeholder="操作者"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column align="center" label="日志编号" prop="id"/>

      <el-table-column align="center" label="操作内容" prop="content"/>

      <el-table-column align="center" label="操作者" prop="createUserName"/>

      <el-table-column align="center" label="操作时间" prop="addTime"/>

      <el-table-column align="center" label="ip地址" prop="ipAddr"/>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />


  </div>
</template>

<script>
  import {getLogs} from '@/api/shop'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  export default {
    name: "shopLog",
    components:{Pagination},
    data(){
      return {
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
    created(){
      let shopId = this.$route.query.id
      if(shopId){
        this.listLoading.shopId = shopId
      }
      this.getList()
    },
    methods: {
      getList(){
        getLogs(this.listQuery).then((res)=>{
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
      },
    }
  }
</script>

<style scoped>

</style>
