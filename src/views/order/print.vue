<template>
    <div class="app-container">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>{{$t('Print_order')}}</span>
          <el-button style="float: right;" v-print="'#printOrder'">{{$t('Print')}}</el-button>
        </div>
        <div id="printOrder">
        <div class="text-center">
          <h1>{{$t('Order_info')}}</h1>
        </div>
        <el-table :data="orderDetail.orderGoods" border fit highlight-current-row>
          <el-table-column align="center" :label="$t('Merchandise_number')" prop="number"/>
          <el-table-column align="center" :label="$t('Merchandise_name')" prop="goodsName"/>
          <el-table-column align="center" :label="$t('Price')" prop="price"/>
          <el-table-column align="center" :label="$t('Number')" prop="number"/>
          <el-table-column align="center" :label="$t('Subtotal_')">
            <template slot-scope="scope">
              {{scope.row | goodsPriceFilter}}
            </template>
          </el-table-column>
        </el-table>
        <div style="border:2px solid #eeeeee;">
          <div style="line-height:50px;background-color: #E6E6E6">
<!--            <svg-icon icon-class="marker" style="color: #606266"/>-->
            <span class="font-small">订单备注</span>
          </div>
          <div style="height:80px;">
              <span v-if="orderDetail.order.message" class="font-small">
                {{orderDetail.order.message}}
              </span>
              <span v-else class="font-small">
                无
              </span>
          </div>
          <div>
            <el-form :inline="true"  label-position="left" style="text-align: right;">
                <el-form-item :label="$t('Merchandise_total_cost')">
                  <el-tag>{{orderDetail.order.goodsPrice}}</el-tag>
                </el-form-item>
                <el-form-item label="运费:">
                  <el-tag>{{orderDetail.order.freightPrice}}</el-tag>
                </el-form-item>
                <el-form-item label="订单总金额:">
                  <el-tag>{{orderDetail.order.orderPrice}}</el-tag>
                </el-form-item>
                <el-form-item :label="$t('Payment_method')">
                  <el-tag>{{payTypeMap[orderDetail.order.payType]}}</el-tag>
                </el-form-item>
            </el-form>
          </div>
        </div>
        <div>
          <el-row style="margin-bottom: 20px;">
            <el-col :span="2">
              手机号码
            </el-col>
            <el-col :span="4">
              {{orderDetail.order.mobile}}
            </el-col>
            <el-col :span="2">
              {{$t('Submission_time')}}
            </el-col>
            <el-col :span="4">
              {{orderDetail.order.addTime}}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">
              {{$t('Order_ID')}}
            </el-col>
            <el-col :span="4">
              {{orderDetail.order.orderSn}}
            </el-col>
            <el-col :span="2">
              {{$t('Receiving_Address')}}
            </el-col>
            <el-col :span="4">
              {{orderDetail.order.address}}
            </el-col>
          </el-row>
        </div>
        </div>
      </el-card>
    </div>
</template>

<script>
  const payTypeMap = {
    "1":this.$('Unpaid'),
    "2":this.$('Paypal'),
    "3":"globalpay",
    "4":"monerispay",
    "5":"apple pay"
  }
  import { detailOrder } from '@/api/order'
  export default {
    name: "print",
    data(){
      return {
        payTypeMap,
        orderDetail: {
          order: {},
          user: {},
          orderGoods: []
        },
/*        printObject: {
          id: "printOrder",
          popTitle: 'good print',
          extraCss: 'https://www.google.com,https://www.google.com',
          extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>'
        }*/
      }
    },
    created() {
      this.getDetail()
    },
    methods: {
      getDetail() {
        const id = this.$route.query.id
        console.log(id)
        detailOrder(id).then(response => {
          console.log(response)
          this.orderDetail = response.data.data
        })
      },
      print(){
        window.print()
      },

    },
    computed:{
      goodsPrice(row){
        console.log(row);
        return row.price * row.number;
      },
    },
    filters:{
      goodsPriceFilter(row){
        return row.price * row.number;
      }
    }
  }
</script>

<style scoped>
  .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }

  .table-cell {
    height: 60px;
    line-height: 40px;
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
<style media="printOrder">
  @page {
    margin: 0mm; /* this affects the margin in the printer settings */
  }
</style>
