<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>商品统计</span>
      </div>
      <el-row style="margin-bottom: 20px;">
        <el-select v-model="queryParam.shopId" clearable placeholder="请选择门店" @change="getData">
          <el-option v-for="item in shops" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </el-row>
      <el-card>
        <div slot="header" class="clearfix">
          <span>商品类目销售分析</span>
          <div style="display: inline;float: right;">
            <div style="display: inline;float: right;" class="block">
              <el-date-picker
                v-model="dateRange"
                type="datetimerange"
                :clearable="false"
                :picker-options="pickerOptions"
                @change="handleDateChange"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                placeholder="选择日期"/>
            </div>
          </div>
<!--          <div style="display: inline;float: right;">
            <el-button style="display: inline;" @click="exportCategory()">导出数据</el-button>
          </div>-->
        </div>
        <el-row>
          <el-col :span="12">
            <ve-pie :data="goodsData"
                    :events="chartEvents"/>
          </el-col>
          <el-col :span="12">
            <ve-pie :data="categoryData"
                    :events="chartEvents"/>
          </el-col>
        </el-row>
      </el-card>
      <el-card>
        <div slot="header" class="clearfix">
          <span>商品销售情况</span>
          <div style="display: inline;float: right;">
            <div style="display: inline;float: right;" class="block">
              <el-date-picker
                v-model="saleDateRange"
                type="datetimerange"
                :clearable="false"
                :picker-options="pickerOptions"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                @change="handleSaleDateChange"
                placeholder="选择日期"/>
            </div>
          </div>
<!--          <div style="display: inline;float: right;">
            <el-button style="display: inline;" @click="exportList()">导出数据</el-button>
          </div>-->
        </div>
        <el-row>
          <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
            <el-table-column align="center" label="商品名称" prop="name"/>
            <el-table-column align="center" label="浏览量" prop="visit"/>
            <el-table-column align="center" label="浏览人数" prop="visitPeople"/>
            <el-table-column align="center" label="付款人数" prop="payNumber"/>
            <el-table-column align="center" label="单品转化率" prop="convertRatio"/>
            <el-table-column align="center" label="件数" prop="goodsNumber"/>
            <el-table-column align="center" label="金额" prop="money"/>
          </el-table>
        </el-row>
      </el-card>
    </el-card>
  </div>
</template>

<script>
import VePie from 'v-charts/lib/pie.common'
import {goodsStatistics, goodsSalesStatistics} from '@/api/statistics'
import { allForPerm } from '@/api/shop'
import { formatDate } from '@/utils/date'
export default {
  name: 'GoodsStatistics',
  components: { VePie },
  data() {
    const startDate = formatDate(new Date(new Date().getTime() - 3600 * 1000 * 24 * 1), 'yyyy-MM-dd hh:mm')
    const endDate = formatDate(new Date(), 'yyyy-MM-dd hh:mm')
    return {
      queryParam:{
        shopId:undefined
      },
      listQuery:{
        type: '1',
      },
      shops:[],
      dateRange: [startDate, endDate],
      saleDateRange: [startDate, startDate],
      activeTable: '1',
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
      listLoading: false,
      goodsData: {
        columns: ['日期', '访问用户'],
        rows: [
          { '日期': '拿铁', '访问用户': 1393 },
          { '日期': '卡布奇诺', '访问用户': 3530 },
          { '日期': '黑咖啡', '访问用户': 2923 },
          { '日期': '蓝咖啡', '访问用户': 1723 },
          { '日期': '白咖啡', '访问用户': 3792 },
          { '日期': '其他', '访问用户': 4593 }
        ]
      },
      categoryData: {
        columns: ['日期', '访问用户'],
        rows: [
          { '日期': '咖啡', '访问用户': 1393 },
          { '日期': '杯子', '访问用户': 3530 },
          { '日期': '牛奶', '访问用户': 2923 },
          { '日期': '咖啡豆', '访问用户': 1723 },
          { '日期': '咖啡机', '访问用户': 3792 },
          { '日期': '其他', '访问用户': 4593 }
        ]
      },
      list: [{
        name: '咖啡',
        visit: 90,
        visitPeople: 34,
        payNumber: 12,
        convertRatio: 33,
        goodsNumber: 10,
        money: 1000
      }, {
        name: '咖啡',
        visit: 90,
        visitPeople: 34,
        payNumber: 12,
        convertRatio: 33,
        goodsNumber: 10,
        money: 1000
      }, {
        name: '咖啡',
        visit: 90,
        visitPeople: 34,
        payNumber: 12,
        convertRatio: 33,
        goodsNumber: 10,
        money: 1000
      }, {
        name: '咖啡',
        visit: 90,
        visitPeople: 34,
        payNumber: 12,
        convertRatio: 33,
        goodsNumber: 10,
        money: 1000
      }],
      chartEvents: {
        click: function (e) {
          self.name = e.name
          console.log(e)
        }
      }

    }
  },
  created(){
    let shopId = this.$route.query.id
    if(shopId){
      this.queryParam.shopId = shopId
    }
    allForPerm().then(response=>{
      this.shops = response.data.data.list
    })
    this.getData()
  },
  methods: {
    getData(){
      let param = {
        shopId: this.queryParam.shopId,
        startTime: this.dateRange[0],
        endTime: this.dateRange[1]
      }
      goodsStatistics(param).then(response=>{
        console.log(response)
        if(response.data.data){
          if(response.data.data.orderGoods){
            this.goodsData = response.data.data.orderGoods
          }
          if(response.data.data.categorys){
            this.categoryData = response.data.data.categorys
          }
        }
      })
      this.getList()
    },
    getList(){
      let param = {
        shopId: this.queryParam.shopId,
        type: this.listQuery.type,
        startTime: this.saleDateRange[0],
        endTime: this.saleDateRange[1]
      }
      goodsSalesStatistics(param).then(response=>{
        console.log(response)
        if(!response.data.data){
          this.list = []
        }else{
          this.list = response.data.data.list
        }
      })
    },
    handleDateChange(dateRange){
      console.log(dateRange)
      this.getData()
    },
    handleSaleDateChange(dateRange){
      console.log(dateRange)
      this.getList()
    },
    exportCategory() {

    },
    handleCategoryClick() {

    },
    exportList() {

    },
    handleListClick() {

    }
  }
}
</script>

<style scoped>

</style>
