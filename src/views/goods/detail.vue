<template>
  <div class="app-container">


    <el-card class="box-card">
      <h4>基本信息</h4>
      <el-form ref="goods" :rules="rules" :model="goods" label-width="150px">
        <el-form-item label="所属分类">
          <el-cascader :options="categoryList" v-model="categoryIds" expand-trigger="hover" @change="handleCategoryChange"/>
        </el-form-item>
        <el-form-item label="所属门店">
          <el-select v-model="goods.shopId">
            <el-option v-for="item in shops" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品编号" prop="goodsSn">
          <el-input v-model="goods.goodsSn"/>
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="goods.name"/>
        </el-form-item>
        <el-form-item label="副标题" prop="subhead">
          <el-input v-model="goods.subhead"/>
        </el-form-item>
        <el-form-item label="商品简介">
          <el-input v-model="goods.brief"/>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadPicUrl"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif">
            <img v-if="goods.picUrl" :src="goods.picUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>

        <el-form-item label="宣传画廊">
          <el-upload
            :action="uploadPath"
            :headers="headers"
            :limit="5"
            :file-list="galleryFileList"
            :on-exceed="uploadOverrun"
            :on-success="handleGalleryUrl"
            :on-remove="handleRemove"
            multiple
            accept=".jpg,.jpeg,.png,.gif"
            list-type="picture-card">
            <i class="el-icon-plus"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品详细介绍">
          <editor :init="editorInit" v-model="goods.detail"/>
        </el-form-item>
        <el-form-item label="商品类型" prop="goodsType">
          <el-radio-group v-model="goods.goodsType">
            <el-radio :label="1">普通商品</el-radio>
            <el-radio :label="2">商品原料</el-radio>
            <el-radio :label="3">特殊商品</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <h4>库存规格</h4>
      <el-form ref="productForm" :rules="productRules" :model="productForm" label-width="150px">
        <el-form-item label="商品库存" prop="number">
          <el-input v-model.number="productForm.number"/>
        </el-form-item>
        <el-form-item label="商品售价" prop="sellPrice">
          <el-input v-model="productForm.sellPrice">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品进货价" prop="costPrice">
          <el-input v-model="productForm.costPrice">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品预警值" prop="earlyWarningValue">
          <el-input v-model.number="productForm.earlyWarningValue"/>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <h4>商品规格</h4>
      <el-button :plain="true" type="primary" @click="handleSpecificationShow">添加</el-button>

      <el-table :data="specifications">
        <el-table-column property="specification" label="规格名" />
        <el-table-column property="value" label="规格值" >
          <template slot-scope="scope">
            <el-tag type="primary">
              {{ scope.row.value }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column property="price" label="规格额外价格" >
        </el-table-column>
        <el-table-column property="picUrl" label="规格图片">
          <template slot-scope="scope">
            <img v-if="scope.row.picUrl" :src="scope.row.picUrl" width="40">
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="handleSpecificationDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="specVisiable" title="设置规格">
        <el-form ref="specForm" :rules="rules" :model="specForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
          <el-form-item label="规格名" prop="specification">
            <el-input v-model="specForm.specification"/>
          </el-form-item>
          <el-form-item label="规格值" prop="value">
            <el-input v-model="specForm.value"/>
          </el-form-item>
          <el-form-item label="规格额外价格" prop="price">
            <el-input v-model="specForm.price">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="规格图片" prop="picUrl">
            <el-upload
              :headers="headers"
              :action="uploadPath"
              :show-file-list="false"
              :on-success="uploadSpecPicUrl"
              class="avatar-uploader"
              accept=".jpg,.jpeg,.png,.gif">
              <img v-if="specForm.picUrl" :src="specForm.picUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"/>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="specVisiable = false">取消</el-button>
          <el-button type="primary" @click="handleSpecificationAdd">确定</el-button>
        </div>
      </el-dialog>
    </el-card>
    <el-card class="box-card">
      <h4>其他信息</h4>
      <el-form ref="goods" :rules="rules" :model="goods" label-width="150px">
        <el-form-item label="购买时赠送积分" prop="giveAwayPoints">
          <el-input v-model.number="goods.giveAwayPoints"/>
        </el-form-item>
        <el-form-item label="商品上架" prop="isOnSale">
          <el-switch v-model="goods.isOnSale" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>
        <el-form-item label="商品标签">
          <el-checkbox :value="true" v-model="goods.isNew">新品</el-checkbox>
          <el-checkbox :value="true" v-model="goods.isHot">推荐</el-checkbox>
        </el-form-item>
        <el-form-item label="商品服务" prop="isReturn">
          <el-radio-group v-model="goods.isReturn">
            <el-radio :label="true">支持退换</el-radio>
            <el-radio :label="false">不支持退换</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="配送服务" prop="distributionFee">
          <el-radio-group v-model="goods.isDistribution">
            <el-radio :label="false">免配送费</el-radio>
            <el-radio :label="true" >配送费</el-radio>
          </el-radio-group>
          <el-input v-show="goods.isDistribution" v-model="goods.distributionFee" placeholder="配送费"></el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <h4>商品参数</h4>
      <el-button :plain="true" type="primary" @click="handleAttributeShow">添加</el-button>
      <el-table :data="attributes">
        <el-table-column property="attribute" label="商品参数名称"/>
        <el-table-column property="value" label="商品参数值"/>
        <el-table-column align="center" label="操作" width="100" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="handleAttributeDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="attributeVisiable" title="设置商品参数">
        <el-form ref="attributeForm" :model="attributeForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
          <el-form-item label="商品参数名称" prop="attribute">
            <el-input v-model="attributeForm.attribute"/>
          </el-form-item>
          <el-form-item label="商品参数值" prop="value">
            <el-input v-model="attributeForm.value"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="attributeVisiable = false">取消</el-button>
          <el-button type="primary" @click="handleAttributeAdd">确定</el-button>
        </div>
      </el-dialog>
    </el-card>
    <el-card class="el-card">
      <h4>特殊信息</h4>
      <el-tabs :value="goods.priceType" @tab-click="handleTabSwitch" tab-position="left">
        <el-tab-pane label="会员价格" name="1">
          <el-form ref="vipPriceForm" :rules="rules" :model="vipPriceForm" label-width="150px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="白银会员" prop="silverVipPrice">
                  <el-input v-model="vipPriceForm.silverVipPrice">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="黄金会员" prop="goldVipPrice">
                  <el-input v-model="vipPriceForm.goldVipPrice">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="白金会员" prop="platinumVipPrice">
                  <el-input v-model="vipPriceForm.platinumVipPrice">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="钻石会员" prop="diamondVipPrice">
                  <el-input v-model="vipPriceForm.diamondVipPrice">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="阶梯价格" name="2">
          <el-table :data="stepPriceForms" border fit highlight-current-row>
            <el-table-column align="center" label="数量" prop="number">
              <template slot-scope="scope">
                <el-input v-model="stepPriceForms[scope.$index].number"/>
              </template>
            </el-table-column>
            <el-table-column align="center" label="价格" prop="price">
              <template slot-scope="scope">
                <el-input v-model="stepPriceForms[scope.$index].price">
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
          <el-table :data="moneyOfPriceForms" border fit highlight-current-row>
            <el-table-column align="center" label="满" prop="minusPrice">
              <template slot-scope="scope">
                <el-input v-model="moneyOfPriceForms[scope.$index].minusPrice">
                  <template slot="append">元</template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column align="center" label="立减" prop="maxPrice">
              <template slot-scope="scope">
                <el-input v-model="moneyOfPriceForms[scope.$index].maxPrice">
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

    <div class="op-container">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleEdit">更新商品</el-button>
    </div>
  </div>
</template>

<style>
  .el-card {
    margin-bottom: 10px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .input-new-keyword {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    width: 145px;
    height: 145px;
    display: block;
  }
</style>

<script>
  import { detailGoods, editGoods, listCatAndBrand } from '@/api/goods'
  import { createStorage, uploadPath } from '@/api/storage'
  import Editor from '@tinymce/tinymce-vue'
  import { MessageBox } from 'element-ui'
  import { getToken } from '@/utils/auth'
  import { allForPerm } from '@/api/shop'

  export default {
    name: 'GoodsDetail',
    components: { Editor },
    data() {
      const validateDouble = (rule, value, callback) => {
        console.log('value' + value)
        if (!/^[0-9,.]*$/.test(value)) {
          callback(new Error('销售价格必须为数字'))
        } else {
          callback()
        }
      }
      return {
        shops:[],
        uploadPath,
        vipPriceForm:{},
        stepPriceForms:[{
        }],
        moneyOfPriceForms:[{
        }],
        newKeywordVisible: false,
        newKeyword: '',
        keywords: [],
        galleryFileList: [],
        categoryList: [],
        brandList: [],
        categoryIds: [],
        goods: { priceType:"1",gallery: [] },
        specVisiable: false,
        specForm: { specification: '', value: '', picUrl: '' },
        specifications: [{ specification: '规格', price:0.0, value: '标准', picUrl: '' }],
        productVisiable: false,
        productForm: {
          id: 0,
          specifications: [],
          price: 0.0,
          number: 0,
          url: ''
        },
        products: [
          { id: 0, specifications: ['标准'], price: 0.0, number: 0, url: '' }
        ],
        attributeVisiable: false,
        attributeForm: { attribute: '', value: '' },
        attributes: [],
        rules: {
          goodsSn: [
            { required: true, message: '商品编号不能为空', trigger: 'blur' }
          ],
          name: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }]
        },
        productRules:{
          number: [
            { required: true, message: '库存数量不能为空', trigger: 'blur' },
            { type: 'number', message: '库存数量必须为数字', trigger: 'blur' }
          ],
          sellPrice: [{ required: true, message: '销售价格不能为空', trigger: 'change' },
            { validator: validateDouble, trigger: 'change' }],
          costPrice: [{ required: true, message: '进货价格不能为空', trigger: 'change' },
            { validator: validateDouble, trigger: 'change' }],
        },
        editorInit: {
          language: 'zh_CN',
          convert_urls: false,
          plugins: [
            'advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools importcss insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount'
          ],
          toolbar: [
            'searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample',
            'hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen'
          ],
          images_upload_handler: function(blobInfo, success, failure) {
            const formData = new FormData()
            formData.append('file', blobInfo.blob())
            createStorage(formData)
              .then(res => {
                success(res.data.data.url)
              })
              .catch(() => {
                failure('上传失败，请重新上传')
              })
          }
        }
      }
    },
    computed: {
      headers() {
        return {
          'X-Litemall-Admin-Token': getToken()
        }
      }
    },
    created() {
      this.init()
    },
    methods: {
      init: function() {
        if (this.$route.query.id == null) {
          return
        }

        const goodsId = this.$route.query.id
        detailGoods(goodsId).then(response => {
          console.log(response.data.data)
          this.goods = response.data.data.goods
          this.specifications = response.data.data.specifications
          this.products = response.data.data.products
          this.attributes = response.data.data.attributes
          this.categoryIds = response.data.data.categoryIds
          this.productForm = this.products[0]
          this.stepPriceForms = response.data.data.ladderPrices || [{}]
          this.moneyOfPriceForms = response.data.data.maxMinusPrices || [{}]
          this.vipPriceForm = response.data.data.vipGoodsPrice || {}

          this.galleryFileList = []
          for (var i = 0; i < this.goods.gallery.length; i++) {
            this.galleryFileList.push({
              url: this.goods.gallery[i]
            })
          }
          if(!this.goods.priceType){
            this.goods.priceType = "1"
          }else{
            this.goods.priceType = this.goods.priceType + ""
          }
          const keywords = response.data.data.goods.keywords
          if (keywords !== null) {
            this.keywords = keywords.split(',')
          }
        })

        listCatAndBrand().then(response => {
          this.categoryList = response.data.data.categoryList
          this.brandList = response.data.data.brandList
        })

        allForPerm().then(response=>{
          this.shops = response.data.data.list
        })
      },
      handleCategoryChange(value) {
        this.goods.categoryId = value[value.length - 1]
      },
      handleCancel: function() {
        this.$router.push({ path: '/goods/list' })
      },
      handleClose(tag) {
        this.keywords.splice(this.keywords.indexOf(tag), 1)
        this.goods.keywords = this.keywords.toString()
      },
      showInput() {
        this.newKeywordVisible = true
        this.$nextTick(_ => {
          this.$refs.newKeywordInput.$refs.input.focus()
        })
      },
      handleInputConfirm() {
        const newKeyword = this.newKeyword
        if (newKeyword) {
          this.keywords.push(newKeyword)
          this.goods.keywords = this.keywords.toString()
        }
        this.newKeywordVisible = false
        this.newKeyword = ''
      },
      uploadPicUrl: function(response) {
        this.goods.picUrl = response.data.url
      },
      uploadOverrun: function() {
        this.$message({
          type: 'error',
          message: '上传文件个数超出限制!最多上传5张图片!'
        })
      },
      handleGalleryUrl(response, file, fileList) {
        if (response.errno === 0) {
          this.goods.gallery.push(response.data.url)
        }
      },
      specChanged: function(label) {
        if (label === false) {
          this.specifications = [
            { specification: '规格', value: '标准', picUrl: '' }
          ]
          this.products = [
            { id: 0, specifications: ['标准'], price: 0.0, number: 0, url: '' }
          ]
        } else {
          this.specifications = []
          this.products = []
        }
      },
      uploadSpecPicUrl: function(response) {
        this.specForm.picUrl = response.data.url
      },
      handleSpecificationShow() {
        this.specForm = { specification: '', value: '', picUrl: '' }
        this.specVisiable = true
      },
      handleSpecificationAdd() {
        var index = this.specifications.length - 1
        for (var i = 0; i < this.specifications.length; i++) {
          const v = this.specifications[i]
          if (v.specification === this.specForm.specification) {
            index = i
          }
        }

        this.specifications.splice(index + 1, 0, this.specForm)
        this.specVisiable = false

        this.specToProduct()
      },
      handleSpecificationDelete(row) {
        const index = this.specifications.indexOf(row)
        this.specifications.splice(index, 1)
        this.specToProduct()
      },
      specToProduct() {
        if (this.specifications.length === 0) {
          return
        }
        // 根据specifications创建临时规格列表
        var specValues = []
        var spec = this.specifications[0].specification
        var values = []
        values.push(0)

        for (var i = 1; i < this.specifications.length; i++) {
          const aspec = this.specifications[i].specification

          if (aspec === spec) {
            values.push(i)
          } else {
            specValues.push(values)
            spec = aspec
            values = []
            values.push(i)
          }
        }
        specValues.push(values)

        // 根据临时规格列表生产货品规格
        // 算法基于 https://blog.csdn.net/tyhj_sf/article/details/53893125
        var productsIndex = 0
        var products = []
        var combination = []
        var n = specValues.length
        for (var s = 0; s < n; s++) {
          combination[s] = 0
        }
        var index = 0
        var isContinue = false
        do {
          var specifications = []
          for (var x = 0; x < n; x++) {
            var z = specValues[x][combination[x]]
            specifications.push(this.specifications[z].value)
          }
          products[productsIndex] = {
            id: productsIndex,
            specifications: specifications,
            price: 0.0,
            number: 0,
            url: ''
          }
          productsIndex++

          index++
          combination[n - 1] = index
          for (var j = n - 1; j >= 0; j--) {
            if (combination[j] >= specValues[j].length) {
              combination[j] = 0
              index = 0
              if (j - 1 >= 0) {
                combination[j - 1] = combination[j - 1] + 1
              }
            }
          }
          isContinue = false
          for (var p = 0; p < n; p++) {
            if (combination[p] !== 0) {
              isContinue = true
            }
          }
        } while (isContinue)

        this.products = products
      },
      handleProductShow(row) {
        this.productForm = Object.assign({}, row)
        this.productVisiable = true
      },
      uploadProductUrl: function(response) {
        this.productForm.url = response.data.url
      },
      handleProductEdit() {
        for (var i = 0; i < this.products.length; i++) {
          const v = this.products[i]
          if (v.id === this.productForm.id) {
            this.products.splice(i, 1, this.productForm)
            break
          }
        }
        this.productVisiable = false
      },
      handleAttributeShow() {
        this.attributeForm = {}
        this.attributeVisiable = true
      },
      handleAttributeAdd() {
        this.attributes.unshift(this.attributeForm)
        this.attributeVisiable = false
      },
      handleAttributeDelete(row) {
        const index = this.attributes.indexOf(row)
        this.attributes.splice(index, 1)
      },
      handleStepAdd(row){
        this.stepPriceForms.push({
          number:undefined,
          price:undefined
        })
      },
      handleStepDelete(scope){
        if(this.stepPriceForms.length > 1){
          this.stepPriceForms.splice(scope.$index,1)
        }else{
          this.stepPriceForms[0] = {
            number:undefined,
            price:undefined
          }
        }
      },
      handleMoneyOfAdd(row){
        this.moneyOfPriceForms.push({
          maxPrice:undefined,
          minusPrice:undefined
        })
      },
      handleMoneyOfDelete(scope){
        if(this.moneyOfPriceForms.length > 1){
          this.moneyOfPriceForms.splice(scope.$index,1)
        }else{
          this.moneyOfPriceForms[0] = {
            maxPrice:undefined,
            minusPrice:undefined
          }
        }
      },
      handleRemove: function(file, fileList) {
        for (var i = 0; i < this.goods.gallery.length; i++) {
          // 这里存在两种情况
          // 1. 如果所删除图片是刚刚上传的图片，那么图片地址是file.response.data.url
          //    此时的file.url虽然存在，但是是本机地址，而不是远程地址。
          // 2. 如果所删除图片是后台返回的已有图片，那么图片地址是file.url
          var url
          if (file.response === undefined) {
            url = file.url
          } else {
            url = file.response.data.url
          }

          if (this.goods.gallery[i] === url) {
            this.goods.gallery.splice(i, 1)
          }
        }
      },
      handleTabSwitch: function(tab){
        if(tab.name == 1){
          this.moneyOfPriceForms = [{}]
          this.stepPriceForms = [{}]
        }else if(tab.name == 2){
          this.vipPriceForm = {}
          this.moneyOfPriceForms = [{}]
        }else{
          this.vipPriceForm = {}
          this.stepPriceForms = [{}]
        }
      },
      handleEdit: function() {
        const finalGoods = {
          goods: this.goods,
          specifications: this.specifications,
          products: this.products,
          attributes: this.attributes,
        }
        if(this.goods.priceType == "1"){
          finalGoods.vipPrice = this.vipPriceForm
        }else if(this.goods.priceType == "2"){
          finalGoods.ladderPrices = this.stepPriceForms
        }else if(this.goods.priceType == "3"){
          finalGoods.maxMinusPrices = this.moneyOfPriceForms
        }
        if(this.goods.shopId){
          this.shops.forEach(shop=>{
            if(this.goods.shopId == shop.id){
              this.goods.shopName = shop.name
            }
          })
        }
        editGoods(finalGoods)
          .then(response => {
            this.$notify.success({
              title: '成功',
              message: '修改成功'
            })
            this.$router.push({ path: '/goods/list' })
          })
          .catch(response => {
            MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
              confirmButtonText: '确定',
              type: 'error'
            })
          })
      },
    }
  }
</script>
