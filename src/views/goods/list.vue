<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-select v-model="listQuery.shopId" clearable class="filter-item" :placeholder="$t('请选择门店')">
          <el-option v-for="item in shops" :value="item.id" :label="item.name"></el-option>
      </el-select>
      <el-input v-model="listQuery.goodsSn" clearable class="filter-item" style="width: 200px;" :placeholder="$t('Please_enter_merchandise_ID')"/>
      <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" :placeholder="$t('Please_enter_merchandise_name')"/>
      <el-button v-permission="['GET /admin/goods/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('Search')}}</el-button>
      <el-button v-permission="['POST /admin/goods/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">{{$t('Add')}}</el-button>
<!--      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{$t('Find')}}</el-button>-->
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" :element-loading-text="$t('Searching')" border fit highlight-current-row>

      <el-table-column align="center" :label="$t('Store')" prop="shopName">
        <template slot-scope="scope">
          {{getShopName(scope.row.shopId)}}
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('Merchandise_code')" prop="goodsSn"/>

      <el-table-column align="center" min-width="100" :label="$t('Name')" prop="name"/>

      <el-table-column align="center" property="iconUrl" :label="$t('Picture')">
        <template slot-scope="scope">
          <img :src="scope.row.picUrl" width="40">
        </template>
      </el-table-column>

      <!--      <el-table-column align="center" property="iconUrl" label="分享图">
        <template slot-scope="scope">
          <img :src="scope.row.shareUrl" width="40">
        </template>
      </el-table-column>-->

      <!--      <el-table-column align="center" label="详情" prop="detail">
        <template slot-scope="scope">
          <el-dialog :visible.sync="detailDialogVisible" title="商品详情">
            <div v-html="goodsDetail"/>
          </el-dialog>
          <el-button type="primary" size="mini" @click="showDetail(scope.row.detail)">查看</el-button>
        </template>
      </el-table-column>-->

      <!--<el-table-column align="center" label="专柜价格" prop="counterPrice"/>-->

      <el-table-column align="center" :label="$t('Price')" prop="retailPrice"/>

<!--      <el-table-column align="center" label="货号" prop="goodsNum"/>-->

      <el-table-column align="center" :label="$t('Label')">
        <template slot-scope="scope">
          <el-row>
            <span>{{$t('Launch')}}:</span>
            <el-switch v-model="scope.row.isOnSale" :disabled="handlePermission(['PUT /admin/goods/push'])" @change="handlePush(scope.row)" :active-value="true" :nactive-value="false" active-color="#13ce66" inactive-color="#ff4949"/>
          </el-row>
          <el-row>
            <span>{{$t('New_product')}}:</span>
            <el-switch v-model="scope.row.isNew" :disabled="handlePermission(['PUT /admin/goods/newProduce'])" @change="handleNewProduce(scope.row)"  :active-value="true" :nactive-value="false" active-color="#13ce66" inactive-color="#ff4949"/>
          </el-row>
          <el-row>
            <span>{{$t('Recommendation')}}:</span>
            <el-switch v-model="scope.row.isHot" :disabled="handlePermission(['PUT /admin/goods/recommend'])" @change="handleRecommend(scope.row)"  :active-value="true" :nactive-value="false" active-color="#13ce66" inactive-color="#ff4949"/>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('Launch_time')" prop="updateTime">
        <template slot-scope="scope">
          <span v-show="scope.row.isOnSale">{{scope.row.updateTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('Stock')" prop="number"/>

      <el-table-column align="center" :label="$t('Sales')" prop="sales"/>

      <el-table-column align="center" :label="$t('Review_Status')" prop="reviewType">
        <template slot-scope="scope">
          {{ reviewFilter(scope.row.reviewType)  }}
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('Operate')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-row>
            <el-button v-permission="['POST /admin/goods/approve', 'POST /admin/goods/reject']" type="primary" size="mini" :disabled="isShowReview(scope.row.reviewType)" @click="handleReview(scope.row)">{{$t('Review')}}</el-button>
            <el-button v-permission="['GET /admin/goods/queryGoodsLogList']" type="primary" size="mini" @click="handleLog(scope.row)">{{$t('Journal')}}</el-button>
          </el-row>
          <el-row style="margin-top: 5px;">
            <el-button v-permission="['POST /admin/goods/update']" type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('Details')}}</el-button>
            <el-button v-permission="['POST /admin/goods/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">{{$t('Delete')}}</el-button>
          </el-row>
          <el-row style="margin-top: 5px;">
            <el-button v-permission="['GET /admin/goods/allPrice']" type="info" size="mini" @click="getPriceDetail(scope.row)">{{$t('Price')}}</el-button>
