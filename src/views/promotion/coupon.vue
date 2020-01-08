<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" :placeholder="$t('Pleae_enter_coupon_title')"/>
      <el-select v-model="listQuery.type" clearable style="width: 200px" class="filter-item" :placeholder="$t('Please_enter_coupon_type')">
        <el-option v-for="type in typeOptions" :key="type.value" :label="type.label" :value="type.value"/>
      </el-select>
      <el-select v-model="listQuery.status" clearable style="width: 200px" class="filter-item" :placeholder="$t('Please_enter_coupon_status')">
        <el-option v-for="type in statusOptions" :key="type.value" :label="type.label" :value="type.value"/>
      </el-select>
      <el-button v-permission="['GET /admin/coupon/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('Search')}}</el-button>
      <el-button v-permission="['POST /admin/coupon/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">{{$t('Add')}}</el-button>
<!--      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{$t('Find')}}</el-button>-->
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" :element-loading-text="$t('Searching')" border fit highlight-current-row>

      <el-table-column align="center" :label="$t('Coupon_ID')" prop="id" sortable/>

      <el-table-column align="center" :label="$t('Coupon_name')" prop="name"/>

      <el-table-column align="center" :label="$t('Introduction')" prop="desc"/>

      <el-table-column align="center" :label="$t('Label')" prop="tag"/>

      <el-table-column align="center" :label="$t('Lowest_spending_value')" prop="min">
        <template slot-scope="scope">{{$t('Full')}}{{ scope.row.min }}{{$t('Dollars')}} {{$t('Lowest_spending_value')}}</template>
      </el-table-column>

      <el-table-column align="center" :label="$t('Discount_price')" prop="discount">
        <template slot-scope="scope">{{$t('Discount')}}{{ scope.row.discount }}{{$t('Dollars')}}</template>
      </el-table-column>

      <el-table-column align="center" :label="$t('Limited_per_person')" prop="limit">
        <template slot-scope="scope">{{ scope.row.limit != 0 ? scope.row.limit : "不限" }}</template>
      </el-table-column>

      <el-table-column align="center" :label="$t('Merchandise_usage_limits')" prop="goodsType">
        <template slot-scope="scope">{{ scope.row.goodsType | formatGoodsType }}</template>
      </el-table-column>

      <el-table-column align="center" :label="$t('Coupon_type')" prop="type">
        <template slot-scope="scope">{{ scope.row.type | formatType }}</template>
      </el-table-column>

      <el-table-column align="center" :label="$t('Amount_of_coupons')" prop="total">
        <template slot-scope="scope">{{ scope.row.total != 0 ? scope.row.total : "不限" }}</template>
      </el-table-column>

      <el-table-column align="center" :label="$t('Status')" prop="status">
        <template slot-scope="scope">{{ scope.row.status | formatStatus }}</template>
      </el-table-column>

      <el-table-column align="center" :label="$t('Operate')" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['GET /admin/coupon/read']" type="primary" size="mini" @click="handleDetail(scope.row)">{{$t('Details')}}</el-button>
          <el-button v-permission="['POST /admin/coupon/update']" type="info" size="mini" @click="handleUpdate(scope.row)">{{$t('Edit')}}</el-button>
          <el-button v-permission="['POST /admin/coupon/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">{{$t('Delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 600px; margin-left:50px;">
        <el-form-item :label="$t('Coupon_name')" prop="name">
          <el-input v-model="dataForm.name"/>
        </el-form-item>
        <el-form-item :label="$t('Introduction')" prop="desc">
          <el-input v-model="dataForm.desc"/>
        </el-form-item>
        <el-form-item :label="$t('Label')" prop="tag">
          <el-input v-model="dataForm.tag"/>
        </el-form-item>
        <el-form-item label="使用门槛" prop="userLevel" >
          <el-checkbox-group v-model="dataForm.userLevel" @change="nolimit()">
            <el-checkbox :label="0" >无限制</el-checkbox>
            <el-checkbox :label="1" >白银会员</el-checkbox>
            <el-checkbox :label="2" >黄金会员</el-checkbox>
            <el-checkbox :label="3" >铂金会员</el-checkbox>
            <el-checkbox :label="4" >钻石会员</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('Lowest_spending_value')" prop="min">
          <el-input v-model="dataForm.min">
            <template slot="append">{{$t('Dollars')}}</template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('Discount_price')" prop="discount">
          <el-input v-model="dataForm.discount">
            <template slot="append">{{$t('Dollars')}}</template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('Limited_per_person')" prop="limit">
          <el-input v-model="dataForm.limit">
            <template slot="append">{{$t('Sheets')}}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="分发类型" prop="type">
          <el-select v-model="dataForm.type">
            <el-option
              v-for="type in typeOptions"
              :key="type.value"
              :label="type.label"
              :value="type.value"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('Amount_of_coupons')" prop="total">
          <el-input v-model="dataForm.total">
            <template slot="append">{{$t('Sheets')}}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="有效期">
          <el-radio-group v-model="dataForm.timeType">
            <el-radio-button :label="0">{{$t('Respective_days_after_claiming_the_coupon')}}</el-radio-button>
            <el-radio-button :label="1">{{$t('Select_deadline')}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="dataForm.timeType === 0">
          <el-input v-model="dataForm.days">
            <template slot="append">天</template>
          </el-input>
        </el-form-item>
        <el-form-item v-show="dataForm.timeType === 1">
          <el-col :span="11">
            <el-date-picker v-model="dataForm.startTime" type="datetime" :placeholder="this.$t('Select_dates')" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"/>
          </el-col>
          <el-col :span="2" class="line">至</el-col>
          <el-col :span="11">
            <el-date-picker v-model="dataForm.endTime" type="datetime" :placeholder="this.$t('Select_dates')" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"/>
          </el-col>
        </el-form-item>
        <el-form-item label="商品限制范围">
          <el-radio-group v-model="dataForm.goodsType">
            <el-radio-button :label="0">{{$t('Usable_in_any_situation')}}</el-radio-button>
<!--            <el-radio-button :label="1">指定分类</el-radio-button>-->
            <el-radio-button :label="2">{{$t('Select_merchandise')}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="dataForm.goodsType === 1">
          {{$t('Not_supported_at_the_moment')}}
        </el-form-item>
        <el-form-item v-show="dataForm.goodsType === 2">
          <template>
            <el-transfer
              filterable
              :titles="['商品', '已选择']"
              :filter-method="filterGoodsMethod"
              filter-placeholder="请输入商品名"
              v-model="dataForm.goodsValue"
              :data="goodsList">
            </el-transfer>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('Cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('Confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('Confirm')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<style>
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
  width: 120px;
  height: 120px;
  display: block;
}
</style>

<script>
import { listCoupon, createCoupon, updateCoupon, deleteCoupon } from '@/api/coupon'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { listGoods } from '@/api/goods'

const defaultTypeOptions = [
  {
    label: this.$t('All_purpose_coupons'),
    value: 0
  },
  {
    label: this.$t('Free_coupons_upon_registration'),
    value: 1
  },
/*  {
    label: '兑换码',
    value: 2
  }*/
]

const defaultStatusOptions = [
  {
    label: this.$t('Normal'),
    value: 0
  },
  {
    label: this.$t('Expired'),
    value: 1
  },
  {
    label: this.$t('Merchandise_removed'),
    value: 2
  }
]

export default {
  name: 'Coupon',
  components: { Pagination },
  filters: {
    formatType(type) {
      for (let i = 0; i < defaultTypeOptions.length; i++) {
        if (type === defaultTypeOptions[i].value) {
          return defaultTypeOptions[i].label
        }
      }
      return ''
    },
    formatGoodsType(goodsType) {
      if (goodsType === 0) {
        return this.$t('Usable_in_any_situation')
      } else if (goodsType === 1) {
        return this.$t('Select_category')
      } else {
        return this.$t('Select_merchandise')
      }
    },
    formatStatus(status) {
      if (status === 0) {
        return '正常'
      } else if (status === 1) {
        return this.$t('Expired')
      } else {
        return '已下架'
      }
    }
  },
  data() {
    return {
      typeOptions: Object.assign({}, defaultTypeOptions),
      statusOptions: Object.assign({}, defaultStatusOptions),
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        type: undefined,
        status: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      goodsList: [],
      listGoodsQuery: {
        page: 1,
        limit: 10000,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        name: undefined,
        desc: undefined,
        tag: undefined,
        total: 0,
        discount: 0,
        min: 0,
        limit: 1,
        type: 0,
        status: 0,
        goodsType: 0,
        goodsValue: [],
        timeType: 0,
        days: 0,
        startTime: null,
        endTime: null,
        userLevel: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: this.$t('Edit'),
        create: this.$t('Create')
      },
      rules: {
        name: [
          { required: true, message: this.$t('Coupon_title_cannot_be_empty'), trigger: 'blur' }
        ]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getGoods()
  },
  methods: {
    getGoods() {
      this.listLoading = true
      listGoods(this.listGoodsQuery).then(response => {
        console.log(response.data.data.list)
        this.goodsList = response.data.data.list.map(goods=>{
          return {
            label: goods.name,
            key: goods.id
          }
        })
      }).catch(() => {
        this.list = []
      })
    },
    getList() {
      this.listLoading = true
      listCoupon(this.listQuery)
        .then(response => {
          this.list = response.data.data.list
          this.total = response.data.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        name: undefined,
        desc: undefined,
        tag: undefined,
        total: 0,
        discount: 0,
        min: 0,
        limit: 1,
        type: 0,
        status: 0,
        goodsType: 0,
        goodsValue: [],
        timeType: 0,
        days: 0,
        startTime: null,
        endTime: null,
        userLevel: []
      }
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createCoupon(this.dataForm)
            .then(response => {
              this.list.unshift(response.data.data)
              this.dialogFormVisible = false
              this.$notify.success({
                title: this.$t('Success!'),
                message: this.$t('Coupon_creation_successful')
              })
            })
            .catch(response => {
              this.$notify.error({
                title: this.$t('Failed'),
                message: response.data.errmsg
              })
            })
        }
      })
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        if (this.dataForm.days === 0) {
          this.dataForm.daysType = 1
        } else {
          this.dataForm.daysType = 0
        }
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateCoupon(this.dataForm)
            .then(() => {
              for (const v of this.list) {
                if (v.id === this.dataForm.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.dataForm)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify.success({
                title: this.$t('Success!'),
                message: this.$t('Coupon_update_successful')
              })
            })
            .catch(response => {
              this.$notify.error({
                title: this.$t('Failed'),
                message: response.data.errmsg
              })
            })
        }
      })
    },
    handleDelete(row) {
      deleteCoupon(row)
        .then(response => {
          this.$notify.success({
            title: this.$t('Success!'),
            message: this.$t('Coupon_deleted')
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
        .catch(response => {
          this.$notify.error({
            title: this.$t('Failed'),
            message: response.data.errmsg
          })
        })
    },
    handleDetail(row) {
      this.$router.push({ path: '/promotion/couponDetail', query: { id: row.id }})
    },
    filterGoodsMethod(query, item){
      return item.label.indexOf(query) > -1
    },
    nolimit(){
      if(this.dataForm.userLevel && this.dataForm.userLevel.indexOf(0) > -1){
        this.dataForm.userLevel = [0]
      }
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [
          '优惠券ID',
          '名称',
          '内容',
          '标签',
          '最低消费',
          '减免金额',
          '每人限领',
          '优惠券数量'
        ]
        const filterVal = [
          'id',
          'name',
          'desc',
          'tag',
          'min',
          'discount',
          'limit',
          'total'
        ]
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '优惠券信息')
        this.downloadLoading = false
      })
    }
  }
}
</script>
