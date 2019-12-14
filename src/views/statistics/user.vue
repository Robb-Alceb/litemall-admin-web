<template>
    <div class="app-container">
      <el-card>
        <div slot="header" class="clearfix">
          <span>会员统计</span>
        </div>
        <el-row style="margin-bottom: 20px;">
          <el-col :span="6" align="center">
            <el-row>
              <span style="font-size: 30px;color: red;">{{overview.today}}</span>
            </el-row>
            <el-row>
              今日新增
            </el-row>
          </el-col>
          <el-col :span="6" align="center">
            <el-row>
              <span style="font-size: 30px;color: red;">{{overview.yesterday}}</span>
            </el-row>
            <el-row>
              昨日新增
            </el-row>
          </el-col>
          <el-col :span="6" align="center">
            <el-row>
              <span style="font-size: 30px;color: red;">{{overview.month}}</span>
            </el-row>
            <el-row>
              本月新增
            </el-row>
          </el-col>
          <el-col :span="6" align="center">
            <el-row>
              <span style="font-size: 30px;color: red;">{{overview.total}}</span>
            </el-row>
            <el-row>
              会员总数
            </el-row>
          </el-col>
        </el-row>
        <el-card>
          <div slot="header" class="clearfix">
            <span>会员增长情况</span>
            <div style="display: inline;float: right;">
              <div v-show="countFilterType ==1" style="display: inline;float: right;" class="block">
                <el-date-picker
                  v-model="dateRange"
                  type="daterange"
                  @change="handleDateChange"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
              <div v-show="countFilterType ==2" style="display: inline;float: right;" class="block">
                <el-date-picker
                  v-model="dateRange"
                  type="monthrange"
                  @change="handleDateChange"
                  placeholder="选择月份" style="width:350px;">
                </el-date-picker>
              </div>
            </div>
            <div style="display: inline;float: right;width: 120px;">
              <el-select v-model="countFilterType">
                <el-option label="按日统计" :value="1"></el-option>
                <el-option label="按月统计" :value="2"></el-option>
              </el-select>
            </div>
<!--            <div style="display: inline;float: right;">
              <el-button style="display: inline;" @click="exportSales()">导出数据</el-button>
            </div>-->
          </div>
          <ve-line :data="lineData"></ve-line>
        </el-card>
        <el-card>
          <div slot="header" class="clearfix">
            <span>会员消费金额分布</span>
            <div style="display: inline;float: right;">
              <div v-show="amountFilterType ==1" style="display: inline;float: right;" class="block">
                <el-date-picker
                  v-model="amountDateRange"
                  type="daterange"
                  @change="handleAmountDateChange"
                  placeholder="选择日期" style="width:350px;">
                </el-date-picker>
              </div>
              <div v-show="amountFilterType ==2" style="display: inline;float: right;" class="block">
                <el-date-picker
                  v-model="amountDateRange"
                  type="monthrange"
                  @change="handleAmountDateChange"
                  placeholder="选择月份"  style="width:350px;">
                </el-date-picker>
              </div>
            </div>
            <div style="display: inline;float: right;width: 120px;">
              <el-select v-model="amountFilterType">
                <el-option label="按日统计" :value="1"></el-option>
                <el-option label="按月统计" :value="2"></el-option>
              </el-select>
            </div>
<!--            <div style="display: inline;float: right;">
              <el-tabs v-model="activeTable" type="card" @tab-click="handleClick">
                <el-tab-pane label="昨天" name="1"></el-tab-pane>
                <el-tab-pane label="最近7天" name="7"></el-tab-pane>
                <el-tab-pane label="最近30天" name="30"></el-tab-pane>
              </el-tabs>
            </div>-->
<!--            <div style="display: inline;float: right;">
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
  import VeLine from 'v-charts/lib/line.common'
  export default {
    name: "userStatistics",
    components: { VeHistogram, VeLine },
    data() {
      const startDate = new Date(new Date().getTime() - 3600 * 1000 * 24 * 30 * 6);
      const endDate = new Date();
      return {
        overview:{
          today:100,
          yesterday:101,
          month:300,
          total: 10001
        },
        dateRange: [startDate, endDate],
        amountDateRange: [startDate, startDate],
        activeTable: "1",
        countFilterType: 2,
        amountFilterType: 2,
        chartData: {
          columns: ['date', 'sales'],
          rows: [
            {'date': '0-50元', 'sales': 1},
            {'date': '50-100元', 'sales': 12},
            {'date': '100-200元', 'sales': 30},
            {'date': '200-500元', 'sales': 17},
            {'date': '500-1000元', 'sales': 20},
            {'date': '1000-5000元', 'sales': 11},
            {'date': '5000-10000元', 'sales': 1},
            {'date': '10000以上', 'sales': 1}
          ]
        },
        lineData: {
          columns: ['日期', '新增会员数'],
          rows: [
            { '日期': '01月', '新增会员数': 1393 },
            { '日期': '02月', '新增会员数': 3530 },
            { '日期': '03月', '新增会员数': 2923 },
            { '日期': '04月', '新增会员数': 1723 },
            { '日期': '05月', '新增会员数': 3792 },
            { '日期': '06月', '新增会员数': 4593 }
          ]
        }
      }
    },
    created(){

    },
    methods:{
      handleAmountDateChange(dateRange){
        console.log(dateRange)
      },
      handleDateChange(dateRange){
        console.log(dateRange)
      }
    }
  }
</script>

<style scoped>

</style>
