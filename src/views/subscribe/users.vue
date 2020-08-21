<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" :placeholder="$t('请输入用户名称')"/>
      <el-select v-model="listQuery.shopId" clearable class="filter-item"  :placeholder="$t('请选择门店')">
        <el-option v-for="item in shopOps" :value="item.id" :label="item.name">{{item.name}}</el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('Search')}}</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" :element-loading-text="$t('Searching')" border fit highlight-current-row>

      <el-table-column align="center" :label="$t('用户名')">
        <template slot-scope="scope">
          {{scope.row.nickname || scope.row.userName}}
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('订阅商品')" prop="goodsName">

      </el-table-column>

      <el-table-column align="center" :label="$t('订阅方式')" prop="method">
        <template slot-scope="scope">
          <el-tag>{{filterMethod(scope.row.method)}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('配送门店')" prop="shopName">

      </el-table-column>
      <!--订单类型(1:自提；2：外送;3:堂食；4：邮寄)-->
      <el-table-column align="center" :label="$t('配送方式')">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.deliveryMethod == 1">{{$t('自提')}}</el-tag>
          <el-tag v-else-if="scope.row.deliveryMethod == 2">{{$t('门店配送')}}</el-tag>
          <el-tag v-else-if="scope.row.deliveryMethod == 3">{{$t('堂食')}}</el-tag>
          <el-tag v-else>{{$t('邮寄')}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('配送日期')" prop="deliveryDays">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.method == 2">{{$t('每周')}}{{scope.row.deliveryDays}}</el-tag>
          <el-tag v-else-if="scope.row.method == 3">{{$t('每月')}}{{scope.row.deliveryDays}}</el-tag>
          <el-tag v-else>{{$t('每天')}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('配送时间范围')">
        <template slot-scope="scope">
          <el-tag >{{scope.row.deliveryStartTime}}</el-tag>
          <el-tag >{{scope.row.deliveryEndTime}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('订阅有效期')"  width="200" >
        <template slot-scope="scope">
          <el-tag >{{scope.row.startTime}}</el-tag>
          <el-tag >{{scope.row.endTime}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('自动续订')" prop="members">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.autoSub" :disabled="true" :active-value="true" :nactive-value="false" active-color="#13ce66" inactive-color="#ff4949"/>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('Time_added')" prop="addTime"/>

<!--      <el-table-column align="center" :label="$t('Operate')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['GET /admin/subscribe/read']" type="primary" size="mini" @click="handleDetail(scope.row)">{{$t('详情')}}</el-button>
        </template>
      </el-table-column>-->
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-tooltip placement="top" :content="$t('Back_to_top')">
      <back-to-top :visibility-height="100" />
    </el-tooltip>
  </div>
</template>

<script>
  import { goodsOps } from '@/api/goods'
  import { shopOps } from '@/api/shop'
  import {subscribeusers} from '@/api/subscribe'
  import BackToTop from '@/components/BackToTop'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  export default {
    name: "users",
    components: { BackToTop, Pagination },
    data(){
      return {
        list: [],
        total: 0,
        listLoading: false,
        listQuery: {
          name: undefined,
          shopId: undefined,
          goodsId: undefined,
          page: 1,
          limit: 20,
          name: undefined,
          sort: 'add_time',
          order: 'desc'
        },
        goodsOps: [],
        shopOps: []
      }
    },
    created() {
      this.getList()
      this.getGoodsOps();
      this.getShopOps();
    },
    methods: {
      getGoodsOps(){
        goodsOps().then(response=>{
          this.goodsOps = response.data.data
        })
      },
      getShopOps(){
        shopOps().then(response=>{
          this.shopOps = response.data.data
        })
      },
      getList() {
        this.listLoading = true
        subscribeusers(this.listQuery).then(response => {
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
      filterMethod(method){
        if(method == 1){
          return this.$t('周')
        }else if(method == 2){
          return this.$t('月')
        }else{
          return this.$t('年')
        }
      },
      handleDetail(item){
        this.$router.push({path: '/subscribe/user/detail', query: {id: item.id}})
      }
    }
  }
</script>

<style scoped>

</style>
