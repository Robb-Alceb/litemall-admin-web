<template>
  <div class="app-container">

    <el-card class="box-card">
      <h3>进货申请</h3>

      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"/>
        <span class="font-small">货品信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">货品名称</el-col>
          <el-col :span="6" class="table-cell-title">货品图片</el-col>
          <el-col :span="6" class="table-cell-title">现有库存</el-col>
          <el-col :span="6" class="table-cell-title">价格/货号</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">{{ merchandise.name }}</el-col>
          <el-col :span="6" class="table-cell">
            <template slot-scope="merchandise">
              <img :src="merchandise.picUrl" width="40">
            </template>
          </el-col>
          <el-col :span="6" class="table-cell">{{ merchandise.number }}</el-col>
          <el-col :span="6" class="table-cell">${{ merchandise.sellingPrice }}/{{ merchandise.merchandiseSn }}</el-col>
        </el-row>
      </div>

      <el-card class="box-card">
        <el-form ref="orderDetail" :rules="rules" :model="orderDetail" label-width="150px">
          <el-form-item label="货物编号">
            <el-col>{{ merchandise.merchandiseSn }}</el-col>
          </el-form-item>
          <el-form-item label="申请数量" prop="number">
            <el-input v-model.number="orderDetail.number" @input="changePrice"/>
          </el-form-item>
          <el-form-item label="进货金额" prop="orderPrice">
            <el-input v-model="orderDetail.orderPrice" :disabled="true"/>
          </el-form-item>
          <el-form-item label="用户账号" prop="userId">
            <el-select v-model="orderDetail.userId" placeholder="从门店成员列表中选择" @change="changeAdmin">
              <el-option v-for="item in shopMembers" :value="item.id" :label="item.username"/>
            </el-select>
          </el-form-item>
          <el-form-item label="联系人" prop="mobile">
            <el-input v-model="orderDetail.consignee" :disabled="true"/>
          </el-form-item>
          <el-form-item label="联系电话" prop="mobile">
            <el-input v-model="orderDetail.mobile" :disabled="true"/>
          </el-form-item>
          <el-form-item label="所在门店" prop="mobile">
            <el-col>{{ shop.name }}</el-col>
          </el-form-item>
          <el-form-item label="订货描述" prop="mobile">
            <el-input v-model="orderDetail.remark" type="textarea" autosize/>
          </el-form-item>
        </el-form>
      </el-card>
    </el-card>

    <div class="op-container" style="margin-top: 30px;">
      <el-button @click="handleCancel">取消</el-button>
      <el-button v-permission="['POST /admin/shopOrder/orderApplying']" type="primary" @click="handleApplying">申请</el-button>
    </div>

  </div>
</template>

<script>
import { shopOrderApplying } from '@/api/shop'
import { infoAdmin, getShopMembers } from '@/api/admin'
import { MessageBox } from 'element-ui'
export default {
  name: 'ShopOrderCreate',
  data() {
    return {
      orderDetail: {
        merchandiseId: undefined,
        shopId: undefined,
        userId: undefined,
        orderPrice: undefined,
        number: undefined,
        mobile: undefined,
        consignee: undefined,
        address: undefined,
        remark: undefined
      },
      merchandise: {
        merchandiseSn: undefined
      },
      shopMembers: undefined,
      shop: {},
      admin: {},
      rules: {
        number: [
          { required: true, message: '申请数量不能为空', trigger: 'change' },
          { type: 'number', message: '申请数量不能为非数字', trigger: 'change' }
        ],
        userId: [{ required: true, message: '联系人不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    if (this.$route.query.merchandise) {
      this.merchandise = this.$route.query.merchandise
      this.orderDetail.merchandiseId = this.merchandise.id
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
      this.$refs['orderDetail'].validate(valid => {
        if (valid) {
          shopOrderApplying(this.orderDetail).then(response => {
            this.$notify.success({
              title: '成功',
              message: '申请成功'
            })
            this.$router.push({ path: '/repository/list' })
          })
            .catch(response => {
              MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
                confirmButtonText: '确定',
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
      if (this._.isNumber(this.orderDetail.number)) {
        this.orderDetail.orderPrice = this.orderDetail.number * this.merchandise.sellingPrice
      } else {
        this.orderDetail.orderPrice = 0
      }
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
