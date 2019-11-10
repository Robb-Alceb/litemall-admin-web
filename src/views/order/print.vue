<template>
    <div class="app-container">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>订单打印</span>
          <el-button style="float: right;" @click="print()">打印</el-button>
        </div>
        <div class="text-center">
          <h1>订单信息</h1>
        </div>
        <el-table :data="orderDetail.orderGoods" border fit highlight-current-row>
          <el-table-column align="center" label="货号" prop="number"/>
          <el-table-column align="center" label="商品名称" prop="goodsName"/>
          <el-table-column align="center" label="价格" prop="price"/>
          <el-table-column align="center" label="数量" prop="number"/>
          <el-table-column align="center" label="小计">
            <template slot-scope="scope">
              {{scope.row | goodsPriceFilter}}
            </template>
          </el-table-column>
        </el-table>
        <div>
          <div style="margin-top: 20px">
            <svg-icon icon-class="marker" style="color: #606266"/>
            <span class="font-small">订单备注</span>
          </div>
          <div class="table-layout" style="margin-bottom: 20px;border:2px solid #eeeeee;">
            <el-row style="margin: 30px">
              <span class="font-small">
                少糖。。。。
              </span>
            </el-row>
          </div>
        </div>
        <el-form :inline="true"  label-position="left" style="margin-left: 600px;">
            <el-form-item label="商品总价:">
              <el-tag>100</el-tag>
            </el-form-item>
            <el-form-item label="运费:">
              <el-tag>10</el-tag>
            </el-form-item>
            <el-form-item label="订单总金额:">
              <el-tag>10</el-tag>
            </el-form-item>
            <el-form-item label="支付方式:">
              <el-tag>支付宝</el-tag>
            </el-form-item>
        </el-form>
        <div>
          <el-row style="margin-bottom: 20px;">
            <el-col :span="2">
              手机号码
            </el-col>
            <el-col :span="4">
              130000000
            </el-col>
            <el-col :span="2">
              提交时间
            </el-col>
            <el-col :span="4">
              2019-10-10 22:22:00
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">
              订单编号
            </el-col>
            <el-col :span="4">
              N1000
            </el-col>
            <el-col :span="2">
              收货地址
            </el-col>
            <el-col :span="4">
              中国北京朝阳区
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>
</template>

<script>
  import { detailOrder } from '@/api/order'
  export default {
    name: "print",
    data(){
      return {
        orderDetail: {
          order: {},
          user: {},
          orderGoods: []
        },
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
