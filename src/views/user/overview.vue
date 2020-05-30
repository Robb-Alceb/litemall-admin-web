<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <h4>用户概览</h4>
    </div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>用户信息</span>
        <div  class="table-layout">
          <el-row>
            <el-col :span="4" class="table-cell-title" style="height: 111px;">
              <el-row align="center">
                <img :src="userInfo.user.avatar" width="60">
                <br>
                <span>{{levelDic[userInfo.user.userLevel]}}</span>
              </el-row>
            </el-col>
            <el-col :span="20">
              <el-row>
                <el-col :span="4" class="table-cell-title">
                  用户账户
                </el-col>
                <el-col :span="8" class="table-cell">
                  {{userInfo.user.username}}
                </el-col>
                <el-col :span="4" class="table-cell-title">
                  用户昵称
                </el-col>
                <el-col :span="8" class="table-cell">
                  {{userInfo.user.nickname}}
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="20">
              <el-row>
                <el-col :span="4" class="table-cell-title">
                  性别
                </el-col>
                <el-col :span="8" class="table-cell">
                  {{genderDic[userInfo.user.gender]}}
                </el-col>
                <el-col :span="4" class="table-cell-title">
                  会员会费
                </el-col>
                <el-col :span="8" class="table-cell">
                  $ {{userInfo.user.availableAmount}}
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="20">
              <el-row>
                <el-col :span="4" class="table-cell-title">
                  生日
                </el-col>
                <el-col :span="8" class="table-cell" v-if="userInfo.user.birthday">
                  {{userInfo.user.birthday}}
                </el-col>
                <el-col :span="8" class="table-cell" v-else>
                  &nbsp;
                </el-col>
                <el-col :span="4" class="table-cell-title">
                  注册时间
                </el-col>
                <el-col :span="8" class="table-cell">
                  {{userInfo.user.addTime}}
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>账户详情</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="4" class="table-cell-title">账户余额</el-col>
          <el-col :span="4" class="table-cell-title">消费金额</el-col>
          <el-col :span="4" class="table-cell-title">订单数量</el-col>
          <el-col :span="4" class="table-cell-title">可用积分</el-col>
          <el-col :span="4" class="table-cell-title">优惠券</el-col>
          <!--<el-col :span="4" class="table-cell-title">登录次数</el-col>-->
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">$ {{userInfo.user.availableAmount}}</el-col>
          <el-col :span="4" class="table-cell">$ {{amount}}</el-col>
          <el-col :span="4" class="table-cell">{{ userInfo.orders.length }}</el-col>
          <el-col :span="4" class="table-cell">{{ userInfo.user.points }}</el-col>
          <el-col :span="4" class="table-cell">{{couponCount}}</el-col>
