<template>
  <div class="app-container">


    <el-card class="box-card">
      <h4>{{$t('Basic_Information')}}</h4>
      <el-form ref="goodsForm" :rules="rules" :model="goods" label-width="150px">
        <el-form-item :label="$t('Category')" prop="categoryId">
          <el-cascader :options="categoryList" v-model="categoryIds" expand-trigger="hover" @change="handleCategoryChange"/>
        </el-form-item>
        <!--<el-form-item :label="$t('Store_belong')" prop="shopIds">
          <el-select v-model="shopIds" multiple>
            <el-option v-for="item in shops" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item :label="$t('Store_belong')" prop="shopId">
          <el-select v-model="goods.shopId" filterable>
            <el-option v-for="item in shops" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('Merchandise_code')" prop="goodsSn">
          <el-input v-model="goods.goodsSn"/>
        </el-form-item>
        <el-form-item :label="$t('Merchandise_name')" prop="name">
          <el-input v-model="goods.name"/>
        </el-form-item>
        <el-form-item :label="$t('Subtitle')" prop="subhead">
          <el-input v-model="goods.subhead"/>
        </el-form-item>
        <el-form-item :label="$t('About_the_merchandise')">
          <el-input v-model="goods.brief"/>
        </el-form-item>
        <el-form-item :label="$t('Goods_picture')">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadPicUrl"
            :on-remove="handleGoodsPicRemove"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif">
            <img v-if="goods.picUrl" :src="goods.picUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
            <label v-if="goods.picUrl" class="el-upload-list__item-status-label avatar-uploader__status_label" @click.stop="handleGoodsPicRemove()"><i class="el-icon-delete"></i></label>
          </el-upload>
        </el-form-item>

        <el-form-item :label="$t('Gallery')">
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
        <el-form-item :label="$t('Goods_details')">
          <editor :init="editorInit" v-model="goods.detail"/>
        </el-form-item>
        <el-form-item :label="$t('操作说明')">
          <el-input type="textarea" v-model="goods.operationDesc"></el-input>
        </el-form-item>
        <el-form-item :label="$t('Goods_category')" prop="goodsType">
          <el-radio-group v-model="goods.goodsType">
            <el-radio :label="1">{{$t('Normal_merchandise')}}</el-radio>
            <el-radio :label="2">{{$t('Merchandise_material')}}</el-radio>
            <el-radio :label="3">{{$t('Speical_merchandise')}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <h4>{{$t('Storage_specifications')}}</h4>
      <el-form ref="product" :rules="productRules" :model="productForm" label-width="150px">
        <el-form-item :label="$t('Merchandise_stock')" prop="number">
          <el-input v-model.number="productForm.number"/>
        </el-form-item>
        <el-form-item :label="$t('Merchandise_sale_price')" prop="sellPrice">
          <el-input v-model="productForm.sellPrice" @blur="changeVipPrice">
            <template slot="append">{{$t('Dollars')}}</template>
          </el-input>
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

<!--        <el-form-item :label="$t('Merchandise_Tax')" prop="tax">
          <el-input v-model="productForm.tax">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>-->
        <el-form-item :label="$t('Cost_of_merchandise')" prop="costPrice">
          <el-input v-model="productForm.costPrice">
            <template slot="append">{{$t('Dollars')}}</template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('Merchandise_warning')" prop="earlyWarningValue">
          <el-input v-model.number="productForm.earlyWarningValue"/>
        </el-form-item>
        <el-form-item :label="$t('计量单位')" prop="unit">
          <el-input v-model="productForm.unit"/>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <h4>{{$t('Goods_specifications')}}</h4>
      <el-button :plain="true" type="primary" @click="handleSpecificationShow">{{$t('Add')}}</el-button>

      <el-table :data="specifications">
        <el-table-column property="specification" :label="$t('Specification_name')" />
        <el-table-column property="value" :label="$t('Specification_value')" >
          <template slot-scope="scope">
            <el-tag type="primary">
              {{ scope.row.value }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column property="price" :label="$t('Cost_outside_of_specification')" >
        </el-table-column>
        <el-table-column property="picUrl" :label="$t('Specification_images')">
          <template slot-scope="scope">
            <img v-if="scope.row.picUrl" :src="scope.row.picUrl" width="40">
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('Operate')" width="250" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="handleSpecificationDelete(scope.row)">{{$t('Delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="specVisiable" :title="$t('Specification_settings')">
        <el-form ref="specForm" :rules="rules" :model="specForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
          <el-form-item :label="$t('Specification_name')" prop="specification">
            <el-input v-model="specForm.specification"/>
          </el-form-item>
          <el-form-item :label="$t('Specification_value')" prop="value">
            <el-input v-model="specForm.value">
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('Cost_outside_of_specification')" prop="price">
            <el-input v-model="specForm.price">
              <template slot="append">{{$t('Dollars')}}</template>
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('Specification_images')" prop="picUrl">
            <el-upload
              :headers="headers"
              :action="uploadPath"
              :on-success="uploadSpecPicUrl"
              show-file-list="false"
              class="avatar-uploader"
              accept=".jpg,.jpeg,.png,.gif">
              <img v-if="specForm.picUrl" :src="specForm.picUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"/>
              <label v-if="specForm.picUrl" class="el-upload-list__item-status-label avatar-uploader__status_label" @click.stop="handleSpecRemove()"><i class="el-icon-delete"></i></label>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="specVisiable = false">{{$t('Cancel')}}</el-button>
          <el-button type="primary" @click="handleSpecificationAdd">{{$t('Confirm')}}</el-button>
        </div>
      </el-dialog>
    </el-card>

    <!-- 辅料 -->
    <el-card class="box-card">
      <h4>{{$t('商品辅料')}}</h4>
      <el-button :plain="true" type="primary" @click="handleAccessoryShow">{{$t('Add')}}</el-button>

      <el-table :data="accessories">
        <el-table-column property="groupName" :label="$t('辅料组名')" />
        <el-table-column property="name" :label="$t('辅料名')" />
        <el-table-column property="price" :label="$t('价格')" >
        </el-table-column>
        <el-table-column align="center" :label="$t('Operate')" width="250" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="handleAccessoryDelete(scope.row)">{{$t('Delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="accessoryVisiable" :title="$t('辅料设置')">
        <el-form ref="accessoryForm" :rules="accessoryRules" :model="accessoryForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
          <el-form-item :label="$t('辅料组名')" prop="groupName">
            <el-input v-model="accessoryForm.groupName"/>
          </el-form-item>
          <el-form-item :label="$t('辅料')" prop="merchandiseId">
            <el-select v-model="accessoryForm.merchandiseId" filterable @change="handleAccessoryMerChange">
              <el-option v-for="item in merchandise" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
<!--          <el-form-item :label="$t('辅料名')" prop="name">
            <el-input v-model="accessoryForm.name"/>
          </el-form-item>-->
          <el-form-item :label="$t('价格')" prop="price">
            <el-input v-model="accessoryForm.price" readonly="true">
              <template slot="append">{{$t('Dollars')}}</template>
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="accessoryVisiable = false">{{$t('Cancel')}}</el-button>
          <el-button type="primary" @click="handleAccessoryAdd">{{$t('Confirm')}}</el-button>
        </div>
      </el-dialog>
    </el-card>

    <el-card class="box-card">
      <h4>{{$t('Other_information')}}</h4>
      <el-form ref="others" :rules="rules" :model="goods" label-width="150px">
        <el-form-item :label="$t('Points_earned_after_purchase')" prop="giveAwayPoints">
          <el-input v-model.number="goods.giveAwayPoints"/>
        </el-form-item>
<!--        <el-form-item :label="$t('Merchandise_launch')" prop="isOnSale">
          <el-switch v-model="goods.isOnSale" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>-->
        <el-form-item :label="$t('Merchandise_label')">
          <el-checkbox :value="true" v-model="goods.isNew">{{$t('New_product')}}</el-checkbox>
          <el-checkbox :value="true" v-model="goods.isHot">{{$t('Recommendation')}}</el-checkbox>
        </el-form-item>
        <el-form-item :label="$t('Services')" prop="isReturn">
          <el-radio-group v-model="goods.isReturn">
            <el-radio :label="true">{{$t('Refundable')}}</el-radio>
            <el-radio :label="false">{{$t('Non-refundable')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('Delivery_Services')" prop="distributionFee">
          <el-radio-group v-model="goods.isDistribution">
            <el-radio :label="false">{{$t('Delivery_Free')}}</el-radio>
            <el-radio :label="true" >{{$t('Delivery_Fee')}}</el-radio>
          </el-radio-group>
          <el-input v-show="goods.isDistribution" v-model="goods.distributionFee"></el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <h4>{{$t('Merchandise_Parameters')}}</h4>
      <el-button :plain="true" type="primary" @click="handleAttributeShow">{{$t('Add')}}</el-button>
      <el-table :data="attributes">
        <el-table-column property="attribute" :label="$t('Merchandise_parameter_names')"/>
        <el-table-column property="value" :label="$t('Merchandise_parameter_values')"/>
        <el-table-column align="center" :label="$t('Operate')" width="100" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="handleAttributeDelete(scope.row)">{{$t('Delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="attributeVisiable" :title="$t('Set_merchandise_parameter_values')">
        <el-form ref="attributeForm" :model="attributeForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
          <el-form-item :label="$t('Merchandise_parameter_names')" prop="attribute">
            <el-input v-model="attributeForm.attribute"/>
          </el-form-item>
          <el-form-item :label="$t('Merchandise_parameter_values')" prop="value">
            <el-input v-model="attributeForm.value"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="attributeVisiable = false">{{$t('Cancel')}}</el-button>
          <el-button type="primary" @click="handleAttributeAdd">{{$t('Confirm')}}</el-button>
        </div>
      </el-dialog>
    </el-card>
    <el-card class="el-card">
      <h4>{{$t('Special_messages')}}</h4>
      <el-tabs :value="goods.priceType" @tab-click="handleTabSwitch" tab-position="left">
        <el-tab-pane :label="$t('Member_costs')" name="1">
          <el-form ref="vipPriceForm" :rules="rules" :model="vipPriceForm" label-width="150px">
            <el-row>
              <el-col :span="12">
                <el-form-item :label="$t('Silver_Membership')" prop="silverVipPrice">
                  <el-input v-model="vipPriceForm.silverVipPrice">
                    <template slot="append">{{$t('Dollars')}}</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('Silver_Membership')" prop="goldVipPrice">
                  <el-input v-model="vipPriceForm.goldVipPrice">
                    <template slot="append">{{$t('Dollars')}}</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item :label="$t('Platinum_Membership')" prop="platinumVipPrice">
                  <el-input v-model="vipPriceForm.platinumVipPrice">
                    <template slot="append">{{$t('Dollars')}}</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('Diamond_Membership')" prop="diamondVipPrice">
                  <el-input v-model="vipPriceForm.diamondVipPrice">
                    <template slot="append">{{$t('Dollars')}}</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane :label="$t('Staircase_pricing')" name="2">
          <el-table :data="stepPriceForms" border fit highlight-current-row>
            <el-table-column align="center" :label="$t('Number')" prop="number">
              <template slot-scope="scope">
                <el-input v-model="stepPriceForms[scope.$index].number"/>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="$t('Price')" prop="price">
              <template slot-scope="scope">
                <el-input v-model="stepPriceForms[scope.$index].price">
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
          <el-table :data="moneyOfPriceForms" border fit highlight-current-row>
            <el-table-column align="center" :label="$t('Full')" prop="maxPrice">
              <template slot-scope="scope">
                <el-input v-model="moneyOfPriceForms[scope.$index].maxPrice">
                  <template slot="append">{{$t('Dollars')}}</template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="$t('Immediate_Discount')" prop="minusPrice">
              <template slot-scope="scope">
                <el-input v-model="moneyOfPriceForms[scope.$index].minusPrice">
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

    <div class="op-container" style="margin-top: 30px;">
      <el-button @click="handleCancel">{{$t('Cancel')}}</el-button>
      <el-button type="primary" @click="handleCreate">{{$t('Add_new_product')}}</el-button>
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
  .avatar-uploader__status_label{
    display: block;
    color: red;
  }
</style>

<script>
  import { publishGoods, listCatAndBrand, batchCreate } from '@/api/goods'
  import { createStorage, uploadPath } from '@/api/storage'
  import Editor from '@tinymce/tinymce-vue'
  import { MessageBox } from 'element-ui'
  import { getToken } from '@/utils/auth'
  import { allForPerm } from '@/api/shop'
  import { allMerchandise } from '@/api/merchandise'

  export default {
    name: 'GoodsCreate',
    components: { Editor },
    data() {
      const validateDouble = (rule, value, callback) => {
        console.log('value' + value)
        if (!value || !/^[0-9,.]*$/.test(value)) {
          callback(new Error(this.$t('Sale_price_must_be_a_number')))
        } else {
          callback()
        }
      }
      const validateCategory = (rule, value, callback) => {
        if (this.categoryIds.length == 0) {
          callback(new Error(this.$t('Category_cannot_be_empty')))
        } else {
          callback()
        }
      }
      return {
        shops:[],
        uploadPath,
        limited: false,
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
        goods: { picUrl: '',priceType:"1",gallery: [],goodsType:1, isReturn:false, isDistribution: false },
        specVisiable: false,
        specForm: { specification: '', value: '', picUrl: '' },
        specifications: [{ specification: '规格', price:0.0, value: '标准', picUrl: '' }],
        productVisiable: false,
        productForm: {
          id: 0,
          specifications: [],
          price: 0.0,
          number: 0,
          url: '',
          tax:0.0,
          taxTypes:[]
        },
        attributeVisiable: false,
        attributeForm: { attribute: '', value: '' },
        attributes: [],
        rules: {
          goodsSn: [
            { required: true, message: this.$t('Merchandise_ID_must_not_be_empty'), trigger: 'blur' }
          ],
          name: [{ required: true, message: this.$t('Merchandise_name_must_not_be_empty'), trigger: 'blur' }],
          shopId: [{ required: true, message: this.$t('Store_cannot_be_empty'), trigger: 'change' }],
          categoryId: [{ required: true, message: this.$t('Category_cannot_be_empty'), trigger: 'change',validator: validateCategory }]
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
                failure(this.$t('Upload_failed_please_reupload'))
              })
          }
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
        shopIds:[],

        accessoryVisiable: false,
        accessoryForm: {},
        accessories: [],
        accessoryRules: {
          groupName: [{ required: true, message: this.$t('辅料组名不能为空'), trigger: 'blur' }],
          merchandiseId: [{ required: true, message: this.$t('辅料名不能为空'), trigger: 'change' }],
          price: [{ required: true, message: this.$t('辅料价格不能为空'), trigger: 'blur' }],
        },
        merchandise: []

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
        listCatAndBrand().then(response => {
          this.categoryList = response.data.data.categoryList
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
      uploadPicUrl: function(response) {
        this.goods.picUrl = response.data.url
      },
      uploadOverrun: function() {
        this.$message({
          type: 'error',
          message: this.$t('File_upload_exceeded_maximum_value!_Max._5_photos')
        })
      },
      handleGalleryUrl(response, file, fileList) {
        if (response.errno === 0) {
          this.goods.gallery.push(response.data.url)
        }
      },
      uploadSpecPicUrl: function(response) {
        this.specForm.picUrl = response.data.url
      },
      handleSpecificationShow() {
        this.specForm = { specification: '', value: '', picUrl: '' }
        this.specVisiable = true
      },
      handleAccessoryShow(){
/*        if(!this.goods.shopId){
          this.$notify.error({
            title: this.$t('失败'),
            message: this.$t('请先选择门店')
          })
        }else{*/
          allMerchandise(this.goods.shopId).then(response=>{
            this.merchandise = response.data.data
            this.accessoryForm = { groupName: '', name: '', price: 0.00 }
            this.accessoryVisiable = true
          })
        // }
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

      },
      handleAccessoryAdd(){
        this.$refs['accessoryForm'].validate((valid) => {
          if (valid) {
            var index = this.accessories.length - 1
            for (var i = 0; i < this.accessories.length; i++) {
              const v = this.accessories[i]
              if (v.accessories === this.accessoryForm.name) {
                index = i
              }
            }

            this.accessories.splice(index + 1, 0, this.accessoryForm)
            this.accessoryVisiable = false
          }
        })

      },
      handleSpecificationDelete(row) {
        const index = this.specifications.indexOf(row)
        this.specifications.splice(index, 1)
      },
      handleAccessoryDelete(row){
        const index = this.accessories.indexOf(row)
        this.accessories.splice(index, 1)
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
      handleCreate: function() {
        const finalGoods = {
          goods: this.goods,
          specifications: this.specifications,
          products: [this.productForm],
          attributes: this.attributes,
          // goodsTaxes: this.taxes,
          shopIds: this.shopIds,
          accessories: this.accessories
        }
        this.taxes.forEach(tax=>{
          if(tax.enable && this.productForm.taxTypes.indexOf(tax) < 0){
            this.productForm.taxTypes.push(tax.type)
          }
        })
        if(this.goods.priceType == "1"){
          finalGoods.vipPrice = this.vipPriceForm
        }else if(this.goods.priceType == "2"){
          finalGoods.ladderPrices = this.stepPriceForms
        }else if(this.goods.priceType == "3"){
          finalGoods.maxMinusPrices = this.moneyOfPriceForms
        }
        if(this.goods.shopId){
          this.shops.forEach((shop)=>{
            if(this.goods.shopId == shop.id){
              this.goods.shopName = shop.name
            }
          })
        }
        console.log(finalGoods)
        this.$refs['goodsForm'].validate((valid) => {
          this.$refs['product'].validate((validproduct)=>{
            if (valid && validproduct) {
            publishGoods(finalGoods)
            // batchCreate(finalGoods)
              .then(response => {
                this.$notify.success({
                  title: this.$t('Success!'),
                  message: '添加成功'
                })
                this.$router.push({ path: '/goods/list' })
              })
              .catch(response => {
                MessageBox.alert(this.$t('Error') + response.data.errmsg, this.$t('Warning'), {
                  confirmButtonText: this.$t('Confirm'),
                  type: 'error'
                })
              })
            }
          })

        })

      },
      changeVipPrice(){
        this.vipPriceForm = {
          silverVipPrice: !this.productForm.sellPrice?0:(this.productForm.sellPrice * 0.01).toFixed(2),
          goldVipPrice: !this.productForm.sellPrice?0:(this.productForm.sellPrice * 0.02).toFixed(2),
          platinumVipPrice: !this.productForm.sellPrice?0:(this.productForm.sellPrice * 0.04).toFixed(2),
          diamondVipPrice: !this.productForm.sellPrice?0:(this.productForm.sellPrice * 0.1).toFixed(2)
        }
      },
      handleSpecRemove: function() {
        this.specForm.picUrl = undefined
      },
      handleGoodsPicRemove: function() {
        this.goods.picUrl = undefined
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
      handleAccessoryMerChange(){
        let m = this.merchandise.find(item=>{
          if(item.id == this.accessoryForm.merchandiseId){
            return item
          }
        })
        this.accessoryForm.name = m.name
        this.accessoryForm.price = m.sellingPrice
      }
    }
  }
</script>
