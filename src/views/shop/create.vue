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
          <el-input v-model="shop.shopManager" placeholder="从成员列表中设置账号为门店经理">
          </el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="tel">
          <el-input v-model="shop.tel" placeholder="13000000000">
          </el-input>
        </el-form-item>
        <el-form-item label="门店店长" prop="shopkeeper">
          <el-input v-model="shop.shopkeeper" placeholder="从成员列表中设置账号为门店店长">
          </el-input>
        </el-form-item>
        <el-form-item label="服务时间" prop="timeRange">
          <el-input v-model="shop.timeRange" placeholder="早8:00 晚22:00">
          </el-input>
        </el-form-item>
        <el-form-item label="门店介绍" prop="desc">
          <el-input type="textarea" v-model="shop.desc" placeholder="">
          </el-input>
        </el-form-item>
        <el-form-item label="服务范围" prop="range">
          <el-radio-group v-model="limit">
            <el-radio :label="false">不限制</el-radio>
            <el-radio :label="true" >服务范围设置</el-radio>
          </el-radio-group>
          <el-input v-model="shop.range" placeholder="服务范围设置" v-show="limit">
            <template slot="append">KM</template>
          </el-input>
        </el-form-item>
        <el-form-item label="订单类型" prop="types">
          <el-checkbox :label="0" name="type">客户自取</el-checkbox>
          <el-checkbox :label="1" name="type">支持配送</el-checkbox>
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
      <el-button type="primary" @click="handleEdit">新增门店</el-button>
    </div>

  </div>
</template>


<script>
  import { detailShop, createShop } from '@/api/shop'
  import { MessageBox } from 'element-ui'

  export default {
    name: 'ShopEdit',
    data() {
      return {
        limit:"false",
        shop: {},
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
          if(this.shop && this.shop.range > 0){
            this.limit = true;
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
        const finalGoods = {
          shop: this.shop,
          shopManagerId: this.shopManagerId,
          shopkeeperId: this.shopkeeperId,
        }
        createShop(finalGoods)
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
      },
    }
  }
</script>
