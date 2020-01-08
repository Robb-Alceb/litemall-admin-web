<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.username" clearable class="filter-item" style="width: 200px;" placeholder="请输入用户账号"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('Search')}}</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" :element-loading-text="$t('Searching')" border fit highlight-current-row>
      <el-table-column align="center" width="100px" :label="$t('Member_ID')" prop="id" sortable/>

      <el-table-column align="center" :label="$t('Member_account')" prop="username"/>

      <el-table-column align="center" label="会员等级" prop="userLevel">
        <template slot-scope="scope">
          <el-tag >{{ levelDic[scope.row.userLevel] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="账户余额" prop="availableAmount"/>
      <el-table-column align="center" label="账户积分" prop="points"/>
      <el-table-column align="center" label="类型" prop="type">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 1" style="color:green;">账户充值:${{scope.row.amount}}</span>
          <span v-if="scope.row.type == 2" style="color:red;">账户消费:${{scope.row.amount}}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import { userBill } from '@/api/user'
  export default {
    name: "userBill",
    components: { Pagination },
    data(){
      return {
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          username: undefined,
          sort: 'add_time',
          order: 'desc'
        },
        levelDic: ['普通会员', '白银会员', '黄金会员', '铂金会员', '钻石会员']
      }
    },
    created(){
      this.getList()
    },
    methods: {
      getList(){
        userBill(this.listQuery).then(response => {
          this.list = response.data.data.list
          this.total = response.data.data.total
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      },
      handleFilter(){
        this.getList();
      }
    }
  }
</script>

<style scoped>

</style>
