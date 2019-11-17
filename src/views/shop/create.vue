<template>
  <div class="app-container">

    <el-card class="box-card">
      <h3>新增门店</h3>
      <el-form ref="shop" :rules="rules" :model="shop" label-width="150px">
        <el-form-item label="门店名称" prop="name">
          <el-input v-model="shop.name"/>
        </el-form-item>
        <el-form-item label="门店地址" prop="address">
          <el-input v-model="shop.address"/>
        </el-form-item>
        <el-form-item label="门店经理" prop="shopManager">
          <el-select  v-model="shop.shopManagerId"  placeholder="从成员列表中设置账号为门店店长">
            <el-option v-for="item in shopMembers" :value="item.id" :label="item.nickName"/>
          </el-select>
        </el-form-item>
        <el-form-item label="门店店长" prop="shopkeeper">
          <el-select  v-model="shop.shopkeeperId">
            <el-option v-for="item in shopMembers" :value="item.id" :label="item.nickName"/>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="shop.mobile" placeholder="13000000000"/>
        </el-form-item>
        <el-form-item label="服务时间">
          <el-col :span="6">
            <el-form-item prop="date1">
              <el-time-picker v-model="shop.openTime" format="HH:mm" value-format="HH:mm" placeholder="早" style="width: 100%;"/>
            </el-form-item>
          </el-col>
          <el-col :span="1" class="line" align="center">-</el-col>
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
            <el-checkbox :label="0" >客户自取</el-checkbox>
            <el-checkbox :label="1" >支持配送</el-checkbox>
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
      <el-button type="primary" @click="handleCreate">新增门店</el-button>
    </div>

  </div>
</template>

<script>
import { detailShop, createShop } from '@/api/shop'
import { allAdmin } from '@/api/admin'
import { MessageBox } from 'element-ui'

export default {
  name: 'ShopEdit',
  data() {
    return {
      limit: false,
      shop: {
        "name": "",
        "address": "",
        "status": 0,
        "openTime": "08:00",
        "closeTime": "22:00",
        "description": "",
        "range": 0,
        "types": [],
        "shopManagerId": null,
        "shopkeeperId": null
      },
      shopMembers:[],
      rules: {
        address: [
          { required: true, message: '门店地址不能为空', trigger: 'blur' }
        ],
        name: [{ required: true, message: '门店名称不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init: function() {
      const shopId = this.$route.query.id
      detailShop(shopId).then(response => {
        console.log(this.shop)
        console.log(response.data.data)
        this.shop = response.data.data
        if (this.shop && this.shop.range > 0) {
          this.limit = true
        }
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })

      allAdmin().then((res)=>{
        this.shopMembers = res.data.data
      })
    },
    handleCancel: function() {
      this.$router.push({ path: '/shop/list' })
    },
    handleCreate: function() {
      createShop(this.shop)
        .then(response => {
          this.$notify.success({
            title: '成功',
            message: '创建成功'
          })
          this.$router.push({ path: '/shop/list' })
        })
        .catch(response => {
          MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
            confirmButtonText: '确定',
            type: 'error'
          })
        })
    }
  },
  computed:{
    limited() {
      if (this.shop.range > 0) {
        return true
      }
      return false
    }
  }
}
</script>
