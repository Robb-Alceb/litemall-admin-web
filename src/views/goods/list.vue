<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-select v-model="listQuery.shopId" clearable>
          <el-option v-for="item in shops" :value="item.id" :label="item.name"></el-option>
      </el-select>
      <el-input v-model="listQuery.goodsSn" clearable class="filter-item" style="width: 200px;" placeholder="请输入商品编号"/>
      <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入商品名称"/>
      <el-button v-permission="['GET /admin/goods/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button v-permission="['POST /admin/goods/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column align="center" label="门店" prop="shopName"/>

      <el-table-column align="center" label="商品编号" prop="goodsSn"/>

      <el-table-column align="center" min-width="100" label="名称" prop="name"/>

      <el-table-column align="center" property="iconUrl" label="图片">
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

      <el-table-column align="center" label="价格" prop="retailPrice"/>

<!--      <el-table-column align="center" label="货号" prop="goodsNum"/>-->

      <el-table-column align="center" label="标签">
        <template slot-scope="scope">
          <el-row>
            <span>上架:</span>
            <el-switch v-model="scope.row.isOnSale" :disabled="handlePermission(['PUT /admin/goods/push'])" @change="handlePush(scope.row)" :active-value="true" :nactive-value="false" active-color="#13ce66" inactive-color="#ff4949"/>
          </el-row>
          <el-row>
            <span>新品:</span>
            <el-switch v-model="scope.row.isNew" :disabled="handlePermission(['PUT /admin/goods/newProduce'])" @change="handleNewProduce(scope.row)"  :active-value="true" :nactive-value="false" active-color="#13ce66" inactive-color="#ff4949"/>
          </el-row>
          <el-row>
            <span>推荐:</span>
            <el-switch v-model="scope.row.isHot" :disabled="handlePermission(['PUT /admin/goods/recommend'])" @change="handleRecommend(scope.row)"  :active-value="true" :nactive-value="false" active-color="#13ce66" inactive-color="#ff4949"/>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column align="center" label="上架时间" prop="updateTime">
        <template slot-scope="scope">
          <span v-show="scope.row.isOnSale">{{scope.row.updateTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="库存" prop="number"/>

      <el-table-column align="center" label="销量" prop="sales"/>

      <el-table-column align="center" label="审核状态" prop="reviewType">
        <template slot-scope="scope">
          {{ scope.row.reviewType | reviewFilter }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-row>
            <el-button v-permission="['POST /admin/goods/approve', 'POST /admin/goods/reject']" type="primary" size="mini" :disabled="isShowReview(scope.row.reviewType)" @click="handleReview(scope.row)">审核</el-button>
            <el-button v-permission="['GET /admin/goods/queryGoodsLogList']" type="primary" size="mini" @click="handleLog(scope.row)">日志</el-button>
          </el-row>
          <el-row style="margin-top: 5px;">
            <el-button v-permission="['POST /admin/goods/update']" type="primary" size="mini" @click="handleUpdate(scope.row)">详情</el-button>
            <el-button v-permission="['POST /admin/goods/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          </el-row>
          <el-row style="margin-top: 5px;">
            <el-button v-permission="['GET /admin/goods/allPrice']" type="info" size="mini" @click="getPriceDetail(scope.row)">价格</el-button>
            <el-button v-permission="['GET /admin/goods/allPrice']" type="info" size="mini" @click="getStoreDetail(scope.row)">库存</el-button>
          </el-row>

        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibility-height="100" />
    </el-tooltip>

    <el-dialog :visible.sync="reviewDialogVisiable" title="商品审核">
      <el-form ref="reviewForm" :model="reviewForm" status-icon label-position="left" label-width="100px">
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="reviewForm.goodsName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="备注信息" prop="content">
          <el-input type="textarea" v-model="reviewForm.content"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reviewDialogVisiable = false">取消</el-button>
        <el-button v-permission="['POST /admin/goods/approve']" @click="reviewHandleReject()" type="danger">不通过</el-button>
        <el-button v-permission="['POST /admin/goods/reject']" @click="reviewHandlePass()" type="primary">通过</el-button>
      </div>
    </el-dialog>


    <el-dialog :visible.sync="priceDialogVisiable" title="商品价格">
      <el-form ref="priceForm" :model="priceForm" status-icon label-position="left" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="商品名称" prop="goodsName">
              <el-col>{{priceForm.goodsName}}</el-col>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品价格" prop="goodsSellPrice">
              <el-input v-model="priceForm.goodsSellPrice"/>
            </el-form-item>
          </el-col>
          <el-col :span="8" align="center">
              <el-button v-permission="['PUT /admin/goods/updatePrice']" type="primary" size="mini" @click="handleUpdatePrice">更新</el-button>
          </el-col>
        </el-row>
        <el-row  v-for="item in priceForm.specifications">
          <el-col :span="8">
            <el-form-item label="商品规格" prop="value">
              <el-col>{{item.value}}</el-col>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="规格额外价格" prop="price">
              <el-input v-model="item.price"/>
            </el-form-item>
          </el-col>
          <el-col :span="8" align="center">
            <el-button v-permission="['PUT /admin/goods/updateSpecPrice']" type="primary" size="mini" @click="handleUpdateSpecPrice(item)">更新</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-card class="el-card">
        <div slot="header" class="clearfix">
          <span>优惠价格</span>
          <el-button v-permission="['PUT /admin/goods/updateDiscountPrice']" style="float: right;" type="primary" @click="handleUpdateDiscountPrice">更新优惠价格</el-button>
        </div>
        <el-tabs :value="priceForm.priceType" @tab-click="handleTabSwitch" tab-position="top">
          <el-tab-pane label="会员价格" name="1">
            <el-form ref="vipPriceForm" :rules="rules" :model="priceForm.vipPriceForm" label-width="150px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="白银会员" prop="silverVipPrice">
                    <el-input v-model="priceForm.vipPriceForm.silverVipPrice">
                      <template slot="append">元</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="黄金会员" prop="goldVipPrice">
                    <el-input v-model="priceForm.vipPriceForm.goldVipPrice">
                      <template slot="append">元</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="白金会员" prop="platinumVipPrice">
                    <el-input v-model="priceForm.vipPriceForm.platinumVipPrice">
                      <template slot="append">元</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="钻石会员" prop="diamondVipPrice">
                    <el-input v-model="priceForm.vipPriceForm.diamondVipPrice">
                      <template slot="append">元</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="阶梯价格" name="2">
            <el-table :data="priceForm.stepPriceForms" border fit highlight-current-row>
              <el-table-column align="center" label="数量" prop="number">
                <template slot-scope="scope">
                  <el-input v-model="priceForm.stepPriceForms[scope.$index].number"/>
                </template>
              </el-table-column>
              <el-table-column align="center" label="价格" prop="price">
                <template slot-scope="scope">
                  <el-input v-model="priceForm.stepPriceForms[scope.$index].price">
                    <template slot="append">元</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="handleStepAdd(scope.row)">增加</el-button>
                  <el-button type="danger" size="mini" @click="handleStepDelete(scope)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="满减价格"  name="3" >
            <el-table :data="priceForm.moneyOfPriceForms" border fit highlight-current-row>
              <el-table-column align="center" label="满" prop="minusPrice">
                <template slot-scope="scope">
                  <el-input v-model="priceForm.moneyOfPriceForms[scope.$index].minusPrice">
                    <template slot="append">元</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="立减" prop="maxPrice">
                <template slot-scope="scope">
                  <el-input v-model="priceForm.moneyOfPriceForms[scope.$index].maxPrice">
                    <template slot="append">元</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="handleMoneyOfAdd(scope.row)">增加</el-button>
                  <el-button type="danger" size="mini" @click="handleMoneyOfDelete(scope)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearPriceForm">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="storeDialogVisiable" title="商品库存">
      <el-form ref="priceForm" :model="storeForm" :rules="storeRules" status-icon label-position="left" label-width="100px">
        <el-form-item label="商品名称" prop="goodsName">
          <el-col>{{storeForm.goodsName}}</el-col>
        </el-form-item>

        <el-form-item label="商品库存" prop="number">
          <el-input v-model.number="storeForm.number"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="storeDialogVisiable = false">取消</el-button>
        <el-button @click="handleUpdateStore" type="primary">确定</el-button>
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
import { listGoods, deleteGoods, approveGoods, rejectGoods, pushGoods, newProductGoods, recommendGoods, updatePriceGoods, updateSpecPriceGoods, getAllPriceGoods, updateStoreGoods, updateGoodsDiscountPrice } from '@/api/goods'
import BackToTop from '@/components/BackToTop'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { allForPerm } from '@/api/shop'
import checkPermission from '@/utils/permission'
import ElColorAlphaSlider from "element-ui/packages/color-picker/src/components/alpha-slider";

const reviewMap = {
  1: '待审核',
  2: '已审核',
  3: '已拒绝'
}
export default {
  name: 'GoodsList',
  components: {ElColorAlphaSlider, BackToTop, Pagination },
  filters: {
    reviewFilter(review) {
      return reviewMap[review]
    }
  },
  data() {
    return {
      rules: {
        goodsSn: [
          { required: true, message: '商品编号不能为空', trigger: 'blur' }
        ],
        name: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }]
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
          { required: true, message: '库存数量不能为空', trigger: 'blur' },
          { type: 'number', message: '库存数量必须为数字' }
        ]
    }
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
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doDelete(row)
      });
    },
    doDelete(row){
      deleteGoods(row).then(response => {
        this.$notify.success({
          title: '成功',
          message: '删除成功'
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      }).catch(response => {
        this.$notify.error({
          title: '失败',
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
          title: '成功',
          message: '审核成功'
        })
        this.getList()
        this.reviewDialogVisiable = false
      }).catch(response => {
        this.$notify.error({
          title: '失败',
          message: response.data.errmsg
        })
      })
    },
    reviewHandleReject(){
      this.reviewForm.type = 3
      rejectGoods(this.reviewForm).then(res=>{
        this.$notify.success({
          title: '成功',
          message: '审核成功'
        })
        this.getList()
        this.reviewDialogVisiable = false
      }).catch(response => {
        this.$notify.error({
          title: '失败',
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
          title: '成功',
          message: '修改成功'
        })
        if(row.isOnSale){
          this.getList()
        }
      }).catch(response => {
        this.$notify.error({
          title: '失败',
          message: response.data.errmsg
        })
        row.isOnSale = false
      })
    },
    handleNewProduce(row){
      const goodsDto = {
        isNew: row.isNew,
        id: row.id
      }
      newProductGoods(goodsDto).then(res=>{
        this.$notify.success({
          title: '成功',
          message: '修改成功'
        })
      }).catch(response => {
        this.$notify.error({
          title: '失败',
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
          title: '成功',
          message: '修改成功'
        })
      }).catch(response => {
        this.$notify.error({
          title: '失败',
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
          title: '成功',
          message: '修改成功'
        })
        this.getList()
      }).catch(response => {
        this.$notify.error({
          title: '失败',
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
          title: '成功',
          message: '修改成功'
        })
        this.getList()
      }).catch(response => {
        this.$notify.error({
          title: '失败',
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
        this.priceForm.vipGoodsPrice = response.data.data.vipGoodsPrice || {}
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
          title: '成功',
          message: '修改成功'
        })
        this.storeDialogVisiable = false
        this.getList()
      }).catch(response => {
        this.$notify.error({
          title: '失败',
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
          title: '成功',
          message: '修改成功'
        })
        this.storeDialogVisiable = false
        this.getList()
      }).catch(response => {
        this.$notify.error({
          title: '失败',
          message: response.data.errmsg
        })
      })
    }
  }
}
</script>
