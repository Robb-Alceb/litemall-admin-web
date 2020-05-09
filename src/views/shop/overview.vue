<template>
    <div class="app-container dashboard-editor-container">
      <el-card>
        <div slot="header" class="clearfix">
          <span>{{$t('Basic_Information')}}</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="shopDetail()">{{$t('View_details')}}</el-button>
        </div>
        <el-row align="center">
          <el-col :span="4" align="right">
            {{$t('Store_Manager')}}:
          </el-col>
          <el-col :span="4">
            <span v-if="shopkeeper.nickName">{{shopkeeper.nickName}}</span>
            <span v-else>无</span>
          </el-col>
          <el-col :span="4" align="right">
            营业状态:
          </el-col>
          <el-col :span="4">
            <span v-if="shop.status == 1">正在营业</span>
            <span v-else-if="shop.status == 2">歇业</span>
            <span v-else="shop.status == 3">正在装修</span>
          </el-col>
          <el-col :span="4" align="right">
            {{$t('Store_Partner')}}:
          </el-col>
          <el-col :span="4">
            （{{shopMembers.length}}人）
          </el-col>
        </el-row>
      </el-card>
      <el-card style="margin-top: 20px">
        <div slot="header" class="clearfix">
          <span>{{$t('Sales_status')}}</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="salesDetail()">{{$t('Statistics_information')}}</el-button>
        </div>
        <el-row :gutter="40" class="panel-group">
          <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper icon-shoppingCard">
                <svg-icon icon-class="money" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">{{$t('Today_sales')}}</div>
                <count-to :start-val="0" :end-val="summary.todayAmount" :duration="2600" class="card-panel-num"/>
              </div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper icon-message">
                <svg-icon icon-class="message" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">{{$t('Sales_in_the_last_7_days')}}</div>
                <count-to :start-val="0" :end-val="summary.sevenAmount" :duration="3000" class="card-panel-num"/>
              </div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper icon-money">
                <svg-icon icon-class="message" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">{{$t('Historical_sales_data')}}</div>
                <count-to :start-val="0" :end-val="summary.allAmount" :duration="3200" class="card-panel-num"/>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <el-card style="margin-top: 20px">
        <div slot="header" class="clearfix">
          <span>{{$t('Ticket_status')}}</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="orderDetail()">{{$t('Order_details')}}</el-button>
        </div>
        <el-row :gutter="40" class="panel-group">
          <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper icon-shoppingCard">
                <svg-icon icon-class="money" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">{{$t('Todays_total_tickets')}}</div>
                <count-to :start-val="0" :end-val="summary.todayCount" :duration="2600" class="card-panel-num"/>
              </div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper icon-message">
                <svg-icon icon-class="message" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">{{$t('Ongoing_tickets')}}</div>
                <count-to :start-val="0" :end-val="summary.sevenCount" :duration="3000" class="card-panel-num"/>
              </div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
            <div class="card-panel" @click="handleSetLineChartData('purchases')">
              <div class="card-panel-icon-wrapper icon-money">
                <svg-icon icon-class="message" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">{{$t('Historical_tickets')}}</div>
                <count-to :start-val="0" :end-val="summary.allCount" :duration="3200" class="card-panel-num"/>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>

    <el-card style="margin-top: 20px">
      <div slot="header" class="clearfix">
        <span>{{$t('Merchandise_status')}}</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="goodsDetail()">{{$t('Merchandise_details')}}</el-button>
      </div>
      <el-row align="center">
        <el-col :span="4" align="right">
          {{$t('Total_merchandise_launched')}}:
        </el-col>
        <el-col :span="4">
          （{{summary.putOnSaleGoods}}）
        </el-col>
        <el-col :span="4" align="right">
          {{$t('Products_receiving_awaitng_process')}}:
        </el-col>
        <el-col :span="4">
          （{{summary.processingCount}}）
        </el-col>
        <el-col :span="4" align="right">
          {{$t('Current_inventory_value')}}:
        </el-col>
        <el-col :span="4">
          （{{summary.merchandiseTotalAmount}}）
        </el-col>
      </el-row>
    </el-card>
    </div>
</template>

<script>
  import CountTo from 'vue-count-to'
  import { detailShop, shopOverview } from '@/api/shop'
  import { getShopkeeper, getShopManager, getShopMembers } from '@/api/admin'
  export default {
    name: "overview",
    data(){
      return {
        shop:{},
        shopkeeper:{},
        shopManager:{},
        shopMembers:[],
        summary:{
          todayAmount:0,
          sevenAmount:0,
          allAmount:0,
          todayCount:0,
          sevenCount:0,
          allCount:0,
          putOnSaleGoods:0,
          processingCount:0
        }
      }
    },
    components: {
      CountTo
    },
    created(){
      this.initData()
    },
    methods:{
      initData(){
        const shopId = this.$route.query.id
        detailShop(shopId).then(response => {
          this.shop = response.data.data
        })

        //统计情况
        shopOverview(shopId).then(response => {
          this.summary = response.data.data
        })
        // 店长
        getShopkeeper(shopId).then(res=> {
          if(res.data.data){
            this.shopkeeper = res.data.data
          }
        })

        // 经理
        getShopManager(shopId).then(res=> {
          if(res.data.data){
            this.shopManager = res.data.data
          }
        })
        getShopMembers(shopId).then((res)=>{
          this.shopMembers = res.data.data
        })
      },
      shopDetail(){
        this.$router.push({path: '/shop/edit', query: {id: this.$route.query.id}})
      },
      goodsDetail(){
        this.$router.push({path: '/goods/list', query: {shopId: this.$route.query.id}})
      },
      orderDetail(){
        this.$router.push({path: '/order/list', query: {shopId: this.$route.query.id}})
      },
      salesDetail(){
        this.$router.push({path: '/statistics/sales', query: {shopId: this.$route.query.id}})
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }

  .panel-group {
    margin-top: 18px;

    .card-panel-col{
      margin-bottom: 32px;
    }
    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);
      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }
        .icon-people {
          background: #40c9c6;
        }
        .icon-message {
          background: #36a3f7;
        }
        .icon-money {
          background: #f4516c;
        }
        .icon-shoppingCard {
          background: #34bfa3
        }
      }
      .icon-people {
        color: #40c9c6;
      }
      .icon-message {
        color: #36a3f7;
      }
      .icon-money {
        color: #f4516c;
      }
      .icon-shoppingCard {
        color: #34bfa3
      }
      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }
      .card-panel-icon {
        float: left;
        font-size: 48px;
      }
      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;
        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }
        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }
</style>
