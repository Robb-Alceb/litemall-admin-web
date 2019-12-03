<template>
  <div class="app-container">
    <el-card class="box-card">
      <h3>进货详情</h3>
      <div>
        <el-steps :active="formatStepStatus(orderDetail.orderStatus)" finish-status="success" align-center>
          <el-step title="申请调货"/>
          <el-step title="同意调货" />
          <el-step title="支付付款" />
          <el-step title="处理发货" />
          <el-step title="确认收货" />
        </el-steps>
      </div>

      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"/>
        <span class="font-small">货品信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="4" class="table-cell-title">货品名称</el-col>
          <el-col :span="4" class="table-cell-title">货品图片</el-col>
          <el-col :span="4" class="table-cell-title">现有库存</el-col>
          <el-col :span="4" class="table-cell-title">价格/货号</el-col>
          <el-col :span="4" class="table-cell-title">订货数量</el-col>
          <el-col :span="4" class="table-cell-title">小计</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">咖啡豆</el-col>
          <el-col :span="4" class="table-cell"/>
          <el-col :span="4" class="table-cell">4000</el-col>
          <el-col :span="4" class="table-cell">$10/N10000</el-col>
          <el-col :span="4" class="table-cell">100</el-col>
          <el-col :span="4" class="table-cell">$1000</el-col>
        </el-row>
      </div>

      <div class="table-layout" align="center">
        <el-row>
          <el-col :span="6" class="table-cell-name">服务单号</el-col>
          <el-col :span="18" align="left" class="table-cell-content">
            {{orderDetail.orderSn}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-name">申请状态</el-col>
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
          <el-col :span="6" class="table-cell-name">申请时间</el-col>
          <el-col :span="18" align="left" class="table-cell-content">
            {{orderDetail.addTime}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-name">用户账号</el-col>
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
          <el-col :span="6" class="table-cell-name">联系电话</el-col>
          <el-col :span="18" align="left" class="table-cell-content">
            {{orderDetail.mobile}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-name">所在门店</el-col>
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

    <div class="op-container">
      <el-button @click="handleCancel">取消</el-button>
      <el-button v-if="orderDetail.orderStatus == 3" v-permission="['POST /admin/shopOrder/deliverGoods']" type="primary" @click="handleDeliverGoods">同意发货</el-button>
      <el-button v-if="orderDetail.orderStatus == 3" v-permission="['POST /admin/shopOrder/cancelDeliverGoods']" type="danger" @click="handleCancelDeliverGoods">拒绝发货</el-button>
      <el-button v-if="orderDetail.orderStatus == 2" v-permission="['POST /admin/shopOrder/orderPay']" type="primary" @click="handleOrderPay">支付货款</el-button>
      <el-button v-if="orderDetail.orderStatus == 1" v-permission="['POST /admin/shopOrder/orderPass']" type="primary" @click="handleOrderPass">同意调货</el-button>
      <el-button v-if="orderDetail.orderStatus == 1" v-permission="['POST /admin/shopOrder/orderNoPass']" type="danger" @click="handleOrderNoPass">拒绝调货</el-button>
      <el-button v-if="orderDetail.orderStatus == 4" v-permission="['POST /admin/shopOrder/takeDelivery']" type="primary" @click="handleTakeDelivery">确认收货</el-button>
    </div>
  </div>
</template>

<script>
import {shopOrderDetail, shopOrderPass, shopOrderNoPass, shopOrderPay, shopDeliverGoods, shopCancelDeliverGoods, shopTakeDelivery} from '@/api/shop'
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
      orderStatusMap,
      validateDouble,
      orderId:undefined,
      orderDetail: {
      },
      merchandises:undefined,
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
  created(){
    if(this.$route.query.id){
      this.orderId = this.$route.query.id
    }
    this.getDetail()
  },
  methods: {
    getDetail(){
      shopOrderDetail(this.orderId).then(res=>{
        this.orderDetail = res.data.data.order
        this.merchandises = res.data.data.merchandises
      })
    },
    formatStepStatus(value) {
      if (value === 2) {
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
      }
    },
    handleCancel(){
      this.$router.push({path:'/shop/order'})
    },
    handleOrderPass(){
      this.passForm.adminOrderId = this.orderDetail.id
      this.$refs['passForm'].validate(valid => {
        if (valid) {
          shopOrderPass(this.passForm).then(response => {
            this.$notify.success({
              title: '成功',
              message: '处理成功'
            })
            this.$router.push({ path: '/shop/order' })
          })
          .catch(response => {
            MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
              confirmButtonText: '确定',
              type: 'error'
            })
          })
        }
      })
    },
    handleOrderNoPass(){
      this.passForm.adminOrderId = this.orderDetail.id
      shopOrderNoPass(this.passForm).then(response => {
        this.$notify.success({
          title: '成功',
          message: '处理成功'
        })
        this.$router.push({ path: '/shop/order' })
      })
        .catch(response => {
          MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
            confirmButtonText: '确定',
            type: 'error'
          })
        })
    },
    handleOrderPay(){
      this.passForm.adminOrderId = this.orderDetail.id
      shopOrderPay(this.passForm).then(response => {
        this.$notify.success({
          title: '成功',
          message: '处理成功'
        })
        this.$router.push({ path: '/shop/order' })
      })
        .catch(response => {
          MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
            confirmButtonText: '确定',
            type: 'error'
          })
        })
    },
    handleDeliverGoods(){
      this.passForm.adminOrderId = this.orderDetail.id
      shopDeliverGoods(this.passForm).then(response => {
        this.$notify.success({
          title: '成功',
          message: '处理成功'
        })
        this.$router.push({ path: '/shop/order' })
      })
        .catch(response => {
          MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
            confirmButtonText: '确定',
            type: 'error'
          })
        })
    },
    handleCancelDeliverGoods(){
      this.passForm.adminOrderId = this.orderDetail.id
      shopCancelDeliverGoods(this.passForm).then(response => {
        this.$notify.success({
          title: '成功',
          message: '处理成功'
        })
        this.$router.push({ path: '/shop/order' })
      })
        .catch(response => {
          MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
            confirmButtonText: '确定',
            type: 'error'
          })
        })
    },
    handleTakeDelivery(){
      this.passForm.adminOrderId = this.orderDetail.id
      shopTakeDelivery(this.passForm).then(response => {
        this.$notify.success({
          title: '成功',
          message: '处理成功'
        })
        this.$router.push({ path: '/shop/order' })
      })
        .catch(response => {
          MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
            confirmButtonText: '确定',
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
