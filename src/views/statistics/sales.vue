<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>销售统计</span>
      </div>
      <el-row style="margin-bottom: 20px;">
        <el-select v-model="queryParam.shopId" clearable placeholder="请选择门店">
          <el-option v-for="item in shops" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </el-row>
      <el-card>
        <div slot="header" class="clearfix">
          <span>交易数据</span>
          <div style="display: inline;float: right;">
            <div style="display: inline;float: right;" class="block">
              <el-date-picker
                v-model="dateRange"
                type="datetimerange"
                :clearable="false"
                :picker-options="pickerOptions"
                @change="handleDateChange"
                format="yyyy-MM-dd HH:mm"
                placeholder="选择日期"/>
            </div>
          </div>
<!--          <div style="display: inline;float: right;">
            <el-button style="display: inline;" @click="exportSales()">导出数据</el-button>
          </div>-->
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
                    v-model="dateSaleRange"
                    type="datetimerange"
                    :clearable="false"
                    :picker-options="pickerOptions"
                    @change="handleSaleDateChange"
                    format="yyyy-MM-dd HH:mm"
                    placeholder="选择日期"/>
                </div>
              </div>
<!--              <div style="display: inline;float: right;">
                <el-button style="display: inline;" @click="exportSales()">导出数据</el-button>
              </div>-->
            </div>
            <ve-histogram :data="chartData"></ve-histogram>
      </el-card>
    </el-card>
  </div>

</template>

<script>
  import VeHistogram from 'v-charts/lib/histogram.common'
  import VeFunnel from 'v-charts/lib/funnel.common'
  import { allForPerm } from '@/api/shop'
  export default {
    name: "salesStatistics",
    components: { VeHistogram, VeFunnel },
    data(){
      const startDate = new Date(new Date().getTime() - 3600 * 1000 * 24 * 1);
      const endDate = new Date();
      return {
        queryParam:{
          shopId:undefined
        },
        shops:[],
        dateRange: [startDate, endDate],
        dateSaleRange: [startDate, startDate],
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
        pickerOptions: {
          shortcuts: [{
            text: '昨天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit('pick', [start, end]);
            }
          },{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }]
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
        allForPerm().then(response=>{
          this.shops = response.data.data.list
        })
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

      },
      handleDateChange(dateRange){
        console.log(dateRange)
      },
      handleSaleDateChange(dateRange){
        console.log(dateRange)
      },
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
