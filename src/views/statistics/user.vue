<template>
    <div class="app-container">
      <el-card>
        <div slot="header" class="clearfix">
          <span>{{$t('Membership_data')}}</span>
        </div>
        <el-row style="margin-bottom: 20px;">
          <el-col :span="6" align="center">
            <el-row>
              <span style="font-size: 30px;color: red;">{{overview.userTodayCount}}</span>
            </el-row>
            <el-row>
              {{$t('Today_new_memberships')}}
            </el-row>
          </el-col>
          <el-col :span="6" align="center">
            <el-row>
              <span style="font-size: 30px;color: red;">{{overview.userYesterdayCount}}</span>
            </el-row>
            <el-row>
              {{$t('Yesterday_new_memeberships')}}
            </el-row>
          </el-col>
          <el-col :span="6" align="center">
            <el-row>
              <span style="font-size: 30px;color: red;">{{overview.userMonthCount}}</span>
            </el-row>
            <el-row>
              {{$t('This_month_new_memberships')}}
            </el-row>
          </el-col>
          <el-col :span="6" align="center">
            <el-row>
              <span style="font-size: 30px;color: red;">{{overview.userTotal}}</span>
            </el-row>
            <el-row>
              {{$t('Total_members')}}
            </el-row>
          </el-col>
        </el-row>
        <el-card>
          <div slot="header" class="clearfix">
            <span>{{$t('Membership_growth')}}</span>
            <div style="display: inline;float: right;">
              <div v-show="countFilterType ==1" style="display: inline;float: right;" class="block">
                <el-date-picker
                  v-model="dateRange"
                  type="daterange"
                  @change="handleDateChange"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd hh:mm"
                  :placeholder="this.$t('Select_dates')">
                </el-date-picker>
              </div>
              <div v-show="countFilterType ==2" style="display: inline;float: right;" class="block">
                <el-date-picker
                  v-model="dateRange"
                  type="monthrange"
                  @change="handleDateChange"
                  format="yyyy-MM"
                  value-format="yyyy-MM-dd hh:mm"
                  placeholder="选择月份" style="width:350px;">
                </el-date-picker>
              </div>
            </div>
            <div style="display: inline;float: right;width: 120px;">
              <el-select v-model="countFilterType" @change="changeType">
                <el-option :label="$t('By_day')" :value="1"></el-option>
                <el-option :label="$t('By_month')" :value="2"></el-option>
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
            <span>{{$t('Member_purchasing_data')}}</span>
            <div style="display: inline;float: right;">
              <div v-show="amountFilterType ==1" style="display: inline;float: right;" class="block">
                <el-date-picker
                  v-model="amountDateRange"
                  type="daterange"
                  @change="handleAmountDateChange"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd hh:mm"
                  :placeholder="this.$t('Select_dates')" style="width:350px;">
                </el-date-picker>
              </div>
              <div v-show="amountFilterType ==2" style="display: inline;float: right;" class="block">
                <el-date-picker
                  v-model="amountDateRange"
                  type="monthrange"
                  @change="handleAmountDateChange"
                  format="yyyy-MM"
                  value-format="yyyy-MM-dd hh:mm"
                  placeholder="选择月份"  style="width:350px;">
                </el-date-picker>
              </div>
            </div>
            <div style="display: inline;float: right;width: 120px;">
              <el-select v-model="amountFilterType" @change="amountChangeType">
                <el-option :label="$t('By_day')" :value="1"></el-option>
                <el-option :label="$t('By_month')" :value="2"></el-option>
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
  const chartRowMap = {
    fifty: '0-50',
    hundred: '51-100',
    twoHundred: '101-200',
    fiveHundred: '201-500',
    thousand: '501-1000',
    fiveThousand: '1001-5000',
    tenThousand: '5001-10000',
    greaterThanTenThousand: '10001以上',

  }
  import VeHistogram from 'v-charts/lib/histogram.common'
  import VeLine from 'v-charts/lib/line.common'
  import { queryUserStatistics, queryAddUserStatistics} from '@/api/statistics'
  import { formatDate } from '@/utils/date'
  import { transactionData } from '@/api/statistics'
  export default {
    name: "userStatistics",
    components: { VeHistogram, VeLine },
    data() {
      const startDate = formatDate(new Date(new Date().getTime() - 3600 * 1000 * 24 * 10), 'yyyy-MM-dd hh:mm')
      const endDate = formatDate(new Date(), 'yyyy-MM-dd hh:mm')
      return {
        chartRowMap,
        overview:{
          userTodayCount:0,
          userYesterdayCount:0,
          userMonthCount:0,
          userTotal: 0
        },
        dateRange: [startDate, endDate],
        amountDateRange: [startDate, startDate],
        activeTable: "1",
        countFilterType: 1,
        amountFilterType: 1,
        chartData: {
          columns: ['amount', 'sales'],
          rows: [
          ]
        },
        lineData: {
          columns: ['addTime', 'count'],
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
      this.getData()
      this.getTransactionData()
    },
    methods:{
      getData(){
        queryUserStatistics().then(res=>{
          this.overview = res.data.data.data
        })
        let param = {
          type: this.countFilterType,
          startTime: this.dateRange[0],
          endTime: this.dateRange[1]
        }
        queryAddUserStatistics(param).then(res=>{
          this.lineData.rows = res.data.data.data
        })
      },
      getTransactionData(){
        let param1 = {
          startTime: this.amountDateRange[0],
          endTime: this.amountDateRange[1]
        }
        this.chartData.rows.splice(0,this.chartData.rows.length)
        transactionData(param1).then(response=>{
          console.log(response)
          if(response.data.data){
            for(let item in response.data.data){
              this.chartData.rows.push({
                amount:chartRowMap[item],
                sales: response.data.data[item]
              })
            }
          }
        })
      },
      handleAmountDateChange(dateRange){
        console.log(dateRange)
        this.amountDateRange = dateRange
        this.getTransactionData()
      },
      handleDateChange(dateRange){
        console.log(dateRange)
        this.dateRange = dateRange
        this.getData()
      },
      amountChangeType(){
        this.getTransactionData()
      }
      ,
      changeType(){
        this.getData()
      }
    }
  }
</script>

<style scoped>

</style>