<!--            <el-button v-permission="['GET /admin/goods/allPrice']" type="info" size="mini" @click="getStoreDetail(scope.row)">{{$t('Stock')}}</el-button>-->
            <el-button v-shop="true" v-permission="['GET /admin/goods/readGoodsProduct']" type="info" size="mini" @click="getProductDetail(scope.row)">{{$t('Stock')}}</el-button>
          </el-row>

        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-tooltip placement="top" :content="$t('Back_to_top')">
      <back-to-top :visibility-height="100" />
    </el-tooltip>

    <el-dialog :visible.sync="reviewDialogVisiable" :title="$t('Merchandise_Review')">
      <el-form ref="reviewForm" :model="reviewForm" status-icon label-position="left" label-width="100px">
        <el-form-item :label="$t('Merchandise_name')" prop="goodsName">
          <el-input v-model="reviewForm.goodsName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item :label="$t('Notes_info')" prop="content">
          <el-input type="textarea" v-model="reviewForm.content"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reviewDialogVisiable = false">{{$t('Cancel')}}</el-button>
        <el-button v-permission="['POST /admin/goods/approve']" @click="reviewHandleReject()" type="danger">{{$t('Not_passed')}}</el-button>
        <el-button v-permission="['POST /admin/goods/reject']" @click="reviewHandlePass()" type="primary">{{$t('Passed')}}</el-button>
      </div>
    </el-dialog>


    <el-dialog :visible.sync="priceDialogVisiable" :title="$t('Merchandise_Price')">
      <el-form ref="priceForm" :model="priceForm" status-icon label-position="left" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('Merchandise_name')" prop="goodsName">
              <el-col>{{priceForm.goodsName}}</el-col>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('Merchandise_Price')" prop="goodsSellPrice">
              <el-input v-model="priceForm.goodsSellPrice"/>
            </el-form-item>
          </el-col>
          <el-col :span="8" align="center">
              <el-button v-permission="['PUT /admin/goods/updatePrice']" type="primary" size="mini" @click="handleUpdatePrice">{{$t('Renew')}}</el-button>
          </el-col>
        </el-row>
        <el-row  v-for="item in priceForm.specifications">
          <el-col :span="8">
            <el-form-item :label="$t('Goods_specifications')" prop="value">
              <el-col>{{item.value}}</el-col>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('Cost_outside_of_specification')" prop="price">
              <el-input v-model="item.price"/>
            </el-form-item>
          </el-col>
          <el-col :span="8" align="center">
            <el-button v-permission="['PUT /admin/goods/updateSpecPrice']" type="primary" size="mini" @click="handleUpdateSpecPrice(item)">{{$t('Renew')}}</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-card class="el-card">
        <div slot="header" class="clearfix">
          <span>{{$t('Discounts')}}</span>
          <el-button v-permission="['PUT /admin/goods/updateDiscountPrice']" style="float: right;" type="primary" @click="handleUpdateDiscountPrice">{{$t('Update_Discounts')}}</el-button>
        </div>
        <el-tabs :value="priceForm.priceType" @tab-click="handleTabSwitch" tab-position="top">
          <el-tab-pane :label="$t('Member_costs')" name="1">
            <el-form ref="vipPriceForm" :rules="rules" :model="priceForm.vipPriceForm" label-width="150px">
              <el-row>
                <el-col :span="12">
                  <el-form-item :label="$t('Silver_Membership')" prop="silverVipPrice">
                    <el-input v-model="priceForm.vipPriceForm.silverVipPrice">
                      <template slot="append">{{$t('Dollars')}}</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('Silver_Membership')" prop="goldVipPrice">
                    <el-input v-model="priceForm.vipPriceForm.goldVipPrice">
                      <template slot="append">{{$t('Dollars')}}</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item :label="$t('Platinum_Membership')" prop="platinumVipPrice">
                    <el-input v-model="priceForm.vipPriceForm.platinumVipPrice">
                      <template slot="append">{{$t('Dollars')}}</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('Diamond_Membership')" prop="diamondVipPrice">
                    <el-input v-model="priceForm.vipPriceForm.diamondVipPrice">
                      <template slot="append">{{$t('Dollars')}}</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane :label="$t('Staircase_pricing')" name="2">
            <el-table :data="priceForm.stepPriceForms" border fit highlight-current-row>
              <el-table-column align="center" :label="$t('Number')" prop="number">
                <template slot-scope="scope">
                  <el-input v-model="priceForm.stepPriceForms[scope.$index].number"/>
                </template>
              </el-table-column>
              <el-table-column align="center" :label="$t('Price')" prop="price">
                <template slot-scope="scope">
                  <el-input v-model="priceForm.stepPriceForms[scope.$index].price">
                    <template slot="append">{{$t('Dollars')}}</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" :label="$t('Operate')">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="handleStepAdd(scope.row)">增加</el-button>
                  <el-button type="danger" size="mini" @click="handleStepDelete(scope)">{{$t('Delete')}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane :label="$t('Full_Discount')"  name="3" >
            <el-table :data="priceForm.moneyOfPriceForms" border fit highlight-current-row>
              <el-table-column align="center" :label="$t('Full')" prop="minusPrice">
                <template slot-scope="scope">
                  <el-input v-model="priceForm.moneyOfPriceForms[scope.$index].minusPrice">
                    <template slot="append">{{$t('Dollars')}}</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" :label="$t('Immediate_Discount')" prop="maxPrice">
                <template slot-scope="scope">
                  <el-input v-model="priceForm.moneyOfPriceForms[scope.$index].maxPrice">
                    <template slot="append">{{$t('Dollars')}}</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" :label="$t('Operate')">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="handleMoneyOfAdd(scope.row)">增加</el-button>
                  <el-button type="danger" size="mini" @click="handleMoneyOfDelete(scope)">{{$t('Delete')}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearPriceForm">{{$t('Cancel')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="storeDialogVisiable" :title="$t('Merchandise_stock')">
      <el-form ref="priceForm" :model="storeForm" :rules="storeRules" status-icon label-position="left" label-width="100px">
        <el-form-item :label="$t('Merchandise_name')" prop="goodsName">
          <el-col>{{storeForm.goodsName}}</el-col>
        </el-form-item>

        <el-form-item :label="$t('Merchandise_stock')" prop="number">
          <el-input v-model.number="storeForm.number"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="storeDialogVisiable = false">{{$t('Cancel')}}</el-button>
        <el-button @click="handleUpdateStore" type="primary">{{$t('Confirm')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="productDialogVisiable" :title="$t('Merchandise_stock')">
      <el-form ref="productForm" :model="productForm" :rules="productRules" status-icon label-position="left" label-width="100px">
        <el-form-item :label="$t('Merchandise_name')" prop="goodsName">
          <el-col>{{productForm.goodsName}}</el-col>
        </el-form-item>

        <el-form-item :label="$t('Merchandise_stock')" prop="number">
          <el-input v-model.number="productForm.number"/>
        </el-form-item>
        <el-form-item :label="$t('Merchandise_sale_price')" prop="sellPrice">
          <el-input v-model.number="productForm.sellPrice">
            <template slot="append">{{$t('Dollars')}}</template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('Cost_of_merchandise')" prop="costPrice">
          <el-input v-model="productForm.costPrice">
            <template slot="append">{{$t('Dollars')}}</template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('Merchandise_warning')" prop="earlyWarningValue">
          <el-input v-model.number="productForm.earlyWarningValue"/>
        </el-form-item>
        <el-row>
          <el-form-item :label="$t('税费')" prop="taxes">
            <el-col v-for="item in taxes" :span="8">
              <el-row>
                <el-form-item :label="''" prop="tax">
                  <el-checkbox  v-model="item.enable">
                    {{ filterTaxType(item.type)}}
                  </el-checkbox>
                </el-form-item>
              </el-row>
            </el-col>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="productDialogVisiable = false">{{$t('Cancel')}}</el-button>
        <el-button @click="handleUpdateProduct" type="primary">{{$t('Confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style>
  .table-expand {
    font-size: 0;
  }
  .table-expand label {
    width: 100px;
    color: #99a9bf;
  }
  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
  }
  .gallery {
    width: 80px;
    margin-right: 10px;
  }
</style>

<script>
import { listGoods, deleteGoods, approveGoods, rejectGoods, pushGoods, newProductGoods, recommendGoods, updatePriceGoods, updateSpecPriceGoods, getAllPriceGoods, updateStoreGoods, updateGoodsDiscountPrice, readGoodsProduct, updateGoodsProduct, addGoodsProduct } from '@/api/goods'
import BackToTop from '@/components/BackToTop'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { allForPerm } from '@/api/shop'
import checkPermission from '@/utils/permission'
import ElColorAlphaSlider from "element-ui/packages/color-picker/src/components/alpha-slider";



export default {
  name: 'GoodsList',
  components: {ElColorAlphaSlider, BackToTop, Pagination },
  filters: {

  },
  data() {
    const reviewMap = {
      1: this.$t('待审核'),
      2: this.$t('Reviewed'),
      3: this.$t('Denied')
    }
    const validateDouble = (rule, value, callback) => {
      console.log('value' + value)
      if (!value || !/^[0-9,.]*$/.test(value)) {
        callback(new Error(this.$t('Sale_price_must_be_a_number')))
      } else {
        callback()
      }
    }
    return {
      reviewMap,
      rules: {
        goodsSn: [
          { required: true, message: this.$t('Merchandise_ID_must_not_be_empty'), trigger: 'blur' }
        ],
        name: [{ required: true, message: this.$t('Merchandise_name_must_not_be_empty'), trigger: 'blur' }]
      },


      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        shopId: undefined,
        goodsSn: undefined,
        name: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      reviewForm:{
        id:undefined,
        goodsSn:undefined,
        goodsName:undefined,
        content:undefined,
        type:undefined
      },
      goodsDetail: '',
      detailDialogVisible: false,
      downloadLoading: false,
      reviewDialogVisiable:false,
      shops:[],
      priceDialogVisiable:false,
      priceForm: {
        id: undefined,
        goodsName: undefined,
        goodsSellPrice: undefined,
        priceType: '1',
        specifications: [],
        vipPriceForm:{},
        stepPriceForms:[{}],
        moneyOfPriceForms:[{}],
      },
      storeDialogVisiable: false,
      storeForm: {
        id: undefined,
        number: undefined
      },
      storeRules: {
        number: [
          { required: true, message: this.$t('Stock_amount_cannot_be_empty'), trigger: 'blur' },
          { type: 'number', message: this.$t('Stock_amount_must_be_a_number') }
        ]
      },

      productDialogVisiable: false,
      productForm: {
        taxTypes: [],
      },
      productRules:{
        number: [
          { required: true, message: this.$t('Stock_amount_cannot_be_empty'), trigger: 'blur' },
          { type: 'number', message: this.$t('Stock_amount_must_be_a_number'), trigger: 'blur' }
        ],
        sellPrice: [{ required: true, message: this.$t('Sale_price_cannot_be_empty'), trigger: 'change' },
          { required: true,validator: validateDouble, trigger: 'change' }],
        costPrice: [{ required: true, message: this.$t('Buy-in_cost_cannot_be_empty'), trigger: 'change' },
          { required: true,validator: validateDouble, trigger: 'change' }],
      },
      taxes:[{
        value:0,
        type:1,
        enable:false
      },{
        value:0,
        type:2,
        enable:false
      },{
        value:0,
        type:3,
        enable:false
      }],
    }
  },
  created() {
    if(this.$route.query && this.$route.query.shopId){
      this.listQuery.shopId = this.$route.query.shopId
    }
    this.getList()
    allForPerm().then(response=>{
      this.shops = response.data.data.list
    })
  },
  methods: {
    reviewFilter(review) {
      return this.reviewMap[review]
    },
    getList() {
      this.listLoading = true
      listGoods(this.listQuery).then(response => {
        console.log(response.data.data.list)
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
    handleCreate() {
      this.$router.push({ path: '/goods/create' })
    },
    handleUpdate(row) {
      this.$router.push({ path: '/goods/edit', query: { id: row.id }})
    },
    showDetail(detail) {
      this.goodsDetail = detail
      this.detailDialogVisible = true
    },
    handleDelete(row) {
      this.$confirm(this.$t('Confirm_Delete?'), this.$t('Hint'), {
        confirmButtonText: this.$t('Confirm'),
        cancelButtonText: this.$t('Cancel'),
        type: 'warning'
      }).then(() => {
        this.doDelete(row)
      });
    },
    doDelete(row){
      deleteGoods(row).then(response => {
        this.$notify.success({
          title: this.$t('Success!'),
          message: this.$t('Deleted')
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      }).catch(response => {
        this.$notify.error({
          title: this.$t('Failed'),
          message: response.data.errmsg
        })
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['商品ID', '商品编号', '名称', '专柜价格', '当前价格', '是否新品', '是否热品', '是否在售', '首页主图', '宣传图片列表', '商品介绍', '详细介绍', '商品图片', '商品单位', '关键字', '类目ID', '品牌商ID']
        const filterVal = ['id', 'goodsSn', 'name', 'counterPrice', 'retailPrice', 'isNew', 'isHot', 'isOnSale', 'listPicUrl', 'gallery', 'brief', 'detail', 'picUrl', 'goodsUnit', 'keywords', 'categoryId', 'brandId']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '商品信息')
        this.downloadLoading = false
      })
    },
    handleLog(row) {
      this.$router.push({ path: '/goods/logs', query: { id: row.id }})
    },
    handleReview(row) {
      this.reviewForm.goodsName = row.name
      this.reviewForm.id = row.id
      this.reviewForm.goodsSn = row.goodsSn
      this.reviewDialogVisiable = true
    },
    reviewHandlePass(){
      this.reviewForm.type = 2
      approveGoods(this.reviewForm).then(res=>{
        this.$notify.success({
          title: this.$t('Success!'),
          message: this.$t('Review_successful_')
        })
        this.getList()
        this.reviewDialogVisiable = false
      }).catch(response => {
        this.$notify.error({
          title: this.$t('Failed'),
          message: response.data.errmsg
        })
      })
    },
    reviewHandleReject(){
      this.reviewForm.type = 3
      rejectGoods(this.reviewForm).then(res=>{
        this.$notify.success({
          title: this.$t('Success!'),
          message: this.$t('Review_successful_')
        })
        this.getList()
        this.reviewDialogVisiable = false
      }).catch(response => {
        this.$notify.error({
          title: this.$t('Failed'),
          message: response.data.errmsg
        })
      })
    },
    isShowReview(reviewType){
      if(reviewType == 1){
        return false
      }else{
        return true;
      }
    },
    handlePush(row){
      const goodsDto = {
        isOnSale: row.isOnSale,
        id: row.id
      }
      pushGoods(goodsDto).then(res=>{
        this.$notify.success({
          title: this.$t('Success!'),
          message: '修改成功'
        })
        if(row.isOnSale){
          this.getList()
        }
      }).catch(response => {
        this.$notify.error({
          title: this.$t('Failed'),
          message: response.data.errmsg
        })
        row.isOnSale = false
      })
    },
    getShopName(shopId){
      if(this.shops){
        let shop =  this.shops.find(shop=>{
          if(shop.id == shopId){
            return true
          }
        })
        if(shop){
          return shop.name
        }else{
          return this.$t('总部所有')
        }
      }
    },
    handleNewProduce(row){
      const goodsDto = {
        isNew: row.isNew,
        id: row.id
      }
      newProductGoods(goodsDto).then(res=>{
        this.$notify.success({
          title: this.$t('Success!'),
          message: '修改成功'
        })
      }).catch(response => {
        this.$notify.error({
          title: this.$t('Failed'),
          message: response.data.errmsg
        })
      })
    },
    handleRecommend(row){
      const goodsDto = {
        isHot: row.isHot,
        id: row.id
      }
      recommendGoods(goodsDto).then(res=>{
        this.$notify.success({
          title: this.$t('Success!'),
          message: '修改成功'
        })
      }).catch(response => {
        this.$notify.error({
          title: this.$t('Failed'),
          message: response.data.errmsg
        })
      })
    },
    handlePermission(value){
      return !checkPermission(value)
    },
    handleUpdatePrice(){
      let data = {
        id: this.priceForm.id,
        price: this.priceForm.goodsSellPrice
      }
      updatePriceGoods(data).then(res=>{
        this.$notify.success({
          title: this.$t('Success!'),
          message: '修改成功'
        })
        this.getList()
      }).catch(response => {
        this.$notify.error({
          title: this.$t('Failed'),
          message: response.data.errmsg
        })
      })
    },
    handleUpdateSpecPrice(row){
      let data = {
        id: row.id,
        price: row.price
      }
      updateSpecPriceGoods(data).then(res=>{
        this.$notify.success({
          title: this.$t('Success!'),
          message: '修改成功'
        })
        this.getList()
      }).catch(response => {
        this.$notify.error({
          title: this.$t('Failed'),
          message: response.data.errmsg
        })
      })
    },
    getPriceDetail(row){
      let param = {
        goodsId: row.id,
        shopId: row.shopId
      }
      getAllPriceGoods(param).then(response=>{
        console.log(response.data.data)
        this.priceForm.id = response.data.data.id
        this.priceForm.goodsSn = response.data.data.goodsSn
        this.priceForm.goodsName = response.data.data.goodsName
        this.priceForm.goodsSellPrice = response.data.data.goodsSellPrice
        this.priceForm.priceType = response.data.data.priceType+""
        this.priceForm.specifications = response.data.data.specifications
        this.priceForm.vipGoodsPrice = response.data.data.vipGoodsPrice
        this.priceForm.moneyOfPriceForms = response.data.data.maxMinusPrices || [{}]
        this.priceForm.stepPriceForms = response.data.data.ladderPrices || [{}]
        this.priceDialogVisiable = true
      })
    },
    clearPriceForm(){
      this.priceDialogVisiable = false
      this.priceForm.vipGoodsPrice = {}
      this.priceForm.moneyOfPriceForms = [{}]
      this.priceForm.stepPriceForms = [{}]
/*      this.priceForm = {
        id: undefined,
        goodsName: undefined,
        goodsSellPrice: undefined,
        specifications: []
      }*/
    },
    handleUpdateStore(){
      updateStoreGoods(this.storeForm).then(res=>{
        this.$notify.success({
          title: this.$t('Success!'),
          message: '修改成功'
        })
        this.storeDialogVisiable = false
        this.getList()
      }).catch(response => {
        this.$notify.error({
          title: this.$t('Failed'),
          message: response.data.errmsg
        })
      })
    },
    getStoreDetail(row){
      this.storeForm.id = row.id
      this.storeForm.number = row.number
      this.storeForm.goodsName = row.name
      this.storeDialogVisiable = true
    },

    handleTabSwitch: function(tab){
      if(tab.name == 1){
        this.priceForm.priceType = '1'
        // this.priceForm.moneyOfPriceForms = [{}]
        // this.priceForm.stepPriceForms = [{}]
      }else if(tab.name == 2){
        this.priceForm.priceType = '2'
        // this.priceForm.vipPriceForm = {}
        // this.priceForm.moneyOfPriceForms = [{}]
      }else{
        this.priceForm.priceType = '3'
        // this.priceForm.vipPriceForm = {}
        // this.priceForm.stepPriceForms = [{}]
      }
    },
    handleStepAdd(row){
      this.priceForm.stepPriceForms.push({
        number:undefined,
        price:undefined
      })
    },
    handleStepDelete(scope){
      if(this.priceForm.stepPriceForms.length > 1){
        this.priceForm.stepPriceForms.splice(scope.$index,1)
      }else{
        this.priceForm.stepPriceForms[0] = {
          number:undefined,
          price:undefined
        }
      }
    },
    handleMoneyOfAdd(row){
      this.priceForm.moneyOfPriceForms.push({
        maxPrice:undefined,
        minusPrice:undefined
      })
    },
    handleMoneyOfDelete(scope){
      if(this.priceForm.moneyOfPriceForms.length > 1){
        this.priceForm.moneyOfPriceForms.splice(scope.$index,1)
      }else{
        this.priceForm.moneyOfPriceForms[0] = {
          maxPrice:undefined,
          minusPrice:undefined
        }
      }
    },
    handleUpdateDiscountPrice(){
      let goodsAllinone = {
        goods: {
          id: this.priceForm.id,
          priceType: this.priceForm.priceType
        }
      }
      if(this.priceForm.priceType == 1){
        goodsAllinone.vipPrice = this.priceForm.vipPriceForm
      }
      if(this.priceForm.priceType == 2){
        goodsAllinone.ladderPrices = this.priceForm.stepPriceForms
      }
      if(this.priceForm.priceType == 3){
        this.maxMinusPrices = this.priceForm.moneyOfPriceForms
      }
      updateGoodsDiscountPrice(goodsAllinone).then(res=>{
        this.$notify.success({
          title: this.$t('Success!'),
          message: '修改成功'
        })
        this.storeDialogVisiable = false
        this.getList()
      }).catch(response => {
        this.$notify.error({
          title: this.$t('Failed'),
          message: response.data.errmsg
        })
      })
    },
    handleUpdateProduct(){
      this.taxes.forEach(tax=>{
        if(tax.enable && this.productForm.taxTypes.indexOf(tax) < 0){
          this.productForm.taxTypes.push(tax.type)
        }
      })
      this.$refs['productForm'].validate((validproduct) => {
        if(validproduct){
          if(this.productForm.id){
            updateGoodsProduct(this.productForm).then(response=>{
              this.$notify.success({
                title: this.$t('Success!'),
                message: '修改成功'
              })
              this.productDialogVisiable = false
              this.getList()
            })
          }else{
            addGoodsProduct(this.productForm).then(response=>{
              this.$notify.success({
                title: this.$t('Success!'),
                message: '修改成功'
              })
              this.productDialogVisiable = false
              this.getList()
            })
          }
        }
      })

    },
    filterTaxType(type){
      if(type == 1){
        return this.$t('国税')
      }else if(type == 2){
        return this.$t('省税')
      }else if(type == 3){
        return this.$t('地方税')
      }
    },
    getProductDetail(goods){
      readGoodsProduct({goodsId: goods.id}).then(response=>{
        if(response.data.data.length > 0){
          this.productForm = response.data.data[0]
          this.productForm.goodsName = goods.name
          if(this.productForm.taxTypes){
            this.taxes.forEach(tax=>{
              if(this.productForm.taxTypes.indexOf(tax.type) >= 0){
                tax.enable = true
              }else{
                tax.enable = false
              }
            })
          }
        }
        this.productDialogVisiable = true
      })
    }
  }
}
</script>
