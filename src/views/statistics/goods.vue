<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{$t('Merchandise_data')}}</span>
      </div>
      <el-row style="margin-bottom: 20px;">
        <el-select v-model="queryParam.shopId" clearable :placeholder="$t('Please_select_store_')" @change="getData">
          <el-option v-for="item in shops" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </el-row>
      <el-card>
        <div slot="header" class="clearfix">
          <span>{{$t('Merchandise_category_sales_data')}}</span>
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
                :placeholder="this.$t('Select_dates')"/>
            </div>
          </div>
<!--          <div style="display: inline;float: right;">
            <el-button style="display: inline;" @click="exportCategory()">导出数据</el-button>
          </div>-->
        </div>
        <el-row>
          <el-col :span="12">
            <ve-pie :data="goodsData"
                    :events="goodsChartEvents"/>
            <div align="center">商品销售分析</div>
          </el-col>
          <el-col :span="12">
            <ve-pie :data="categoryData"
                    :events="categoryChartEvents"/>
          </el-col>
          <div align="center">类目销售分析</div>
        </el-row>
      </el-card>
      <el-card>
        <div slot="header" class="clearfix">
          <span>{{$t('Merchandise_sales')}}</span>
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
                :placeholder="this.$t('Select_dates')"/>
            </div>
          </div>
<!--          <div style="display: inline;float: right;">
            <el-button style="display: inline;" @click="exportList()">导出数据</el-button>
          </div>-->
        </div>
        <el-row>
          <el-table v-if="listQuery.type == '1'" v-loading="listLoading" :data="list" :element-loading-text="$t('Searching')" border fit highlight-current-row>
            <el-table-column align="center" :label="$t('Merchandise_name')" prop="goodsName"/>
            <el-table-column align="center" :label="$t('Viewership')" prop="browseNum"/>
            <el-table-column align="center" :label="$t('Number_of_views')" prop="browseUserNum"/>
            <el-table-column align="center" :label="$t('Number_of_paying_customers')" prop="payUserNum"/>
            <el-table-column align="center" :label="$t('Item_turnover_rate')" prop="goodsConversionRate"/>
            <el-table-column align="center" :label="$t('Units')" prop="salesNum"/>
            <el-table-column align="center" :label="$t('Amount')" prop="actualPrice"/>
          </el-table>
          <el-table v-else v-loading="listLoading" :data="list" :element-loading-text="$t('Searching')" border fit highlight-current-row>
            <el-table-column align="center" :label="$t('Category_Name')" prop="categoryName"/>
            <el-table-column align="center" :label="$t('Viewership')" prop="browseNum"/>
            <el-table-column align="center" :label="$t('Number_of_views')" prop="browseUserNum"/>
            <el-table-column align="center" :label="$t('Number_of_paying_customers')" prop="payUserNum"/>
            <el-table-column align="center" :label="$t('Item_turnover_rate')" prop="goodsConversionRate"/>
            <el-table-column align="center" :label="$t('Units')" prop="salesNum"/>
            <el-table-column align="center" :label="$t('Amount')" prop="actualPrice"/>
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
    const startDate = formatDate(new Date(new Date().getTime() - 3600 * 1000 * 24 * 7), 'yyyy-MM-dd hh:mm')
    const endDate = formatDate(new Date(), 'yyyy-MM-dd hh:mm')
    let goodsChartEvents = {
      click: (e)=>{
        this.saleDateRange = this.dateRange
        this.getList('1')
      }
    }
    let categoryChartEvents = {
      click: (e)=>{
        this.saleDateRange = this.dateRange
        this.getList('2')
      }
    }
    return {
      goodsChartEvents,
      categoryChartEvents,
      queryParam:{
        shopId:undefined
      },
      listQuery:{
        type: '1',
      },
      shops:[],
      dateRange: [startDate, endDate],
      saleDateRange: [startDate, endDate],
      activeTable: '1',
      pickerOptions: {
        shortcuts: [{
          text: this.$t('Yesterday'),
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
            picker.$emit('pick', [start, end]);
          }
        },{
          text: this.$t('Last_7_days'),
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: this.$t('Last_month'),
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
        columns: ['goods', 'count'],
        rows: [
        ]
      },
      categoryData: {
        columns: ['category', 'count'],
        rows: [
        ]
      },
      list: [],
/*      goodsChartEvents: {
        click: this.getList
      },
      categoryChartEvents: {
        click: this.getList
      }*/

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
      this.goodsData.rows.splice(0,this.goodsData.rows.length)
      this.categoryData.rows.splice(0,this.categoryData.rows.length)
      goodsStatistics(param).then(response=>{
        console.log(response)
        if(response.data.data){
          if(response.data.data.orderGoods){
            response.data.data.orderGoods.forEach(goods=>{
              let exist = this.goodsData.rows.find(goods=>{
                if(goods.goods == goods.goodsName){
                  return goods;
                }
              })
              if(exist){
                exist.count = exist.count + goods.number;
              }else{
                this.goodsData.rows.push({
                  goods:goods.goodsName,
                  count:goods.number
                })
              }
            })
          }
          if(response.data.data.categorys){
            response.data.data.categorys.forEach(cate=>{
              this.categoryData.rows.push({
                category:cate.categoryName,
                count:cate.number,
              })
            })
          }
        }
      })
      this.getList()
    },
    getList(type){
      if(type){
        this.listQuery.type = type;
      }
      let param = {
        shopId: this.queryParam.shopId,
        type: type || this.listQuery.type,
        startTime: this.saleDateRange[0],
        endTime: this.saleDateRange[1]
      }
      goodsSalesStatistics(param).then(response=>{
        console.log(response)
        if(!response.data.data){
          this.list = []
        }else{
          let cpMap = {};
          this.list = [];
          response.data.data.list.forEach(data=>{
            //商品
            if(data.goodsName){
              if(cpMap[data.goodsName]){
                let tmp = cpMap[data.goodsName];
                tmp.browseUserNum += data.browseUserNum
                tmp.browseNum += data.browseNum
                tmp.payUserNum += data.payUserNum
              }else{
                cpMap[data.goodsName] = data
              }
            //类目
            }else if(data.categoryName){
              if(cpMap[data.categoryName]){
                let tmp = cpMap[data.categoryName];
                tmp.browseUserNum += data.browseUserNum
                tmp.browseNum += data.browseNum
                tmp.payUserNum += data.payUserNum
              }else{
                cpMap[data.categoryName] = data
              }
            }
          })
          for(let item in cpMap){
            this.list.push(cpMap[item])
          }
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

    },
  }
}
</script>

<style scoped>

</style>
