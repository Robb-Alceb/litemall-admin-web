<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>商品统计</span>
      </div>
      <el-row style="margin-bottom: 20px;">
        <el-select v-model="queryParam.shopId" clearable placeholder="请选择门店">
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
                placeholder="选择日期"/>
            </div>
          </div>
<!--          <div style="display: inline;float: right;">
            <el-button style="display: inline;" @click="exportCategory()">导出数据</el-button>
          </div>-->
        </div>
        <el-row>
          <el-col :span="12">
            <ve-pie :data="goodsData"/>
          </el-col>
          <el-col :span="12">
            <ve-pie :data="categoryData"/>
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
export default {
  name: 'GoodsStatistics',
  components: { VePie },
  data() {
    const startDate = new Date(new Date().getTime() - 3600 * 1000 * 24 * 1);
    const endDate = new Date();
    return {
      queryParam:{
        shopId:undefined
      },
      shops:[],
      dateRange: [startDate, endDate],
      saleDateRange: [startDate, startDate],
      activeTable: '1',
      queryParam: {
        shopId: undefined,
        startTime: undefined,
        endTIme: undefined
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
      }]

    }
  },
  created(){
    let shopId = this.$route.query.id
    if(shopId){
      this.queryParam.shopId = shopId
    }
  },
  methods: {
    getData(){
/*      goodsStatistics(this.queryParam).then(res=>{
      })*/
    },
    handleDateChange(dateRange){
      console.log(dateRange)
    },
    handleSaleDateChange(dateRange){
      console.log(dateRange)
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
