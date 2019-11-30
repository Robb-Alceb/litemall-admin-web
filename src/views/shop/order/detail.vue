<template>
  <div class="app-container">
    <el-card class="box-card">
      <h3>进货详情</h3>
      <div>
        <el-steps :active="formatStepStatus(orderDetail.order.orderStatus)" finish-status="success" align-center>
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
          <el-col :span="18" align="left" class="table-cell-content">3215614222</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-name">申请状态</el-col>
          <el-col :span="18" align="left" class="table-cell-content">待处理</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-name">货物编号</el-col>
          <el-col :span="18" align="left" class="table-cell-content">No 1000</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-name">申请时间</el-col>
          <el-col :span="18" align="left" class="table-cell-content">2019-01-01 20:20:00</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-name">用户账号</el-col>
          <el-col :span="18" align="left" class="table-cell-content">shanghai1</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-name">联系人</el-col>
          <el-col :span="18" align="left" class="table-cell-content">上海店长</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-name">联系电话</el-col>
          <el-col :span="18" align="left" class="table-cell-content">1300000000</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-name">所在门店</el-col>
          <el-col :span="18" align="left" class="table-cell-content">上海门店</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-name">订货描述</el-col>
          <el-col :span="18" align="left" class="table-cell-content">存货不足</el-col>
        </el-row>
      </div>

      <div class="table-layout" align="center">
        <el-row>
          <el-col :span="6" class="table-cell-name">发货数量</el-col>
          <el-col :span="18" align="left" class="table-cell-content">$100</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-name">确认发货金额</el-col>
          <el-col :span="18" align="left" class="table-cell-content">$1000</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-name">收货人姓名</el-col>
          <el-col :span="18" align="left" class="table-cell-content">上海店长</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-name">收货人地址</el-col>
          <el-col :span="18" align="left" class="table-cell-content">上海市</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-name">支付状态</el-col>
          <el-col :span="18" align="left" class="table-cell-content">待支付</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-name">处理备注</el-col>
          <el-col :span="18" align="left" class="table-cell-content">批准</el-col>
        </el-row>
      </div>
    </el-card>

  </div>
</template>

<script>
export default {
  name: 'ShopOrderDetail',
  data() {
    return {
      orderDetail: {
        order: {}
      }
    }
  },
  methods: {
    formatStepStatus(value) {
      if (value === 201) {
        // 待发货
        return 2
      } else if (value === 301) {
        // 已发货
        return 3
      } else if (value === 401) {
        // 已完成
        return 4
      } else {
        // 待付款、已关闭、无限订单
        return 1
      }
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
