<template>
  <div class="app-container">
    <el-card class="box-card">
      <h3>进货详情</h3>
      <div v-if="orderDetail.orderStatus != 6">
        <el-steps :active="formatStepStatus(orderDetail.orderStatus)" finish-status="success" align-center>
          <el-step :title="$t('申请调货')"/>
          <el-step :title="$t('同意调货')" />
          <!--          <el-step title="支付付款" />-->
          <el-step :title="$t('erp处理发货')" />
          <el-step :title="$t('Receive_confirm')" />
        </el-steps>
      </div>
      <div v-else>
        <el-steps :active="6" finish-status="error" align-center>
          <el-step :title="$t('申请调货')"/>
          <el-step :title="$t('同意调货')" />
<!--          <el-step title="支付付款" />-->
          <el-step :title="$t('erp处理发货')" />
          <el-step :title="$t('Receive_confirm')" />
          <el-step :title="$t('Denied')"/>
        </el-steps>
      </div>

      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"/>
        <span class="font-small">货品信息</span>
      </div>
      <div class="table-layout">
        <el-table v-loading="listLoading" :data="merchandises" :element-loading-text="$t('Searching')" border fit highlight-current-row>
          <el-table-column align="center" :label="$t('Merchandise_number')" prop="merchandiseSn"/>
          <el-table-column align="center" :label="$t('Product_name')" prop="merchandiseName"/>
<!--          <el-table-column align="center" :label="$t('Merchandise_picture')" prop="addTime">
            <template slot-scope="scope">
              <img :src="scope.row.picUrl" width="40">
            </template>
          </el-table-column>-->
          <el-table-column align="center" label="现有库存" prop="store">
            <template slot-scope="scope">
