<template>
  <div class="app-container">

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>门店编辑</span>

        <el-button v-permission="['GET /admin/admin/list']" style="float: right; padding: 3px 0" type="text" @click="members()">{{$t('View_partners_list')}}</el-button>
        <el-button v-permission="['GET /admin/shopLog/list']" style="float: right; padding: 3px 0;margin-right: 10px;" type="text" @click="handleLogs()">{{$t('View_Journals')}}</el-button>
      </div>
      <el-form ref="shop" :rules="rules" :model="shop" label-width="150px">
        <el-form-item :label="$t('Store_name')" prop="name">
          <el-input v-model="shop.name"/>
        </el-form-item>
        <el-form-item :label="$t('Store_address')" prop="address">
          <el-input v-model="shop.address"/>
        </el-form-item>
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
          <el-input v-show="limited" v-model.number="shop.range" :placeholder="$t('Service_area_setting')">
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

    <div class="op-container" style="margin-top: 10px;">
      <el-button @click="handleCancel">{{$t('Cancel')}}</el-button>
      <el-button v-permission="['PUT /admin/shop/update']" type="primary" @click="handleEdit">{{$t('Update_Store')}}</el-button>
    </div>

  </div>
</template>

<script>
import { detailShop, editShop } from '@/api/shop'
import { getShopkeeper, getShopManager, getShopMembers } from '@/api/admin'
import { MessageBox } from 'element-ui'


export default {
  name: 'ShopEdit',
  data() {
    return {
      limited:false,
      shop: { types: [] },
      shopManager: {},
      shopkeeper: {},
      shopMembers:[],
      rules: {
        address: [
          { required: true, message: this.$t('Store_address_cannot_be_empty'), trigger: 'blur' }
        ],
        name: [{ required: true, message: this.$t('Store_name_cannot_be_empty'), trigger: 'blur' }],
        // range: [{ type: 'number', message: '服务范围必须为数字', trigger: 'change' }],
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
    handleCancel: function() {
      this.$router.push({ path: '/shop/list' })
    },
    handleEdit: function() {

      let shop = {
        litemallShop: this.shop,
        shopManagerId: this.shopManager.id || null,
        shopkeeperId: this.shopkeeper.id || null
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
