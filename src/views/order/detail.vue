<template>
  <div class="app-container">
    <el-card class="box-card">
      <h3>{{$t('Order_details')}}</h3>
      <div>
        <el-steps :active="formatStepStatus(orderDetail.order.orderStatus)" finish-status="success" align-center>
          <el-step>
            <span slot="title">{{$t('Submit_order')}}</span>
            <span v-if="orderDetail.order.orderStatus == 101" slot="description">{{orderDetail.order.updateTime}}</span>
          </el-step>
          <el-step>
            <span slot="title">{{$t('Pay_for_order')}}</span>
            <span v-if="orderDetail.order.orderStatus == 201" slot="description">{{orderDetail.order.updateTime}}</span>
          </el-step>
          <el-step title="">
            <span slot="title">{{$t('Send_via_platform')}}</span>
            <span v-if="orderDetail.order.orderStatus == 301" slot="description">{{orderDetail.order.updateTime}}</span>
          </el-step>
          <el-step title="">
            <span slot="title">{{$t('Receive_confirm')}}</span>
            <span v-if="orderDetail.order.orderStatus == 401" slot="description">{{orderDetail.order.updateTime}}</span>
          </el-step>
          <el-step title="">
            <span slot="title">{{$t('Finish_Rating_')}}</span>
            <span v-if="orderDetail.order.orderStatus == 501" slot="description">{{orderDetail.order.updateTime}}</span>
          </el-step>
        </el-steps>
      </div>

      <el-form :inline="true">
        <el-col :span="18">
          <el-form-item :label="$t('Current_status')">
            {{ orderDetail.order.orderStatus | orderStatusFilter }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="">
            <el-button v-if="orderDetail.order.orderStatus == 201" @click="consignment(orderDetail.order)">{{$t('Processing_delivery')}}</el-button>
            <el-button @click="addMark(orderDetail.order)">{{$t('Add_Notes')}}</el-button>
            <el-button @click="print(orderDetail.order)">打印订单</el-button>
          </el-form-item>
        </el-col>
      </el-form>

      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"/>
        <span class="font-small">{{$t('Basic_Information')}}</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="4" class="table-cell-title">{{$t('Order_ID')}}</el-col>
          <el-col :span="4" class="table-cell-title">{{$t('Delivery_number')}}</el-col>
          <el-col :span="4" class="table-cell-title">{{$t('Member_account')}}</el-col>
          <el-col :span="4" class="table-cell-title">{{$t('Payment_method')}}</el-col>
          <el-col :span="4" class="table-cell-title">{{$t('Source_of_order')}}</el-col>
          <el-col :span="4" class="table-cell-title">{{$t('Order_type')}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">{{ orderDetail.order.orderSn }}</el-col>
          <el-col :span="4" class="table-cell" v-if="orderDetail.order.shipSn">{{ orderDetail.order.shipSn }}</el-col>
          <el-col :span="4" class="table-cell" v-else>未发货</el-col>
          <el-col :span="4" class="table-cell">{{ orderDetail.user.nickname }}</el-col>
          <el-col :span="4" class="table-cell">{{ orderDetail.order.payType | payTypeFilter }}</el-col>
          <el-col :span="4" class="table-cell">{{ orderDetail.order.orderSource | orderSourceFilter}}</el-col>
          <el-col :span="4" class="table-cell">{{ orderDetail.order.orderType | orderTypeFilter}}</el-col>
        </el-row>
      </div>

      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"/>
        <span class="font-small">收货信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="8" class="table-cell-title">{{$t('Receiver_')}}</el-col>
          <el-col :span="8" class="table-cell-title">{{$t('Cellphone_number')}}</el-col>
          <el-col :span="8" class="table-cell-title">{{$t('Receiving_Address')}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="table-cell">{{ orderDetail.order.consignee }}</el-col>
          <el-col :span="8" class="table-cell">{{ orderDetail.order.mobile }}</el-col>
          <el-col :span="8" class="table-cell">{{ orderDetail.order.address }}</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"/>
        <span class="font-small">{{$t('Goods_details_info')}}</span>
      </div>
      <div class="table-layout">
        <el-table :data="orderDetail.orderGoods" border fit highlight-current-row>
          <el-table-column align="center" :label="$t('Merchandise_name')" prop="goodsName" />
          <el-table-column align="center" :label="$t('Merchandise_code')" prop="goodsSn" />
          <el-table-column align="center" :label="$t('Merchandise_specifications')" prop="specifications" />
          <el-table-column align="center" :label="$t('Merchandise_price')" prop="price" />
          <el-table-column align="center" :label="$t('Number_of_merchandise')" prop="number" />
          <el-table-column align="center" :label="$t('Merchandise_picture')" prop="picUrl">
            <template slot-scope="scope">
              <img :src="scope.row.picUrl" width="40">
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"/>
        <span class="font-small">{{$t('Cost_details')}}</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">{{$t('Total')}}</el-col>
          <el-col :span="6" class="table-cell-title">{{$t('Delivery_fee')}}</el-col>
          <el-col :span="6" class="table-cell-title">{{$t('Coupons')}}</el-col>
          <el-col :span="6" class="table-cell-title">{{$t('Points_discount')}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">{{ orderDetail.order.goodsPrice }}</el-col>
          <el-col :span="6" class="table-cell">{{ orderDetail.order.freightPrice }}</el-col>
          <el-col :span="6" class="table-cell">{{ orderDetail.order.couponPrice }}</el-col>
          <el-col :span="6" class="table-cell">{{ orderDetail.order.integralPrice }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-title">税费</el-col>
          <el-col :span="6" class="table-cell-title">{{$t('Order_total')}}</el-col>
          <el-col :span="6" class="table-cell-title">{{$t('Total_to_be_paid')}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">{{ orderDetail.order.taxPrice }}</el-col>
          <el-col :span="6" class="table-cell">{{ orderDetail.order.actualPrice }}</el-col>
          <el-col :span="6" class="table-cell">{{ orderDetail.order.actualPrice }}</el-col>
        </el-row>
      </div>

    </el-card>

    <!-- 发货对话框 -->
    <el-dialog :visible.sync="shipDialogVisible" :title="$t('Delivery_')">
      <el-form ref="shipForm" :model="shipForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('Express_Delivery_Company')" prop="shipChannel">
          <el-input v-model="shipForm.shipChannel"/>
        </el-form-item>
        <el-form-item :label="$t('Express_Delivery_number')" prop="shipSn">
          <el-input v-model="shipForm.shipSn"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="shipDialogVisible = false">{{$t('Cancel')}}</el-button>
        <el-button type="primary" @click="confirmShip">{{$t('Confirm')}}</el-button>
      </div>
    </el-dialog>

    <!-- 添加备注对话框 -->
    <el-dialog :visible.sync="markDialogVisible" :title="$t('Notes')">
      <el-form ref="markForm" :model="markForm" :rules="markRules" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('Notes')" prop="remark">
          <el-input v-model="markForm.remark" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="markDialogVisible = false">{{$t('Cancel')}}</el-button>
        <el-button type="primary" @click="confirmMark">{{$t('Confirm')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { shipOrder, detailOrder, remarkOrder } from '@/api/order'

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

export default {
  name: 'orderDetail',
  filters: {
    orderStatusFilter(status) {
      return statusMap[status]
    },
    payTypeFilter(status) {
      if (status == 1) {
        return '未支付'
      }else if(status == 2){
        return 'paypal'
      }
    },
    orderSourceFilter(type){
      if(type == 1){
        return this.$t('Phone_App')
      }else{
        return this.$t('Others')
      }
    },
    orderTypeFilter(type){
      if(type == 1){
        return this.$t('Normal_Order')
      }else if(type == 2){
        return this.$t('Delivery_order')
      }
    }
  },
  data() {
    return {
      orderDetail: {
        order: {},
        user: {},
        orderGoods: []
      },
      shipForm: {
        orderId: undefined,
        shipChannel: undefined,
        shipSn: undefined
      },
      shipDialogVisible: false,
      markDialogVisible: false,
      markForm: {
        orderIdd: undefined,
        remark: undefined
      },
      markRules: {
        remark: [
          { required: true, message: this.$t('Notes_cannot_be_empty'), trigger: 'blur' }
        ],
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
    formatStepStatus(value) {
      if (value === 201) {
        // 待发货
        return 2
      } else if (value === 301) {
        // 已发货
        return 3
      } else if (value === 401 || value === 402) {
        // 已完成
        return 4
      } else {
        // 待付款、已关闭、无限订单
        return 1
      }
    },
    consignment(row) {
      this.shipForm.orderId = row.id
      this.shipForm.shipChannel = row.shipChannel
      this.shipForm.shipSn = row.shipSn

      this.shipDialogVisible = true
      this.$nextTick(() => {
        this.$refs['shipForm'].clearValidate()
      })
    },
    addMark(row) {
      this.markDialogVisible = true
      this.markForm.orderId = row.id

    },
    confirmShip() {
      this.$refs['shipForm'].validate((valid) => {
        if (valid) {
          shipOrder(this.shipForm).then(response => {
            this.shipDialogVisible = false
            this.$notify.success({
              title: this.$t('Success!'),
              message: this.$t('Confirm_delivery_successful')
            })
          }).catch(response => {
            this.$notify.error({
              title: this.$t('Failed'),
              message: response.data.errmsg
            })
          })
        }
      })
    },
    confirmMark() {
      this.$refs['markForm'].validate((valid)=>{
        if(valid){
          remarkOrder(this.markForm).then(response => {
            this.markDialogVisible = false
            this.$notify.success({
              title: this.$t('Success!'),
              message: this.$t('Noted!')
            })
          }).catch(response => {
            this.$notify.error({
              title: this.$t('Failed'),
              message: response.data.errmsg
            })
          })
        }
      })
    },
    print(order){
      this.$router.push({path:'/order/print',query:{id:order.id}})
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
</style>
