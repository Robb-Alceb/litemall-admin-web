<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="4" class="table-cell-title">{{$t('Name')}}</el-col>
          <el-col :span="4" class="table-cell-title">介绍名称</el-col>
          <el-col :span="4" class="table-cell-title">标签</el-col>
          <el-col :span="4" class="table-cell-title">{{$t('Coupon_type')}}</el-col>
          <el-col :span="4" class="table-cell-title">{{$t('Lowest_spending_value')}}</el-col>
          <el-col :span="4" class="table-cell-title">优惠面值</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">{{ coupon.name }}</el-col>
          <el-col :span="4" class="table-cell">{{ coupon.desc }}</el-col>
          <el-col :span="4" class="table-cell">{{ coupon.tag }}</el-col>
          <el-col :span="4" class="table-cell">{{ formatType(coupon.type)  }}</el-col>
          <el-col :span="4" class="table-cell">{{$t('Full')}}{{ coupon.min }}元可用</el-col>
          <el-col :span="4" class="table-cell">{{$t('Discount')}}{{ coupon.discount }}{{$t('Dollars')}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell-title">每人限额</el-col>
          <el-col :span="4" class="table-cell-title">{{$t('Current_status')}}</el-col>
          <el-col :span="4" class="table-cell-title">商品范围</el-col>
          <el-col :span="4" class="table-cell-title">有效期</el-col>
          <el-col :span="4" class="table-cell-title">优惠兑换码</el-col>
          <el-col :span="4" class="table-cell-title">发行数量</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">{{ coupon.limit }}</el-col>
          <el-col :span="4" class="table-cell">{{ formatStatus(coupon.status)  }}</el-col>
          <el-col :span="4" class="table-cell">{{ formatGoodsType(coupon.goodsType)  }}</el-col>
          <el-col :span="4" class="table-cell" :title="getTimeScope()">{{ getTimeScope() }}</el-col>
          <el-col :span="4" class="table-cell">{{ coupon.code }}</el-col>
          <el-col :span="4" class="table-cell">{{ coupon.total === 0 ? "不限" : coupon.total }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="table-cell-title">使用门槛</el-col>
          <el-col :span="4" class="table-cell-title">与商品活动价共用</el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="table-cell">
            <el-tag v-if="!coupon.userLevel || !coupon.userLevel.length">无限制</el-tag>
            <el-tag v-else v-for="item in coupon.userLevel">{{userLeverFilter(item) }}</el-tag>
          </el-col>
          <el-col :span="4" class="table-cell">
            {{coupon.promotionOnly == 0 ? "共用" : "不共用"}}
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card v-if="coupon.goodsType != 0">
      <div slot="header" class="clearfix">
        <span>指定商品列表</span>
      </div>
      <!-- 查询结果 -->
      <el-table v-loading="listGoodsLoading" :data="goodsList" :element-loading-text="$t('Searching')" border fit highlight-current-row>
        <el-table-column align="center" :label="$t('Store_belong')" prop="shopName">
        </el-table-column>
        <el-table-column align="center" :label="$t('Merchandise_name')" prop="name"/>
        <el-table-column align="center" :label="$t('Merchandise_code')" prop="goodsSn"/>

      </el-table>

      <pagination v-show="goodsTotal>0" :total="goodsTotal" :page.sync="listGoodsQuery.page" :limit.sync="listGoodsQuery.limit" @pagination="getGoodsList" />
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>优惠券使用统计</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="4" class="table-cell-title">{{$t('已领取数量')}}</el-col>
          <el-col :span="4" class="table-cell-title">{{$t('已使用数量')}}</el-col>
          <el-col :span="4" class="table-cell-title">{{$t('使用优惠券订单总额')}}</el-col>
          <el-col :span="4" class="table-cell-title">{{$t('总优惠金额')}}</el-col>
          <el-col :span="4" class="table-cell-title">{{$t('总订单价格')}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">$ {{ statistics.pullNumber }}</el-col>
          <el-col :span="4" class="table-cell">$ {{ statistics.usedNumber }}</el-col>
          <el-col :span="4" class="table-cell">${{ statistics.orderTotalPrice }}</el-col>
          <el-col :span="4" class="table-cell">$ {{ statistics.orderTotalDiscount  }}</el-col>
          <el-col :span="4" class="table-cell">$ {{ statistics.orderTotalActual }}</el-col>
        </el-row>
      </div>
    </el-card>
    <!-- 查询操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.userId" clearable class="filter-item" style="width: 200px;" :placeholder="$t('Please_enter_member_ID')"/>
      <el-select v-model="listQuery.status" clearable style="width: 200px" class="filter-item" placeholder="请选择使用状态">
        <el-option v-for="type in useStatusOptions" :key="type.value" :label="type.label" :value="type.value"/>
      </el-select>
      <el-button v-permission="['GET /admin/coupon/listuser']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('Search')}}</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" :element-loading-text="$t('Searching')" border fit highlight-current-row>

      <el-table-column align="center" label="用户优惠券ID" prop="id" sortable/>

      <el-table-column align="center" :label="$t('Member_ID')" prop="userId"/>

      <el-table-column align="center" label="领取时间" prop="addTime"/>

      <el-table-column align="center" label="使用状态" prop="status">
        <template slot-scope="scope">{{ formatUseStatus(scope.row.status)  }}</template>
      </el-table-column>

      <el-table-column align="center" label="订单ID" prop="orderId"/>

      <el-table-column align="center" label="使用时间" prop="usedTime"/>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { readCoupon, listCouponUser, listCouponGoods, couponStatistics } from '@/api/coupon'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { allForPerm } from '@/api/shop'


export default {
  name: 'CouponDetail',
  components: { Pagination },
  filters: {

  },
  data() {
    const defaultTypeOptions = [
      {
        label: this.$t('All_purpose_coupons'),
        value: 0
      },
      {
        label: this.$t('Free_coupons_upon_registration'),
        value: 1
      },
      {
        label: this.$t('Coupon_validation_code'),
        value: 2
      }
    ]

    const defaultUseStatusOptions = [
      {
        label: '未使用',
        value: 0
      },
      {
        label: '已使用',
        value: 1
      },
      {
        label: this.$t('Expired'),
        value: 2
      },
      {
        label: this.$t('Merchandise_removed'),
        value: 3
      }
    ]

    return {
      defaultTypeOptions,
      defaultUseStatusOptions,
      typeOptions: Object.assign({}, defaultTypeOptions),
      useStatusOptions: Object.assign({}, defaultUseStatusOptions),
      coupon: {},
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        couponId: 0,
        userId: undefined,
        status: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      goodsList: [],
      goodsTotal: 0,
      listGoodsLoading: true,
      listGoodsQuery: {
        page: 1,
        limit: 20,
        id: 0,
        sort: 'add_time',
        order: 'desc'
      },
      downloadLoading: false,
      shops:[],
      statistics:{}
    }
  },
  created() {
    this.init()
    if (this.$route.query.id == null) {
      return
    }
    this.listGoodsQuery.id = this.$route.query.id;
    this.getGoodsList()
    couponStatistics(this.listGoodsQuery.id).then(response=>{
      this.statistics = response.data.data
    })
    allForPerm().then(response=>{
      this.shops = response.data.data.list
    })
  },
  methods: {
    formatType(type) {
      for (let i = 0; i < this.defaultTypeOptions.length; i++) {
        if (type === this.defaultTypeOptions[i].value) {
          return this.defaultTypeOptions[i].label
        }
      }
      return ''
    },
    formatGoodsType(goodsType) {
      if (goodsType === 0) {
        return this.$t('Usable_in_any_situation')
      } else if (goodsType === 1) {
        return this.$t('Select_category')
      } else {
        return this.$t('Select_merchandise')
      }
    },
    formatStatus(status) {
      if (status === 0) {
        return this.$t('Normal')
      } else if (status === 1) {
        return this.$t('Expired')
      } else {
        return this.$t('Merchandise_removed')
      }
    },
    formatUseStatus(status) {
      if (status === 0) {
        return '未使用'
      } else if (status === 1) {
        return '已使用'
      } else if (status === 3) {
        return this.$t('Expired')
      } else {
        return this.$t('Merchandise_removed')
      }
    },
    userLeverFilter(level){
      if (level === 1) {
        return '白银会员'
      } else if (level === 2) {
        return '黄金会员'
      } else if (level === 3) {
        return '铂金会员'
      } else if (level === 4) {
        return '钻石会员'
      } else{
        return '无限制'
      }
    },
    init: function() {
      if (this.$route.query.id == null) {
        return
      }
      readCoupon(this.$route.query.id).then(response => {
        this.coupon = response.data.data
      })
      this.listQuery.couponId = this.$route.query.id
      this.getList()
    },
    getList() {
      this.listLoading = true
      listCouponUser(this.listQuery)
        .then(response => {
          this.list = response.data.data.list
          this.total = response.data.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
    },
    getGoodsList(){
      this.listGoodsLoading = true
      listCouponGoods(this.listGoodsQuery)
        .then(response => {
          this.goodsList = response.data.data.list
          this.goodsTotal = response.data.data.total
          this.listGoodsLoading = false
        })
        .catch(() => {
          this.goodsList = []
          this.goodsTotal = 0
          this.listGoodsLoading = false
        })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getTimeScope() {
      if (this.coupon.timeType === 0) {
        return '领取' + this.coupon.days + '天有效'
      } else if (this.coupon.timeType === 1) {
        return '自' + this.coupon.startTime + '至' + this.coupon.endTime + '有效'
      } else {
        return '未知'
      }
    },
    getGoodsScope() {
    },

  }
}
</script>
<style scoped>
  .filter-container {
    margin-top: 20px;
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
