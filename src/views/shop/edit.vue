<template>
  <div class="app-container">

    <el-card class="box-card">
      <h3>门店详情</h3>
      <el-form ref="shop" :rules="rules" :model="shop" label-width="150px">
        <el-form-item label="门店名称" prop="name">
          <el-input v-model="shop.name"/>
        </el-form-item>
        <el-form-item label="门店地址" prop="address">
          <el-input v-model="shop.address"/>
        </el-form-item>
        <el-form-item label="门店经理" prop="shopManager">
          <el-col :span="11">
          <el-input  v-model="shopManager.nickName" placeholder="从成员列表中设置账号为门店经理">
          </el-input>
          </el-col>
          <el-col :span="2"></el-col>
          <el-col :span="11">
            <el-button type="primary" size="mini" @click="shopMembers(shopManager)">店员列表</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="联系电话" prop="tel">
          <el-input v-model="shop.tel" placeholder="13000000000">
          </el-input>
        </el-form-item>
        <el-form-item label="门店店长" prop="shopkeeper">
          <el-col :span="11">
            <el-input v-model="shopkeeper.nickName" disabled="disabled" placeholder="从成员列表中设置账号为门店店长">
            </el-input>
          </el-col>
          <el-col :span="2"></el-col>
          <el-col :span="11">
            <el-button type="primary" size="mini" @click="shopMembers(shopkeeper)">店员列表</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="服务时间">
<!--          <el-input v-model="shop.timeRange" placeholder="早8:00 晚22:00">
          </el-input>-->
          <el-col :span="6">
            <el-form-item prop="date1">
              <el-time-picker format="HH:mm" value-format="HH:mm" placeholder="早" v-model="shop.openTime" style="width: 100%;"></el-time-picker>
            </el-form-item>
          </el-col>
          <el-col class="line center" :span="1">-</el-col>
          <el-col :span="6">
            <el-form-item prop="date1">
              <el-time-picker format="HH:mm" value-format="HH:mm" placeholder="晚" v-model="shop.closeTime" style="width: 100%;"></el-time-picker>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="门店介绍" prop="description">
          <el-input type="textarea" v-model="shop.description" placeholder="">
          </el-input>
        </el-form-item>
        <el-form-item label="服务范围" prop="range">
        <el-radio-group v-model="limited">
          <el-radio :label="false">不限制</el-radio>
          <el-radio :label="true" >服务范围设置</el-radio>
        </el-radio-group>
          <el-input v-model="shop.range" placeholder="服务范围设置" v-show="limited">
            <template slot="append">KM</template>
          </el-input>
      </el-form-item>
        <el-form-item label="订单类型">
            <el-checkbox :label="0" v-model="inside">客户自取</el-checkbox>
            <el-checkbox :label="1" v-model="outside">支持配送</el-checkbox>
        </el-form-item>
        <el-form-item label="运营状态" prop="status">
          <el-select v-model="shop.status">
            <el-option :value="0" label="运营中"></el-option>
            <el-option :value="1" label="歇业中"></el-option>
            <el-option :value="2" label="装修中"></el-option>
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
  import { MessageBox } from 'element-ui'

  export default {
    name: 'ShopEdit',
    data() {
      return {
        shop: {},
        types:[],
        inside:false,
        outside:false,
        shopManager:{},
        shopkeeper:{},
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
        if (this.$route.query.id == null) {
          return
        }
        const shopId = this.$route.query.id
        detailShop(shopId).then(response => {
          console.log(this.shop)
          console.log(response.data.data)
          this.shop = response.data.data
          this.types = this.shop.types
          if(this.shop.types && this.shop.types.indexOf(0) > -1){
            this.inside = true
          }
          if(this.shop.types && this.shop.types.indexOf(1) > -1){
            this.outside = true
          }
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      },
      handleCancel: function() {
        this.$router.push({ path: '/shop/list' })
      },
      handleEdit: function() {
        if(this.inside){
          if(!this.shop.types){
            this.shop.types = [0]
          }else{
            this.shop.types.push(0)
          }
        }
        if(this.outside){
          if(!this.shop.types){
            this.shop.types = [1]
          }else{
            this.shop.types.push(1)
          }
        }
        const finalGoods = {
          litemallShop: this.shop,
          shopManagerId: this.shopManager.id,
          shopkeeperId: this.shopkeeper.id,
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
      shopMembers(admin){

      }
    },
    computed: {
      limited(){
        if(this.shop.range > 0){
          return true;
        }
        return false
      }
    }
  }
</script>
