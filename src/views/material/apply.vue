<template>
  <div class="app-container">

    <el-card class="box-card">
      <h3>{{$t('进货申请')}}</h3>

      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"/>
        <span class="font-small">{{$t('货品信息')}}</span>
      </div>
      <div class="table-layout">
        <div>
          <el-row>
            <el-col :span="6" class="table-cell-title">{{$t('Product_name')}}</el-col>
            <el-col :span="6" class="table-cell-title">{{$t('现有库存')}}</el-col>
            <el-col :span="6" class="table-cell-title">{{$t('Price')}}</el-col>
            <el-col :span="6" class="table-cell-title">{{$t('申请数量')}}</el-col>
          </el-row>
          <el-row v-for="item in orderDetail.merchandises">
            <el-col :span="6" class="table-cell">{{ item.name }}</el-col>
            <el-col :span="6" class="table-cell">{{ item.stock }}</el-col>
            <el-col :span="6" class="table-cell">${{ item.wholesaleDecimal }}</el-col>
            <el-col :span="6" class="table-cell">
              <el-input-number :min="0" v-model="item.number" @change="changePrice"></el-input-number>
            </el-col>
          </el-row>
        </div>
      </div>

      <el-card class="box-card">
        <el-form ref="orderDetail" :rules="rules" :model="orderDetail" label-width="150px">
          <el-form-item label="进货金额" prop="orderPrice">
            <el-input v-model="orderDetail.orderPrice" :disabled="true"/>
          </el-form-item>
          <el-form-item :label="$t('Member_account')" prop="userId">
            <el-select v-model="orderDetail.userId" placeholder="从门店成员列表中选择" @change="changeAdmin">
              <el-option v-for="item in shopMembers" :value="item.id" :label="item.username"/>
            </el-select>
          </el-form-item>
          <el-form-item label="联系人" prop="mobile">
            <el-input v-model="orderDetail.consignee" :disabled="true"/>
          </el-form-item>
          <el-form-item :label="$t('Contact_number')" prop="mobile">
            <el-input v-model="orderDetail.mobile" :disabled="true"/>
          </el-form-item>
          <el-form-item :label="$t('Store_location')" prop="mobile">
            <el-col>{{ shop.name }}</el-col>
          </el-form-item>
          <el-form-item label="订货描述" prop="mobile">
            <el-input v-model="orderDetail.remark" type="textarea" autosize/>
          </el-form-item>
        </el-form>
      </el-card>
    </el-card>

    <div class="op-container" style="margin-top: 30px;">
      <el-button @click="handleCancel">{{$t('Cancel')}}</el-button>
      <el-button v-permission="['POST /admin/shopOrder/purchaseApplying']" type="primary" @click="handleApplying">申请</el-button>
    </div>

  </div>
</template>


<script>
  import { purchaseApplying, billnumber } from '@/api/shop'
  import { infoAdmin, getShopMembers } from '@/api/admin'
  import { MessageBox } from 'element-ui'
  export default {
    name: 'apply',
    data() {
      return {
        orderDetail: {
          shopId: undefined,
          userId: undefined,
          orderPrice: undefined,
          number: undefined,
          mobile: undefined,
          consignee: undefined,
          address: undefined,
          remark: undefined,
          merchandises: [],
        },
        shopMembers: undefined,
        shop: {},
        admin: {},
        rules: {
          number: [
            { required: true, message: '申请数量不能为空', trigger: 'change' },
            { type: 'number', message: '申请数量不能为非数字', trigger: 'change' }
          ],
          userId: [{ required: true, message: '联系人不能为空', trigger: 'change' }]
        }
      }
    },
    created() {
      if (this.$route.query.merchandises) {
        this.orderDetail.merchandises = this.$route.query.merchandises
        this.orderDetail.merchandises.forEach(item=>{
          item.number = 1
        })
        let totalPrice = 0;
        this.orderDetail.merchandises.forEach(item=>{
          totalPrice += item.number*item.wholesaleDecimal
        })
        this.orderDetail.orderPrice = totalPrice
      }
      infoAdmin().then(res => {
        this.shop = res.data.data.shop
        this.admin = res.data.data.admin
      })
      getShopMembers(this.shop.id).then(res => {
        this.shopMembers = res.data.data
      })
    },
    methods: {
      handleApplying() {
        this.orderDetail.address = this.shop.address
        let purchaseItemDtos = [];
        this.orderDetail.merchandises.forEach(item=>{
          let p = {
            stock: item.number,
            materialId: item.id,
            name: item.name,
            unit: item.unit,
            price: item.wholesaleDecimal
          }
          purchaseItemDtos.push(p);
        })
        this.orderDetail.purchaseItemDtos = purchaseItemDtos
        delete this.orderDetail.merchandises
        this.$refs['orderDetail'].validate(valid => {
          if (valid) {
            purchaseApplying(this.orderDetail).then(response => {
              this.$notify.success({
                title: this.$t('Success!'),
                message: '申请成功'
              })
              this.$router.push({ path: '/repository/list' })
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
      handleCancel() {
        this.$router.push({ path: '/repository/merchandise' })
      },
      changeAdmin() {
        this.shopMembers.forEach((admin) => {
          if (this.orderDetail.userId == admin.id) {
            this.orderDetail.mobile = admin.mobile
            this.orderDetail.consignee = admin.nickName
          }
        })
      },
      changePrice() {
        let totalPrice = 0;
        this.orderDetail.merchandises.forEach(item=>{
          totalPrice += item.number*item.wholesaleDecimal
        })
        this.orderDetail.orderPrice = totalPrice
      }
    }
  }
</script>
<style scoped>
  .detail-container {
    width: 80%;
    padding: 20px 20px 20px 20px;
    margin: 20px auto;
  }

  .operate-container {
    background: #F2F6FC;
    height: 80px;
    margin: -20px -20px 0;
    line-height: 80px;
  }

  .operate-button-container {
    float: right;
    margin-right: 20px
  }

  .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }

  .table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }

  .table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
  }

  .table-cell-name {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    font-size: 14px;
    color: #303133;
  }
  .table-cell-content {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #303133;
  }
</style>
