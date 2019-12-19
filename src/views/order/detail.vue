<template>
  <div class="app-container">
    <el-card class="box-card">
      <h3>订单详情</h3>
      <div>
        <el-steps :active="formatStepStatus(orderDetail.order.orderStatus)" finish-status="success" align-center>
          <el-step>
            <span slot="title">提交订单</span>
            <span v-if="orderDetail.order.orderStatus == 101" slot="description">{{orderDetail.order.updateTime}}</span>
          </el-step>
          <el-step>
            <span slot="title">支付订单</span>
            <span v-if="orderDetail.order.orderStatus == 201" slot="description">{{orderDetail.order.updateTime}}</span>
          </el-step>
          <el-step title="">
            <span slot="title">平台发货</span>
            <span v-if="orderDetail.order.orderStatus == 301" slot="description">{{orderDetail.order.updateTime}}</span>
          </el-step>
          <el-step title="">
            <span slot="title">确认收货</span>
            <span v-if="orderDetail.order.orderStatus == 401" slot="description">{{orderDetail.order.updateTime}}</span>
          </el-step>
          <el-step title="">
            <span slot="title">完成评价</span>
            <span v-if="orderDetail.order.orderStatus == 501" slot="description">{{orderDetail.order.updateTime}}</span>
          </el-step>
        </el-steps>
      </div>

      <el-form :inline="true">
        <el-col :span="18">
          <el-form-item label="当前状态">
            {{ orderDetail.order.orderStatus | orderStatusFilter }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="">
            <el-button v-if="orderDetail.order.orderStatus == 201" @click="consignment(orderDetail.order)">发货处理</el-button>
            <el-button @click="addMark(orderDetail.order)">添加备注</el-button>
            <el-button @click="print(orderDetail.order)">打印订单</el-button>
          </el-form-item>
        </el-col>
      </el-form>

      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"/>
        <span class="font-small">基本信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="4" class="table-cell-title">订单编号</el-col>
          <el-col :span="4" class="table-cell-title">发货单号</el-col>
          <el-col :span="4" class="table-cell-title">用户账号</el-col>
          <el-col :span="4" class="table-cell-title">支付方式</el-col>
          <el-col :span="4" class="table-cell-title">订单来源</el-col>
          <el-col :span="4" class="table-cell-title">订单类型</el-col>
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
          <el-col :span="8" class="table-cell-title">收货人</el-col>
          <el-col :span="8" class="table-cell-title">手机号码</el-col>
          <el-col :span="8" class="table-cell-title">收货地址</el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="table-cell">{{ orderDetail.order.consignee }}</el-col>
          <el-col :span="8" class="table-cell">{{ orderDetail.order.mobile }}</el-col>
          <el-col :span="8" class="table-cell">{{ orderDetail.order.address }}</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"/>
        <span class="font-small">商品信息</span>
      </div>
      <div class="table-layout">
        <el-table :data="orderDetail.orderGoods" border fit highlight-current-row>
          <el-table-column align="center" label="商品名称" prop="goodsName" />
          <el-table-column align="center" label="商品编号" prop="goodsSn" />
          <el-table-column align="center" label="货品规格" prop="specifications" />
          <el-table-column align="center" label="货品价格" prop="price" />
          <el-table-column align="center" label="货品数量" prop="number" />
          <el-table-column align="center" label="货品图片" prop="picUrl">
            <template slot-scope="scope">
              <img :src="scope.row.picUrl" width="40">
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"/>
        <span class="font-small">费用信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">商品合计</el-col>
          <el-col :span="6" class="table-cell-title">运费</el-col>
          <el-col :span="6" class="table-cell-title">优惠券</el-col>
          <el-col :span="6" class="table-cell-title">积分抵扣</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">{{ orderDetail.order.goodsPrice }}</el-col>
          <el-col :span="6" class="table-cell">{{ orderDetail.order.freightPrice }}</el-col>
          <el-col :span="6" class="table-cell">{{ orderDetail.order.couponPrice }}</el-col>
          <el-col :span="6" class="table-cell">{{ orderDetail.order.integralPrice }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-title">活动优惠</el-col>
          <el-col :span="6" class="table-cell-title">折扣金额</el-col>
          <el-col :span="6" class="table-cell-title">订单总金额</el-col>
          <el-col :span="6" class="table-cell-title">应付款金额</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">0</el-col>
          <el-col :span="6" class="table-cell">0</el-col>
          <el-col :span="6" class="table-cell">{{ orderDetail.order.actualPrice }}</el-col>
          <el-col :span="6" class="table-cell">{{ orderDetail.order.actualPrice }}</el-col>
        </el-row>
      </div>

    </el-card>

    <!-- 发货对话框 -->
    <el-dialog :visible.sync="shipDialogVisible" title="发货">
      <el-form ref="shipForm" :model="shipForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="快递公司" prop="shipChannel">
          <el-input v-model="shipForm.shipChannel"/>
        </el-form-item>
        <el-form-item label="快递编号" prop="shipSn">
          <el-input v-model="shipForm.shipSn"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="shipDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmShip">确定</el-button>
      </div>
    </el-dialog>

    <!-- 添加备注对话框 -->
    <el-dialog :visible.sync="markDialogVisible" title="备注">
      <el-form ref="markForm" :model="markForm" :rules="markRules" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="备注" prop="remark">
          <el-input v-model="markForm.remark" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="markDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmMark">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { shipOrder, detailOrder, remarkOrder } from '@/api/order'

const statusMap = {
  101: '未付款',
  102: '用户取消',
  103: '系统取消',
  201: '已付款',
  202: '申请退款',
  203: '已退款',
  301: '已发货',
  401: '用户收货',
  402: '系统收货'
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
        return '手机APP'
      }else{
        return '其他'
      }
    },
    orderTypeFilter(type){
      if(type == 1){
        return '普通订单'
      }else if(type == 2){
        return '外送订单'
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
          { required: true, message: '备注不能为空', trigger: 'blur' }
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
              title: '成功',
              message: '确认发货成功'
            })
          }).catch(response => {
            this.$notify.error({
              title: '失败',
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
              title: '成功',
              message: '备注成功'
            })
          }).catch(response => {
            this.$notify.error({
              title: '失败',
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
