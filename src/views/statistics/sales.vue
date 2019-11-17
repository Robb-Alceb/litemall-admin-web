<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>门店1</span>
      </div>
      <el-card>
        <div slot="header" class="clearfix">
          <span>交易数据</span>
          <div style="display: inline;float: right;">
            <div style="display: inline;float: right;" class="block">
              <el-date-picker
                v-model="date"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </div>
          </div>
          <div style="display: inline;float: right;">
            <el-tabs v-model="activeTable" type="card" @tab-click="handleClick">
              <el-tab-pane label="昨天" name="1"></el-tab-pane>
              <el-tab-pane label="最近7天" name="7"></el-tab-pane>
              <el-tab-pane label="最近30天" name="30"></el-tab-pane>
            </el-tabs>
          </div>
          <div style="display: inline;float: right;">
            <el-button style="display: inline;" @click="exportSales()">导出数据</el-button>
          </div>
        </div>
        <el-row>
          <el-col :span="16">
            <div class="table-layout">
              <el-row>
                <el-col :span="4" class="table-cell-title">浏览人数</el-col>
                <el-col :span="4" class="table-cell-title">下单人数</el-col>
                <el-col :span="4" class="table-cell-title">订单数</el-col>
                <el-col :span="4" class="table-cell-title">下单件数</el-col>
                <el-col :span="4" class="table-cell-title">有效订单数</el-col>
                <el-col :span="4" class="table-cell-title">下单金额</el-col>
              </el-row>
              <el-row>
                <el-col :span="4" class="table-cell">1000</el-col>
                <el-col :span="4" class="table-cell">500</el-col>
                <el-col :span="4" class="table-cell">901</el-col>
                <el-col :span="4" class="table-cell">1908</el-col>
                <el-col :span="4" class="table-cell">876</el-col>
                <el-col :span="4" class="table-cell">90989</el-col>
              </el-row>
              <el-row>
                <el-col :span="4" class="table-cell-title">退款金额</el-col>
                <el-col :span="4" class="table-cell-title">付款人数</el-col>
                <el-col :span="4" class="table-cell-title">付款订单数</el-col>
                <el-col :span="4" class="table-cell-title">付款件数</el-col>
                <el-col :span="4" class="table-cell-title">付款金额</el-col>
                <el-col :span="4" class="table-cell-title">客单价</el-col>
              </el-row>
              <el-row>
                <el-col :span="4" class="table-cell">10943</el-col>
                <el-col :span="4" class="table-cell">901</el-col>
                <el-col :span="4" class="table-cell">1900</el-col>
                <el-col :span="4" class="table-cell">1800</el-col>
                <el-col :span="4" class="table-cell">89703</el-col>
                <el-col :span="4" class="table-cell">1000</el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="8">
            <ve-funnel :data="funnelData"></ve-funnel>
          </el-col>
        </el-row>
      </el-card>
      <el-card>

            <div slot="header" class="clearfix">
              <span>交易数据</span>
              <div style="display: inline;float: right;">
                <div style="display: inline;float: right;" class="block">
                  <el-date-picker
                    v-model="date"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </div>
              </div>
              <div style="display: inline;float: right;">
                <el-tabs v-model="activeTable" type="card" @tab-click="handleClick">
                  <el-tab-pane label="昨天" name="1"></el-tab-pane>
                  <el-tab-pane label="最近7天" name="7"></el-tab-pane>
                  <el-tab-pane label="最近30天" name="30"></el-tab-pane>
                </el-tabs>
              </div>
              <div style="display: inline;float: right;">
                <el-button style="display: inline;" @click="exportSales()">导出数据</el-button>
              </div>
            </div>
            <ve-histogram :data="chartData"></ve-histogram>
      </el-card>
    </el-card>
  </div>

</template>

<script>
  import VeHistogram from 'v-charts/lib/histogram.common'
  import VeFunnel from 'v-charts/lib/funnel.common'
  export default {
    name: "salesStatistics",
    components: { VeHistogram, VeFunnel },
    data(){
      return {
        date: null,
        activeTable:"1",
        chartData: {
          columns: ['date', 'sales'],
          rows: [
            { 'date': '0-50元', 'sales': 1 },
            { 'date': '50-100元', 'sales': 12 },
            { 'date': '100-200元', 'sales': 30 },
            { 'date': '200-500元', 'sales': 17 },
            { 'date': '500-1000元', 'sales': 20 },
            { 'date': '1000-5000元', 'sales': 11 },
            { 'date': '5000-10000元', 'sales': 1 },
            { 'date': '10000以上', 'sales': 1 }
          ]
        },
        funnelData: {
          columns: ['状态', '数值'],
          rows: [
            { '状态': '浏览', '数值': 500 },
            { '状态': '下单', '数值': 600 },
            { '状态': '付款', '数值': 300 },
          ]
        }
      }
    },
    created(){
      this.init()
    },
    methods: {
      init(){

      },
      handleClick(){
        if(this.activeTable == 1){
          this.chartData = {
            columns: ['date', 'sales'],
              rows: [
              { 'date': '0-50元', 'sales': 1 },
              { 'date': '50-100元', 'sales': 12 },
              { 'date': '100-200元', 'sales': 30 },
              { 'date': '200-500元', 'sales': 17 },
              { 'date': '500-1000元', 'sales': 20 },
              { 'date': '1000-5000元', 'sales': 11 },
              { 'date': '5000-10000元', 'sales': 1 },
              { 'date': '10000以上', 'sales': 1 }
            ]
          }
        }else if(this.activeTable == 7){
          this.chartData = {
            columns: ['date', 'sales'],
            rows: [
              { 'date': '0-50元', 'sales': 3 },
              { 'date': '50-100元', 'sales': 1 },
              { 'date': '100-200元', 'sales': 12 },
              { 'date': '200-500元', 'sales': 64 },
              { 'date': '500-1000元', 'sales': 33 },
              { 'date': '1000-5000元', 'sales': 21 },
              { 'date': '5000-10000元', 'sales': 1 },
              { 'date': '10000以上', 'sales': 1 }
            ]
          }
        }
      },
      exportSales(){

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