<!--          <el-col :span="4" class="table-cell">10</el-col>-->
        </el-row>
      </div>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{$t('Receiving_Address')}}</span>
      </div>
      <!-- 查询结果 -->
      <el-table :data="userInfo.addressList" border fit highlight-current-row>
        <el-table-column align="center" width="100px" label="地址ID" prop="id" sortable/>
        <el-table-column align="center" min-width="100px" :label="$t('Member_ID')" prop="userId"/>
        <el-table-column align="center" min-width="100px" label="收货人名称" prop="name"/>
        <el-table-column align="center" min-width="100px" :label="$t('Cellphone_number')" prop="tel"/>
        <el-table-column align="center" min-width="300px" label="区域地址">
          <template slot-scope="scope">
            {{ scope.row.province + scope.row.city + scope.row.county }}
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="300px" label="详细地址" prop="addressDetail"/>

        <el-table-column align="center" min-width="80px" label="默认" prop="isDefault">
          <template slot-scope="scope">
            {{ scope.row.isDefault ? '是' : '否' }}
          </template>
        </el-table-column>

      </el-table>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>订单记录</span>
      </div>
      <el-table v-loading="listOrderLoading" :data="orderList" border fit highlight-current-row>
        <el-table-column align="center" min-width="100" :label="$t('Order_ID')" prop="orderSn"/>
        <el-table-column align="center" min-width="100" :label="$t('Store')" prop="shopId">
          <template slot-scope="scope">
            {{getShopName(scope.row.shopId)}}
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="100" label="提交时间" prop="addTime"/>
        <el-table-column align="center" :label="$t('Member_account')" prop="userName"/>
        <el-table-column align="center" :label="$t('Payment_method')" prop="payType">
          <template slot-scope="scope">
            <el-tag>{{ payTypeFilter(scope.row.payType)  }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('Source_of_order')" prop="orderSource">
          <template slot-scope="scope">
            <el-tag>{{ orderSourceFilter(scope.row.orderSource)  }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('Order_status')" prop="orderStatus">
          <template slot-scope="scope">
            <el-tag>{{ orderStatusFilter(scope.row.orderStatus) }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('Operate')" width="200" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-permission="['GET /admin/order/detail']" type="primary" size="mini" @click="handleDetail(scope.row)">{{$t('Details')}}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="orderTotal>0" :total="orderTotal" :page.sync="listOrderQuery.page" :limit.sync="listOrderQuery.limit" @pagination="getOrderList" />
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>账户明细</span>

        <label  style="float: right; padding: 3px 0">{{$t('总充值')}}:{{statistics.totalSaving}}</label>
        <label  style="float: right; padding: 3px 0">{{$t('总消费')}}:{{statistics.totalConsume}}</label>
        <label  style="float: right; padding: 3px 0">{{$t('余额')}}:{{statistics.totalBalance}}</label>
      </div>
      <!-- 查询结果 -->
      <el-table v-loading="listBillLoading" :data="billList" :element-loading-text="$t('Searching')" border fit highlight-current-row>
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

      <pagination v-show="billTotal>0" :total="billTotal" :page.sync="listBillQuery.page" :limit.sync="listBillQuery.limit" @pagination="getBillList" />
    </el-card>
  </el-card>
</template>

<script>

  import { userInfo, billStatistics } from '@/api/user'
  import { allForPerm } from '@/api/shop'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import { userBill } from '@/api/user'
  import { listOrder } from '@/api/order'

  export default {
    name: "userOverview",
    components: { Pagination },
    data(){
      const statusMap = {
        101: this.$t('Unpaid1'),
        102: this.$t('Member_cancelled'),
        103: this.$t('System_cancelled'),
        201: this.$t('Paid'),
        202: this.$t('Apply_for_refund'),
        203: this.$t('Refunded'),
        301: this.$t('Sent_for_delivery'),
        401: this.$t('Member_received'),
        402: this.$t('System_received')
      }

      const payTypeMap = {
        1: this.$t('Unpaid'),
        2: this.$t('Paypal')
      }

      const orderSourceMap = {
        1: '手机app'
      }
      return {
        statusMap,
        payTypeMap,
        orderSourceMap,
        userInfo: {
          user: {avatar:''},
          addressList: [],
          orders: [],
          billList: []
        },
        listOrderQuery: {
          page: 1,
          limit: 10,
          userId: undefined,
          sort: 'add_time',
          order: 'desc'
        },
        orderList: [],
        orderTotal : 0,
        listOrderLoading : false,

        listBillQuery: {
          page: 1,
          limit: 10,
          userId: undefined,
          sort: 'add_time',
          order: 'desc'
        },
        billList : [],
        billTotal : 0,
        listBillLoading : false,
        couponCount: 0,
        amount: 0,
        genderDic: ['','其他', '女', '男'],
        levelDic: ['普通会员', '白银会员', '黄金会员', '铂金会员', '钻石会员'],
        statistics: {}
      }
    },
    filters: {

    },
    created() {
      this.listBillQuery.userId = this.$route.query.id
      this.getData()
      this.getOrderList()
      this.getBillList()
      allForPerm().then(response=>{
        this.shops = response.data.data.list
      })
      billStatistics(this.$route.query.id).then(response=>{
        this.statistics = response.data.data
      })
    },
    methods: {
      orderStatusFilter(status) {
        return this.statusMap[status]
      },
      payTypeFilter(type){
        return this.payTypeMap[type]
      },
      orderSourceFilter(source){
        return this.orderSourceMap[source]
      },
      getData(){
        userInfo(this.$route.query.id).then(response=>{
          this.userInfo = response.data.data
          if(this.userInfo.orders && this.userInfo.orders.length > 0){
            this.userInfo.orders.forEach(order=>{
              order.username = this.userInfo.user.username
              this.amount += order.orderPrice
            })
          }
        })
      },
      getShopName(shopId){
        if(this.shops){
          let shop =  this.shops.find(shop=>{
            if(shop.id == shopId){
              return true
            }
          })
          if(shop){
            return shop.name
          }
        }
      },
      handleDetail(row){
        this.$router.push({path: '/order/detail', query:{id:row.id}})
      },
      getBillList(){
        userBill(this.listBillQuery).then(response => {
          this.billList = response.data.data.list
          this.billTotal = response.data.data.total
          this.listBillLoading = false
        }).catch(() => {
          this.billList = []
          this.billTotal = 0
          this.listBillLoading = false
        })
      },
      getOrderList(){
        listOrder(this.listOrderQuery).then(response => {
          this.orderList = response.data.data.list
          this.orderTotal = response.data.data.total
          this.listOrderLoading = false
        }).catch(() => {
          this.orderList = []
          this.orderTotal = 0
          this.listOrderLoading = false
        })
      }
    }
  }
</script>


<style scoped>
  .detail-container {
    width: 80%;
    padding: 20px 20px 20px 20px;
    margin: 20px auto;
  }

  .operate-container {
    background: #F2F6FC;
    height: 80px;
    margin: -20px -20px 0;
    line-height: 80px;
  }

  .operate-button-container {
    float: right;
    margin-right: 20px
  }

  .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }

  .table-cell {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }

  .table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
  }
</style>

