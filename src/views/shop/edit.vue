<template>
  <div class="app-container">

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>门店编辑</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="members()">查看成员</el-button>
      </div>
      <el-form ref="shop" :rules="rules" :model="shop" label-width="150px">
        <el-form-item label="门店名称" prop="name">
          <el-input v-model="shop.name"/>
        </el-form-item>
        <el-form-item label="门店地址" prop="address">
          <el-input v-model="shop.address"/>
        </el-form-item>
        <el-form-item label="门店经理" prop="shopManager">
            <el-input v-model="shopManager.nickName" :disabled="true" placeholder="从成员列表中设置账号为门店经理"/>
        </el-form-item>
        <el-form-item label="联系电话" prop="tel">
          <el-input v-model="shop.tel" placeholder="13000000000"/>
        </el-form-item>
        <el-form-item label="门店店长" prop="shopkeeper">
            <el-input v-model="shopkeeper.nickName" :disabled="true" placeholder="从成员列表中设置账号为门店店长"/>
        </el-form-item>
        <el-form-item label="服务时间">
          <el-col :span="6">
            <el-form-item prop="date1">
              <el-time-picker v-model="shop.openTime" format="HH:mm" value-format="HH:mm" placeholder="早" style="width: 100%;"/>
            </el-form-item>
          </el-col>
          <el-col :span="1" class="line center">-</el-col>
          <el-col :span="6">
            <el-form-item prop="date1">
              <el-time-picker v-model="shop.closeTime" format="HH:mm" value-format="HH:mm" placeholder="晚" style="width: 100%;"/>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="门店介绍" prop="description">
          <el-input v-model="shop.description" type="textarea" placeholder=""/>
        </el-form-item>
        <el-form-item label="服务范围" prop="range">
          <el-radio-group v-model="limited">
            <el-radio :label="false">不限制</el-radio>
            <el-radio :label="true" >服务范围设置</el-radio>
          </el-radio-group>
          <el-input v-show="limited" v-model="shop.range" placeholder="服务范围设置">
            <template slot="append">KM</template>
          </el-input>
        </el-form-item>
        <el-form-item label="订单类型">
          <el-checkbox-group v-model="shop.types">
            <el-checkbox label="0" >客户自取</el-checkbox>
            <el-checkbox label="1" >支持配送</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="运营状态" prop="status">
          <el-select v-model="shop.status">
            <el-option :value="0" label="运营中"/>
            <el-option :value="1" label="歇业中"/>
            <el-option :value="2" label="装修中"/>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="op-container">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleEdit">更新门店</el-button>
    </div>

  </div>
</template>

<script>
import { detailShop, editShop } from '@/api/shop'
import { getShopkeeper, getShopManager } from '@/api/admin'
import { MessageBox } from 'element-ui'

export default {
  name: 'ShopEdit',
  data() {
    return {
      shop: { types: [] },
      shopManager: {},
      shopkeeper: {},
      rules: {
        address: [
          { required: true, message: '门店地址不能为空', trigger: 'blur' }
        ],
        name: [{ required: true, message: '门店名称不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    limited() {
      if (this.shop.range > 0) {
        return true
      }
      return false
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
      const shopId = this.$route.query.id
      detailShop(shopId).then(response => {
        console.log(this.shop)
        console.log(response.data.data)
        this.shop = response.data.data
        if(this.shop.types){
          this.shop.types = this.shop.types.map(function(type){
            return JSON.stringify(type);
          })
        }
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
    },
    handleCancel: function() {
      this.$router.push({ path: '/shop/list' })
    },
    handleEdit: function() {
      if(this.shop.types){
        this.shop.types = this.shop.types.map(function(type) {
          return parseInt(type)
        })
      }
      const finalGoods = {
        litemallShop: this.shop,
        shopManagerId: this.shopManager.id,
        shopkeeperId: this.shopkeeper.id
      }
      editShop(finalGoods)
        .then(response => {
          this.$notify.success({
            title: '成功',
            message: '修改成功'
          })
          this.$router.push({ path: '/shop/list' })
        })
        .catch(response => {
          MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
            confirmButtonText: '确定',
            type: 'error'
          })
        })
    },
    members() {
      this.$router.push({ path: '/shop/members', query: { shopId: this.shop.id }})
    }
  }
}
</script>
