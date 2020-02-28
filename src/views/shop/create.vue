<template>
  <div class="app-container">

    <el-card class="box-card">
      <h3>新增门店</h3>

      <el-form ref="shop" :rules="rules" :model="shop" label-width="150px">
        <el-form-item :label="$t('Store_name')" prop="name">
          <el-input v-model="shop.name"/>
        </el-form-item>
        <el-form-item :label="$t('Store_address')" prop="address">
          <el-input v-model="shop.address"/>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('国家')">
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
            <el-form-item :label="$t('省份')">
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
            <el-form-item :label="$t('城市')">
              <el-select v-model="regionIds[2]" filterable >
                <el-option
                  v-for="item in citys"
                  :label="item.nameCn"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('编码')" prop="postalCode">
              <el-input v-model="shop.postalCode"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('街道')" prop="streetAddress">
              <el-input v-model="shop.streetAddress"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('单元')" prop="aptUnit">
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
          <el-select v-model="shopManagerId" :placeholder="$t('Change_account_to_store_supervisor_account_in_partner_list')" clearable>
            <el-option v-for="item in shopMembers" :value="item.id" :label="item.nickName"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('Store_Manager')" prop="shopkeeper">
          <el-select v-model="shopkeeperId" :placeholder="$t('Change_account_to_store_manager_account_in_partner_list')" clearable>
            <el-option v-for="item in shopMembers" :value="item.id" :label="item.nickName"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('Contact_number')" prop="mobile">
          <el-input v-model="shop.mobile" placeholder="13000000000"/>
        </el-form-item>
        <el-form-item :label="$t('服务星期')" prop="weeks">
          <el-checkbox-group v-model="shop.weeks">
            <el-checkbox :label="1">{{$t('星期一')}}</el-checkbox>
            <el-checkbox :label="2">{{$t('星期二')}}</el-checkbox>
            <el-checkbox :label="3">{{$t('星期三')}}</el-checkbox>
            <el-checkbox :label="4">{{$t('星期四')}}</el-checkbox>
            <el-checkbox :label="5">{{$t('星期五')}}</el-checkbox>
            <el-checkbox :label="6">{{$t('星期六')}}</el-checkbox>
            <el-checkbox :label="7">{{$t('星期日')}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('Service_hours')">
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
            <el-radio :label="false">{{$t('Not_limited_to_')}}</el-radio>
            <el-radio :label="true" >{{$t('Service_area_setting')}}</el-radio>
          </el-radio-group>
          <el-input v-show="limited" v-model="shop.range" :placeholder="$t('Service_area_setting')">
            <template slot="append">KM</template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('Order_type')">
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

    <div class="op-container">
      <el-button @click="handleCancel">{{$t('Cancel')}}</el-button>
      <el-button v-permission="['POST /admin/shop/create']" type="primary" @click="handleCreate">新增门店</el-button>
    </div>

  </div>
</template>

<script>
import { createShop } from '@/api/shop'
import { allAdmin } from '@/api/admin'
import { listCountryRegion, listSubRegion } from '@/api/region'
import { MessageBox } from 'element-ui'

export default {
  name: 'ShopEdit',
  data() {
    return {
      limited:false,
      shop: {
        'name': '',
        'address': '',
        'status': 1,
        'openTime': '08:00',
        'closeTime': '22:00',
        'description': '',
        'range': 0,
        'types': [],
        'weeks': []
      },
      regionIds:[],
      shopkeeperId: undefined,
      shopManagerId: undefined,
      shopMembers: [],
      countrys:[],
      provinces:[],
      citys:[],
      rules: {
        streetAddress: [
          { required: true, message: this.$t('Store_address_cannot_be_empty'), trigger: 'blur' }
        ],
        name: [{ required: true, message: this.$t('Store_name_cannot_be_empty'), trigger: 'blur' }]
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
      allAdmin().then((res) => {
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
    handleCancel: function() {
      this.$router.push({ path: '/shop/list' })
    },
    handleCreate: function() {
      const shop = {
        litemallShop: this.shop,
        shopManagerId: this.shopManagerId,
        shopkeeperId: this.shopkeeperId,
        regionIds: this.regionIds
      }
      this.$refs['shop'].validate(valid=>{
        if(valid){
          createShop(shop)
            .then(response => {
              this.$notify.success({
                title: this.$t('Success!'),
                message: this.$t('Creation_successful')
              })
              this.$router.push({ path: '/shop/list' })
            })
            .catch(response => {
              MessageBox.alert(this.$t('Error') + response.data.errmsg, this.$t('Warning'), {
                confirmButtonText: this.$t('Confirm'),
                type: 'error'
              })
            })
        }
      })
    }
  }
}
</script>
