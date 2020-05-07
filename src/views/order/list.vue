<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.userName" clearable class="filter-item" style="width: 200px;" :placeholder="$t('请输入用户账号')"/>
      <el-input v-model="listQuery.orderSn" clearable class="filter-item" style="width: 200px;" :placeholder="$t('Please_enter_order_number')"/>
      <el-select v-model="listQuery.shopId" clearable style="width: 200px" class="filter-item" :placeholder="$t('Please_select_store_')">
        <el-option v-for="item in shops" :label="item.name" :value="item.id"/>
      </el-select>
      <el-select v-model="listQuery.orderStatusArray" multiple style="width: 200px" class="filter-item" :placeholder="$t('Please_select_order_status')">
        <el-option v-for="(key, value) in statusMap" :key="key" :label="key" :value="value"/>
      </el-select>
      <el-button v-permission="['GET /admin/order/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('Search')}}</el-button>
<!--      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{$t('Find')}}</el-button>-->
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" :element-loading-text="$t('Searching')" border fit highlight-current-row>

      <el-table-column align="center" min-width="100" :label="$t('Order_ID')" prop="orderSn"/>

      <el-table-column align="center" min-width="100" :label="$t('Store')" prop="shopId">
        <template slot-scope="scope">
          {{getShopName(scope.row.shopId)}}
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="100" :label="$t('Submission_time')" prop="addTime"/>

      <el-table-column align="center" :label="$t('Member_account')" prop="userName"/>

      <el-table-column align="center" :label="$t('Order_cost')" prop="orderPrice"/>

      <el-table-column align="center" :label="$t('Payment_method')" prop="payType">
        <template slot-scope="scope">
          <el-tag>{{ payTypeFilter(scope.row.payType)  }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('Source_of_order')" prop="orderSource">
        <template slot-scope="scope">
          <el-tag>{{ orderSourceFilter(scope.row.orderSource) }}</el-tag>
        </template>
      </el-table-column>

      <!--<el-table-column align="center" :label="$t('Member_ID')" prop="userId"/>-->

      <el-table-column align="center" :label="$t('Order_status')" prop="orderStatus">
        <template slot-scope="scope">
          <el-tag>{{ orderStatusFilter(scope.row.orderStatus) }}</el-tag>
        </template>
      </el-table-column>

      <!--      <el-table-column align="center" label="订单金额" prop="orderPrice"/>

      <el-table-column align="center" label="支付金额" prop="actualPrice"/>

      <el-table-column align="center" label="支付时间" prop="payTime"/>

      <el-table-column align="center" label="物流单号" prop="shipSn"/>

      <el-table-column align="center" label="物流渠道" prop="shipChannel"/>-->

      <el-table-column align="center" :label="$t('Operate')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['GET /admin/order/detail']" type="primary" size="mini" @click="handleDetail(scope.row)">{{$t('Details')}}</el-button>
          <el-button v-permission="['POST /admin/order/ship']" v-if="scope.row.orderStatus==201" type="primary" size="mini" @click="handleShip(scope.row)">{{$t('Delivery_')}}</el-button>
          <el-button v-permission="['POST /admin/order/refund']" v-if="scope.row.orderStatus==202" type="primary" size="mini" @click="handleRefund(scope.row)">退款</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 订单详情对话框 -->
    <el-dialog :visible.sync="orderDialogVisible" :title="$t('Order_details')" width="800">

      <el-form :data="orderDetail" label-position="left">
        <el-form-item :label="$t('Order_ID')">
          <span>{{ orderDetail.order.orderSn }}</span>
        </el-form-item>
        <el-form-item :label="$t('Order_status')">
          <el-tag>{{ orderStatusFilter(orderDetail.order.orderStatus)  }}</el-tag>
        </el-form-item>
        <el-form-item label="订单用户">
          <span>{{ orderDetail.user.nickname }}</span>
        </el-form-item>
        <el-form-item label="用户留言">
          <span>{{ orderDetail.order.message }}</span>
        </el-form-item>
        <el-form-item :label="$t('Receiving_details')">
          <span>（{{$t('Receiver_')}}）{{ orderDetail.order.consignee }}</span>
          <span>（手机号）{{ orderDetail.order.mobile }}</span>
          <span>（地址）{{ orderDetail.order.address }}</span>
        </el-form-item>
        <el-form-item :label="$t('Goods_details_info')">
          <el-table :data="orderDetail.orderGoods" border fit highlight-current-row>
            <el-table-column align="center" :label="$t('Merchandise_name')" prop="goodsName" />
            <el-table-column align="center" :label="$t('Merchandise_code')" prop="goodsSn" />
            <el-table-column align="center" :label="$t('Merchandise_specifications')" prop="specifications" />
            <el-table-column align="center" :label="$t('Merchandise_price')" prop="price" />
            <el-table-column align="center" :label="$t('Number_of_merchandise')" prop="number" />
            <el-table-column align="center" :label="$t('Merchandise_picture')" prop="picUrl">
              <template slot-scope="scope">
                <img :src="scope.row.picUrl" width="40">
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item :label="$t('Cost_details')">
          <span>
            (实际费用){{ orderDetail.order.actualPrice }}{{$t('Dollars')}}=
            ({{$t('Merchandise_total_cost')}}){{ orderDetail.order.goodsPrice }}{{$t('Dollars')}}+
            (快递费用){{ orderDetail.order.freightPrice }}{{$t('Dollars')}}-
            (优惠减免){{ orderDetail.order.couponPrice }}{{$t('Dollars')}}-
            (积分减免){{ orderDetail.order.integralPrice }}{{$t('Dollars')}}
          </span>
        </el-form-item>
        <el-form-item label="支付信息">
          <span>（支付渠道）微信支付</span>
          <span>（支付时间）{{ orderDetail.order.payTime }}</span>
        </el-form-item>
        <el-form-item label="快递信息">
          <span>（{{$t('Express_Delivery_Company')}}）{{ orderDetail.order.shipChannel }}</span>
          <span>（快递单号）{{ orderDetail.order.shipSn }}</span>
          <span>（发货时间）{{ orderDetail.order.shipTime }}</span>
        </el-form-item>
        <el-form-item :label="$t('Receiving_details')">
          <span>（确认收货时间）{{ orderDetail.order.confirmTime }}</span>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 发货对话框 -->
    <el-dialog :visible.sync="shipDialogVisible" :title="$t('Delivery_')">
      <el-form ref="shipForm" :model="shipForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('Express_Delivery_Company')" prop="shipChannel">
          <el-input v-model="shipForm.shipChannel"/>
        </el-form-item>
        <el-form-item :label="$t('Express_Delivery_number')" prop="shipSn">
          <el-input v-model="shipForm.shipSn"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="shipDialogVisible = false">{{$t('Cancel')}}</el-button>
        <el-button type="primary" @click="confirmShip">{{$t('Confirm')}}</el-button>
      </div>
    </el-dialog>

    <!-- 退款对话框 -->
    <el-dialog :visible.sync="refundDialogVisible" title="退款">
      <el-form ref="refundForm" :model="refundForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('Refunded_amount')" prop="refundMoney">
          <el-input v-model="refundForm.refundMoney" :disabled="true"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="refundDialogVisible = false">{{$t('Cancel')}}</el-button>
        <el-button type="primary" @click="confirmRefund">{{$t('Confirm')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listOrder, shipOrder, refundOrder } from '@/api/order'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import checkPermission from '@/utils/permission' // 权限判断函数
import { allForPerm } from '@/api/shop'



export default {
  name: 'Order',
  components: { Pagination },
  filters: {

  },
  data() {
    const statusMap = {
      101: this.$t('Unpaid1'),
      102: this.$t('Member_cancelled'),
      103: this.$t('System_cancelled'),
      201: this.$t('Paid'),
      202: this.$t('Apply_for_refund'),
      203: this.$t('Refunded'),
      301: this.$t('Sent_for_delivery'),
      401: this.$t('Member_received'),
      402: this.$t('System_received')
    }

    const payTypeMap = {
      1: this.$t('Unpaid'),
      2: this.$t('Paypal'),
      3: this.$t('礼物卡支付')
    }

    const orderSourceMap = {
      1: '手机app'
    }
    return {
      statusMap,
      payTypeMap,
      orderSourceMap,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        userName:undefined,
        id: undefined,
        name: undefined,
        shopId: undefined,
        orderStatusArray: [],
        sort: 'add_time',
        order: 'desc'
      },
      statusMap,
      orderDialogVisible: false,
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
      refundForm: {
        orderId: undefined,
        refundMoney: undefined
      },
      refundDialogVisible: false,
      downloadLoading: false,
      shops: []
    }
  },
  created() {
    if(this.$route.query && this.$route.query.id){
      this.listQuery.id = this.$route.query.id
    }
    if(this.$route.query && this.$route.query.shopId){
      this.listQuery.shopId = this.$route.query.shopId
    }
    this.getList()
    allForPerm().then(response=>{
      this.shops = response.data.data.list
    })
  },
  methods: {
    orderStatusFilter(status) {
      return this.statusMap[status]
    },
    payTypeFilter(type){
      return this.payTypeMap[type]
    },
    orderSourceFilter(source){
      return this.orderSourceMap[source]
    },
    checkPermission,
    getList() {
      this.listLoading = true
      listOrder(this.listQuery).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDetail(row) {
      this.$router.push({ path: '/order/detail', query: { id: row.id }})
      /*        detailOrder(row.id).then(response => {
          this.orderDetail = response.data.data
        })
        this.orderDialogVisible = true*/
    },
    handleShip(row) {
      this.shipForm.orderId = row.id
      this.shipForm.shipChannel = row.shipChannel
      this.shipForm.shipSn = row.shipSn

      this.shipDialogVisible = true
      this.$nextTick(() => {
        this.$refs['shipForm'].clearValidate()
      })
    },
    confirmShip() {
      this.$refs['shipForm'].validate((valid) => {
        if (valid) {
          shipOrder(this.shipForm).then(response => {
            this.shipDialogVisible = false
            this.$notify.success({
              title: this.$t('Success!'),
              message: this.$t('Confirm_delivery_successful')
            })
            this.getList()
          }).catch(response => {
            this.$notify.error({
              title: this.$t('Failed'),
              message: response.data.errmsg
            })
          })
        }
      })
    },
    handleRefund(row) {
      this.refundForm.orderId = row.id
      this.refundForm.refundMoney = row.actualPrice || row.orderPrice

      this.refundDialogVisible = true
      this.$nextTick(() => {
        this.$refs['refundForm'].clearValidate()
      })
    },
    confirmRefund() {
      this.$refs['refundForm'].validate((valid) => {
        if (valid) {
          refundOrder(this.refundForm).then(response => {
            this.refundDialogVisible = false
            this.$notify.success({
              title: this.$t('Success!'),
              message: '确认退款成功'
            })
            this.getList()
          }).catch(response => {
            this.$notify.error({
              title: this.$t('Failed'),
              message: response.data.errmsg
            })
          })
        }
      })
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['订单ID', '订单编号', '用户ID', '订单状态', '是否删除', '收货人', '收货联系电话', '收货地址']
          const filterVal = ['id', 'orderSn', 'userId', 'orderStatus', 'isDelete', 'consignee', 'mobile', 'address']
          excel.export_json_to_excel2(tHeader, this.list, filterVal, '订单信息')
          this.downloadLoading = false
        })
    },
    getShopName(shopId){
      let shop =  this.shops.find(shop=>{
        if(shop.id == shopId){
          return true
        }
      })
      if(shop){
        return shop.name
      }
    }
  }
}
</script>
