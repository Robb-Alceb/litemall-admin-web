<template>
  <div class="app-container">

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{$t('Edit_Store_Details')}}</span>

        <el-button v-permission="['GET /admin/admin/list']" style="float: right; padding: 3px 0" type="text" @click="members()">{{$t('View_partners_list')}}</el-button>
        <el-button v-permission="['GET /admin/shopLog/list']" style="float: right; padding: 3px 0;margin-right: 10px;" type="text" @click="handleLogs()">{{$t('View_Journals')}}</el-button>
      </div>
      <el-form ref="shop" :rules="rules" :model="shop" label-width="150px">
        <el-form-item :label="$t('Store_name')" prop="name">
          <el-input v-model="shop.name"/>
        </el-form-item>
        <el-form-item :label="$t('Store_address')" prop="streetAddress">
          <el-input v-model="shop.streetAddress"/>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('Country')" prop="country">
              <el-select v-model="regionIds[0]" filterable @change="getPrivonces(true)">
                <el-option
                  v-for="item in countrys"
                  :label="item.nameCn"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Province')" prop="province">
              <el-select v-model="regionIds[1]" filterable  @change="getCitys(true)">
                <el-option
                  v-for="item in provinces"
                  :label="item.nameCn"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('City')" prop="city">
              <el-select v-model="regionIds[2]" filterable @change="getCountys(true)">
                <el-option
                  v-for="item in citys"
                  :label="item.nameCn"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('区县')" prop="county">
              <el-select v-model="regionIds[3]" filterable >
                <el-option
                  v-for="item in countys"
                  :label="item.nameCn"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('Postal_ZIP')" prop="postalCode">
              <el-input v-model="shop.postalCode"/>
            </el-form-item>
          </el-col>