<!--              <img :src="scope.row.picUrl" width="40">-->
              {{scope.row.store}}
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('Price')" prop="price"/>
          <el-table-column align="center" label="订货数量" prop="number"/>
          <el-table-column align="center" :label="$t('Subtotal_')">
            <template slot-scope="scope">
              {{scope.row.price*scope.row.number}}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--<div class="table-layout">
        <el-row>
          <el-col :span="4" class="table-cell-title">货品名称</el-col>
          <el-col :span="4" class="table-cell-title">货品图片</el-col>
          <el-col :span="4" class="table-cell-title">现有库存</el-col>
          <el-col :span="4" class="table-cell-title">价格/货号</el-col>
          <el-col :span="4" class="table-cell-title">订货数量</el-col>
          <el-col :span="4" class="table-cell-title">小计</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">{{merchandises[0].merchandiseName}}</el-col>
          <el-col :span="4" class="table-cell">
            <template slot-scope="scope">
              <img :src="scope.row.picUrl" width="40">
            </template>
          </el-col>
          <el-col :span="4" class="table-cell">4000</el-col>
          <el-col :span="4" class="table-cell">{{merchandises[0].price}}/{{merchandises[0].merchandiseSn}}</el-col>
          <el-col :span="4" class="table-cell">{{merchandises[0].number}}</el-col>
          <el-col :span="4" class="table-cell">{{merchandises[0].price*merchandises[0].number}}</el-col>
        </el-row>
      </div>-->

      <div class="table-layout" align="center">
        <el-row>
          <el-col :span="6" class="table-cell-name">服务单号</el-col>
          <el-col :span="18" align="left" class="table-cell-content">
            {{orderDetail.orderSn}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-name">$t('Request_status')</el-col>
          <el-col :span="18" align="left" class="table-cell-content">
            {{orderStatusMap[orderDetail.orderStatus]}}
          </el-col>
        </el-row>
<!--        <el-row>
          <el-col :span="6" class="table-cell-name">货物编号</el-col>
          <el-col :span="18" align="left" class="table-cell-content">
            {{}}
          </el-col>
        </el-row>-->
        <el-row>
          <el-col :span="6" class="table-cell-name">{{$t('Request_time')}}</el-col>
          <el-col :span="18" align="left" class="table-cell-content">
            {{orderDetail.addTime}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-name">{{$t('Member_account')}}</el-col>
          <el-col :span="18" align="left" class="table-cell-content">
            {{orderDetail.username}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-name">联系人</el-col>
          <el-col :span="18" align="left" class="table-cell-content">
            {{orderDetail.consignee}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-name">{{$t('Contact_number')}}</el-col>
          <el-col :span="18" align="left" class="table-cell-content">
            {{orderDetail.mobile}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-name">{{$t('Store_location')}}</el-col>
          <el-col :span="18" align="left" class="table-cell-content">
            {{orderDetail.shopName}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-name">订货描述</el-col>
          <el-col :span="18" align="left" class="table-cell-content">
            {{orderDetail.orderRemark}}
          </el-col>
        </el-row>
      </div>
      <div class="table-layout"  v-permission="['POST /admin/shopOrder/orderPass']">
        <el-form style="margin-top: 10px;">
          <el-form ref="passForm" :model="passForm" label-width="150px">
<!--            <el-form-item v-if="orderDetail.orderStatus == 1" label="运费价格" prop="shipPrice">
              <el-input v-model="passForm.shipPrice"/>
            </el-form-item>-->
            <el-form-item label="处理备注" prop="mobile">
              <el-input v-model="passForm.handleRemark" type="textarea"/>
            </el-form-item>
          </el-form>
        </el-form>
      </div>
    </el-card>

    <div class="op-container" style="margin-top: 20px;">
      <el-button @click="handleCancel">{{$t('返回')}}</el-button>
<!--      <el-button v-if="orderDetail.orderStatus == 3" v-permission="['POST /admin/shopOrder/deliverGoods']" type="primary" @click="handleDeliverGoods">同意发货</el-button>-->
<!--      <el-button v-if="orderDetail.orderStatus == 3" v-permission="['POST /admin/shopOrder/cancelDeliverGoods']" type="danger" @click="handleCancelDeliverGoods">拒绝发货</el-button>-->
      <el-button v-if="orderDetail.orderStatus == 2" v-permission="['POST /admin/shopOrder/orderPay']" type="primary" @click="handleOrderPay">支付货款</el-button>
      <el-button v-if="orderDetail.orderStatus == 1" v-permission="['POST /admin/shopOrder/orderPass']" type="primary" @click="handleOrderPass">同意调货</el-button>
      <el-button v-if="orderDetail.orderStatus == 1" v-permission="['POST /admin/shopOrder/orderNoPass']" type="danger" @click="handleOrderNoPass">拒绝调货</el-button>
      <el-button v-if="orderDetail.orderStatus == 4" v-shop="true" v-permission="['POST /admin/shopOrder/takeDelivery']" type="primary" @click="handleTakeDelivery">确认收货</el-button>
    </div>
  </div>
</template>

<script>
import {shopOrderDetail, shopOrderPass, shopOrderNoPass, shopOrderPay, shopDeliverGoods, shopCancelDeliverGoods, shopTakeDelivery, merchandiseNumber} from '@/api/shop'
import {materialApply} from '@/api/erp'
import { MessageBox } from 'element-ui'

const orderStatusMap = {
  1:'待调货',
  2:'代付款',
  3:'代发货',
  4:'待确认',
  5:'完成',
  6:'拒绝'
}
export default {
  name: 'ShopOrderDetail',
  data() {
    const validateDouble = (rule, value, callback) => {
      console.log('value' + value)
      if (!/^[0-9,.]*$/.test(value)) {
        callback(new Error('运费价格必须为数字'))
      } else {
        callback()
      }
    }
    return {
      listLoading:true,
      orderStatusMap,
      validateDouble,
      orderId:undefined,
      orderDetail: {
      },
      merchandises:[],
      passForm:{
        shipPrice:undefined,
        handleRemark:undefined
      },
      passRules: {
        number: [
          { shipPrice: true, message: '申请数量不能为空', trigger: 'change' },
          { validator: validateDouble, message: '申请数量不能为非数字', trigger: 'change' }
        ],
        userId: [{ required: true, message: '联系人不能为空', trigger: 'blur' }]
      }
    }
  },
  filters: {
    hasNumber: async function(row){


    }
  },
  created(){
    if(this.$route.query.id){
      this.orderId = this.$route.query.id
    }
    this.getDetail()
  },
  methods: {
    getDetail(){
      shopOrderDetail(this.orderId).then(res=>{
        this.listLoading = false
        this.orderDetail = res.data.data.order
        this.merchandises = res.data.data.merchandises

        this.merchandises.forEach(merchandise=>{
          let queryParam = {
            shopId: this.orderDetail.shopId,
            merchandiseId: merchandise.merchandiseId
          }
          merchandiseNumber(queryParam).then(res=>{
            merchandise.store = res.data.data
          })
        })
      })/*.finally(()=>{
        this.$forceUpdate()
      })*/
    },
    formatStepStatus(value) {
      /*if (value === 2) {
        // 支付
        return 2
      } else if (value === 3) {
        // 处理发货
        return 3
      } else if (value === 4) {
        // 确认发货
        return 4
      } else if(value === 5){
        // 确认收货
        return 5
      } else {
        // 同意调货、拒绝调货
        return 1
      }*/

      if (value === 2) {
        // 支付
        return 2
      } else if (value === 3) {
        // 处理发货
        return 2
      } else if (value === 4) {
        // 确认发货
        return 3
      } else if(value === 5){
        // 确认收货
        return 4
      } else {
        // 同意调货、拒绝调货
        return 1
      }
    },
/*    hasNumber(merchandiseSn){
      let queryParam = {
        shopId: this.orderDetail.shopId,
        merchandiseSn: merchandiseSn
      }

      return merchandiseNumber(queryParam).then(res=>{
        return res.data.data.number
      })
    },*/
    handleCancel(){
      this.$router.push({path:'/repository/list'})
    },
    handleOrderPass(){
      this.passForm.adminOrderId = this.orderDetail.id
      this.$refs['passForm'].validate(valid => {
        if (valid) {
          materialApply(this.passForm.adminOrderId).then(response => {
            this.$notify.success({
              title: this.$t('Success!'),
              message: '处理成功'
            })
            this.$router.push({ path: '/repository/list' })
          })
            .catch(response => {
              MessageBox.alert(this.$t('Error') + response.data.errmsg, this.$t('Warning'), {
                confirmButtonText: this.$t('Confirm'),
                type: 'error'
              })
            })
        }
      })
/*      this.$refs['passForm'].validate(valid => {
        if (valid) {
          shopOrderPass(this.passForm).then(response => {
            this.$notify.success({
              title: this.$t('Success!'),
              message: '处理成功'
            })
            this.$router.push({ path: '/repository/list' })
          })
          .catch(response => {
            MessageBox.alert(this.$t('Error') + response.data.errmsg, this.$t('Warning'), {
              confirmButtonText: this.$t('Confirm'),
              type: 'error'
            })
          })
        }
      })*/
    },
    handleOrderNoPass(){
      this.passForm.adminOrderId = this.orderDetail.id
      shopOrderNoPass(this.passForm).then(response => {
        this.$notify.success({
          title: this.$t('Success!'),
          message: '处理成功'
        })
        this.$router.push({ path: '/repository/list' })
      })
        .catch(response => {
          MessageBox.alert(this.$t('Error') + response.data.errmsg, this.$t('Warning'), {
            confirmButtonText: this.$t('Confirm'),
            type: 'error'
          })
        })
    },
    handleOrderPay(){
      this.passForm.adminOrderId = this.orderDetail.id
      shopOrderPay(this.passForm).then(response => {
        this.$notify.success({
          title: this.$t('Success!'),
          message: '处理成功'
        })
        this.$router.push({ path: '/repository/list' })
      })
        .catch(response => {
          MessageBox.alert(this.$t('Error') + response.data.errmsg, this.$t('Warning'), {
            confirmButtonText: this.$t('Confirm'),
            type: 'error'
          })
        })
    },
    handleDeliverGoods(){
      this.passForm.adminOrderId = this.orderDetail.id
      shopDeliverGoods(this.passForm).then(response => {
        this.$notify.success({
          title: this.$t('Success!'),
          message: '处理成功'
        })
        this.$router.push({ path: '/repository/list' })
      })
        .catch(response => {
          MessageBox.alert(this.$t('Error') + response.data.errmsg, this.$t('Warning'), {
            confirmButtonText: this.$t('Confirm'),
            type: 'error'
          })
        })
    },
    handleCancelDeliverGoods(){
      this.passForm.adminOrderId = this.orderDetail.id
      shopCancelDeliverGoods(this.passForm).then(response => {
        this.$notify.success({
          title: this.$t('Success!'),
          message: '处理成功'
        })
        this.$router.push({ path: '/repository/list' })
      })
        .catch(response => {
          MessageBox.alert(this.$t('Error') + response.data.errmsg, this.$t('Warning'), {
            confirmButtonText: this.$t('Confirm'),
            type: 'error'
          })
        })
    },
    handleTakeDelivery(){
      this.passForm.adminOrderId = this.orderDetail.id
      shopTakeDelivery(this.passForm).then(response => {
        this.$notify.success({
          title: this.$t('Success!'),
          message: '处理成功'
        })
        this.$router.push({ path: '/repository/list' })
      })
        .catch(response => {
          MessageBox.alert(this.$t('Error') + response.data.errmsg, this.$t('Warning'), {
            confirmButtonText: this.$t('Confirm'),
            type: 'error'
          })
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

  .table-cell-name {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    font-size: 14px;
    color: #303133;
  }
  .table-cell-content {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #303133;
  }
</style>