<!--          <el-col :span="12">
            <el-form-item :label="$t('地址')" prop="streetAddress">
              <el-input v-model="shop.streetAddress"/>
            </el-form-item>
          </el-col>-->
          <el-col :span="12">
            <el-form-item :label="$t('Unit')" prop="aptUnit">
              <el-input v-model="shop.aptUnit"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('Longitude')">
              <el-input v-model="shop.longitude"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Latitude')">
              <el-input v-model="shop.latitude"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('Store_Supervisor')" prop="shopManager">
          <el-select  v-model="shopManager.id"  :placeholder="$t('Change_account_to_store_manager_account_in_partner_list')" clearable>
            <el-option v-for="item in shopMembers" :value="item.id" :label="item.nickName"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('Store_Manager')" prop="shopkeeper">
          <el-select  v-model="shopkeeper.id" clearable>
            <el-option v-for="item in shopMembers" :value="item.id" :label="item.nickName" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('Contact_number')" prop="mobile">
          <el-input v-model="shop.mobile" placeholder="13000000000"/>
        </el-form-item>
        <el-form-item :label="$t('Business_Days')" prop="weeks">
          <el-checkbox-group v-model="shop.weeks">
            <el-checkbox :label="1">{{$t('Monday')}}</el-checkbox>
            <el-checkbox :label="2">{{$t('Tuesday')}}</el-checkbox>
            <el-checkbox :label="3">{{$t('Wednesday')}}</el-checkbox>
            <el-checkbox :label="4">{{$t('Thursday')}}</el-checkbox>
            <el-checkbox :label="5">{{$t('Friday')}}</el-checkbox>
            <el-checkbox :label="6">{{$t('Saturday')}}</el-checkbox>
            <el-checkbox :label="7">{{$t('Sunday')}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('Service_hours')"  prop="serviceTime">
          <el-col :span="6">
            <el-form-item prop="date1">
              <el-time-picker v-model="shop.openTime" format="HH:mm" value-format="HH:mm" :placeholder="$t('Morning')" style="width: 100%;"/>
            </el-form-item>
          </el-col>
          <el-col :span="1" class="line" align="center">-</el-col>
          <el-col :span="6">
            <el-form-item prop="date1">
              <el-time-picker v-model="shop.closeTime" format="HH:mm" value-format="HH:mm" :placeholder="$t('Night')" style="width: 100%;"/>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item :label="$t('Store_introduction')" prop="description">
          <el-input v-model="shop.description" type="textarea" placeholder="" autosize/>
        </el-form-item>
        <el-form-item :label="$t('Service_areas')" prop="range">
          <el-radio-group v-model="limited">
<!--            <el-radio :label="false">{{$t('Not_limited_to_')}}</el-radio>-->
            <el-radio :label="true" >{{$t('Service_area_setting')}}{{$t('(单位：MI)')}}</el-radio>
          </el-radio-group>
          <div class="block">
            <el-slider
              :min="1"
              :max="10000"
              v-model="shop.range"
              show-input>
            </el-slider>

          </div>
<!--          <el-input v-show="limited" v-model.number="shop.range" :placeholder="$t('Service_area_setting')">
            <template slot="append">KM</template>
          </el-input>-->
        </el-form-item>
        <el-form-item :label="$t('Order_type')" prop="types">
          <el-checkbox-group v-model="shop.types">
            <el-checkbox :label="1" >{{$t('Customer_self-serve')}}</el-checkbox>
            <el-checkbox :label="2" >{{$t('Supports_delivery')}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('Operation_Status')" prop="status">
          <el-select v-model="shop.status">
            <el-option :value="1" :label="$t('Open_for_business')"/>
            <el-option :value="2" :label="$t('Closed')"/>
            <el-option :value="3" :label="$t('Renovating')"/>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="op-container" style="margin-top: 10px;">
      <el-button @click="handleCancel">{{$t('Cancel')}}</el-button>
      <el-button v-permission="['PUT /admin/shop/update']" type="primary" @click="handleEdit">{{$t('Update_Store')}}</el-button>
    </div>

  </div>
</template>

<script>
import { detailShop, editShop } from '@/api/shop'
import { getShopkeeper, getShopManager, getShopMembers } from '@/api/admin'
import { listCountryRegion, listSubRegion } from '@/api/region'
import { MessageBox } from 'element-ui'


export default {
  name: 'ShopEdit',
  data() {
    const validateService = (rule, value, callback) => {
      console.log('value' + value)
      if (!this.shop.openTime || !this.shop.closeTime) {
        callback(new Error(this.$t('服务时间不能为空')))
      } else {
        callback()
      }
    }
    const validateCountry = (rule, value, callback) => {
      if (!this.regionIds || !this.regionIds[0]) {
        callback(new Error(this.$t('国家不能为空')))
      } else {
        callback()
      }
    }
    const validateProvince = (rule, value, callback) => {
      if (!this.regionIds || !this.regionIds[1]) {
        callback(new Error(this.$t('省份不能为空')))
      } else {
        callback()
      }
    }
    const validateCity = (rule, value, callback) => {
      if (!this.regionIds || !this.regionIds[2]) {
        callback(new Error(this.$t('城市不能为空')))
      } else {
        callback()
      }
    }
    const validateCounty = (rule, value, callback) => {
      if (!this.regionIds || !this.regionIds[3]) {
        callback(new Error(this.$t('区县不能为空')))
      } else {
        callback()
      }
    }
    return {
      limited:true,
      shop: { types: [], weeks: [] },
      regionIds:[],
      shopManager: {},
      shopkeeper: {},
      shopMembers:[],
      countrys:[],
      provinces:[],
      citys:[],
      countys:[],
      rules: {
/*        streetAddress: [
          { required: true, message: this.$t('Store_address_cannot_be_empty'), trigger: 'blur' }
        ],*/
        name: [{ required: true, message: this.$t('Store_name_cannot_be_empty'), trigger: 'blur' }],
        // range: [{ type: 'number', message: '服务范围必须为数字', trigger: 'change' }],
        streetAddress: [
          { required: true, message: this.$t('Store_address_cannot_be_empty'), trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: this.$t('联系电话不能为空'), trigger: 'blur' },
        ],
        weeks: [
          { required: true, message: this.$t('服务星期不能为空'), trigger: 'blur' },
        ],
        types: [
          { required: true, message: this.$t('订单类型不能为空'), trigger: 'blur' },
        ],
        serviceTime: [
          // { required: true, message: this.$t('服务时间不能为空'), trigger: 'blur' },
          { validator: validateService,  trigger: 'blur' }
        ],
        country: [
          { validator: validateCountry,  trigger: 'blur' }
        ],
        province: [
          { validator: validateProvince,  trigger: 'blur' }
        ],
        city: [
          { validator: validateCity,  trigger: 'blur' }
        ],
        county: [
          { validator: validateCounty, trigger: 'blur' }
        ],
      }
    }
  },
/*  computed: {
    limited() {
      if (this.shop.range > 0) {
        return true
      }
      return false
    }
  },*/
  created() {
    this.init()
    this.getCountrys()
  },
  methods: {
    init: function() {
      if (this.$route.query.id == null) {
        return
      }
      const shopId = this.$route.query.id
      detailShop(shopId).then(response => {
        console.log(this.shop)
        console.log(response.data.data)
        this.shop = response.data.data
        this.shop.regions.forEach(region=>{
          this.regionIds.push(region.id)
          this.getPrivonces()
          this.getCitys()
          this.getCountys()
        })
        if(this.shop.range){
          this.limited = true
        }
/*        if(this.shop.types){
          this.shop.types = this.shop.types.map(function(type){
            return JSON.stringify(type);
          })
        }*/
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
      // 店长
      getShopkeeper(shopId).then(res=> {
        if(res.data.data){
          this.shopkeeper = res.data.data
        }
      }).catch(() => {

      })

      // 经理
      getShopManager(shopId).then(res=> {
        if(res.data.data){
          this.shopManager = res.data.data
        }
      }).catch(() => {

      })
      getShopMembers(shopId).then((res)=>{
        this.shopMembers = res.data.data
      })
    },
    getCountrys(){
      listCountryRegion().then(response=>{
        this.countrys = response.data.data.list
      })
    },
    getPrivonces(refresh){
      let query = {
        id: this.regionIds[0],
        type: 1
      }
      if(refresh){
        this.regionIds.splice(1,1)
      }
      listSubRegion(query).then(response=>{
        this.provinces = response.data.data.list
      })
    },
    getCitys(refresh){
      let query = {
        id: this.regionIds[1],
        type: 2
      }
      if(refresh){
        this.regionIds.splice(2,1)
      }
      listSubRegion(query).then(response=>{
        this.citys = response.data.data.list
      })
    },
    getCountys(refresh){
      let query = {
        id: this.regionIds[2],
        type: 2
      }
      if(refresh){
        this.regionIds.splice(3,1)
      }
      listSubRegion(query).then(response=>{
        this.countys = response.data.data.list
      })
    },
    handleCancel: function() {
      this.$router.push({ path: '/shop/list' })
    },
    handleEdit: function() {

      let shop = {
        litemallShop: this.shop,
        shopManagerId: this.shopManager.id || null,
        shopkeeperId: this.shopkeeper.id || null,
        regionIds: this.regionIds
      }
      this.$refs['shop'].validate(valid=> {
        if(valid){
          editShop(shop)
            .then(response => {
              this.$notify.success({
                title: this.$t('Success!'),
                message: '修改成功'
              })
              this.$router.push({path: '/shop/list'})
            })
            .catch(response => {
              MessageBox.alert(this.$t('Error') + response.data.errmsg, this.$t('Warning'), {
                confirmButtonText: this.$t('Confirm'),
                type: 'error'
              })
            })
        }
      })
    },
    members() {
      this.$router.push({ path: '/shop/members', query: { shopId: this.shop.id }})
    },
    handleLogs(){
      this.$router.push({ path: '/shop/logs', query: { id: this.shop.id }})
    }
  }
}
</script>
