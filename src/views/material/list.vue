<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.merchandiseSn" clearable class="filter-item" style="width: 200px;" :placeholder="$t('Merchandise_number')"/>
      <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" :placeholder="$t('Product_name')"/>
      <el-button v-permission="['GET /admin/erp/material/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('Search')}}</el-button>
      <el-button v-permission="['POST /admin/shopOrder/purchaseApplying']" v-shop="true" class="filter-item" type="primary" icon="el-icon-edit" @click="handleGetAllmerchandise">{{$t('Restock_request')}}</el-button>
<!--      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{$t('Find')}}</el-button>-->
    </div>

    <!-- 查询结果 -->
    <el-table ref="table" v-loading="listLoading" :data="list" :element-loading-text="$t('Searching')" border fit highlight-current-row>
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>

      <el-table-column align="center" min-width="100" :label="$t('Merchandise_number')" prop="id"/>

      <el-table-column align="center" min-width="100" :label="$t('Product_name')" prop="name"/>

<!--      <el-table-column align="center" min-width="100" :label="$t('Merchandise_picture')" prop="picUrl">
        <template slot-scope="scope">
          <img :src="scope.row.picUrl" width="40">
        </template>
      </el-table-column>-->

      <el-table-column align="center" :label="$t('采购价')" prop="wholesaleDecimal"/>

      <el-table-column align="center" :label="$t('销售价')" prop="sellingPrice">
        <template slot-scope="scope">
          <el-tag v-shop="false">{{scope.row.sellingPrice}}</el-tag>
          <el-tag v-shop="true" style="cursor: pointer;" :title="$t('修改销售价')" @click="handleChangeSellingPrice(scope.row)">{{scope.row.sellingPrice}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('库存')" prop="stock"/>

      <el-table-column align="center" label="单位" prop="unit"/>

<!--      <el-table-column align="center" :label="$t('Operate')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
&lt;!&ndash;          <el-button v-shop="false" v-permission="['GET /admin/merchandise/list']" type="primary" size="mini" @click="handleAdd(scope.row)">{{$t('Additional_comments')}}</el-button>&ndash;&gt;
          <el-button v-shop="true" v-permission="['GET /admin/merchandise/list']" type="primary" size="mini" @click="handleApplying(scope.row)">{{$t('Additional_comments')}}</el-button>
&lt;!&ndash;          <el-button v-permission="['GET /admin/merchandise/update']" type="primary" size="mini" @click="handleEdit(scope.row)">{{$t('Details')}}</el-button>&ndash;&gt;
        </template>
      </el-table-column>-->
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 补充库存对话框 -->
<!--    <el-dialog :visible.sync="shipDialogVisible" title="补充库存">
      <el-form ref="merchandiseForm" :rules="rules" :model="merchandiseForm" status-icon label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="补充库存数量" prop="number">
          <el-input v-model.number="merchandiseForm.number"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="shipDialogVisible = false">{{$t('Cancel')}}</el-button>
        <el-button type="primary" @click="confirmAdd">{{$t('Confirm')}}</el-button>
      </div>
    </el-dialog>-->

    <!-- 修改售价对话框 -->
    <el-dialog :visible.sync="shipDialogVisible" :title="$t('修改销售价')">
      <el-form ref="merchandiseForm" :rules="rules" :model="merchandiseForm" status-icon label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="销售价格" prop="number">
          <el-input v-model.number="merchandiseForm.sellingPrice"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="shipDialogVisible = false">{{$t('Cancel')}}</el-button>
        <el-button type="primary" @click="confirmAdd">{{$t('Confirm')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
// import { listMerchandise, allMerchandise, merchandiseAddNumber } from '@/api/merchandise'
import { materialList, materialApply, billnumber } from '@/api/erp'
import { MessageBox } from 'element-ui'

export default {
  name: 'Merchandise',
  components: { Pagination },
  data() {
    return {
      total: 0,
      listLoading: false,
      downloadLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        shopId: undefined,
        merchandiseSn: undefined,
        name: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      shipDialogVisible: false,
      merchandiseForm: {
        merchandiseId: undefined,
        sellingPrice: undefined
      },
      rules: {
        sellingPrice: [
          { required: true, message: this.$t('Amount_cannot_be_empty'), trigger: 'change' },
          { type: 'number', message: this.$t('Amount_must_be_a_number'), trigger: 'change' }
        ]
      },
      list: [],
      merchandiseHQlist: [],
      merchandiseHQDialogVisible: false
    }
  },
  created() {
    if (this.$route.query.shopId) {
      this.listQuery.shopId = this.$route.query.shopId
    }
    this.getList()
  },
  methods: {
    getList() {
      materialList(this.listQuery).then(res => {
        this.list = res.data.data.rows
        this.total = res.data.data.total
      }).catch(() => {
        this.list = []
        this.listLoading = false
      })
    },
    handleFilter() {
      this.getList()
    },
    handleAdd(row) {
      this.shipDialogVisible = true
      this.merchandiseForm.id = row.id
      this.merchandiseForm.number = undefined
      this.$nextTick(() => {
        this.$refs['merchandiseForm'].clearValidate()
      })
    },
    confirmAdd() {
      this.$refs['merchandiseForm'].validate(valid => {
        if (valid) {
          materialApply(this.merchandiseForm).then(response => {
            this.$notify.success({
              title: this.$t('Success!'),
              message: '修改成功'
            })
            this.shipDialogVisible = false
            this.getList()
          })
            .catch(response => {
              MessageBox.alert(this.$t('Error') + response.data.errmsg, this.$t('Warning'), {
                confirmButtonText: this.$t('Confirm'),
                type: 'error'
              })
            })
        }
      })
      this.$nextTick(() => {
        this.$refs['merchandiseForm'].clearValidate()
      })
    },
    handleCreate() {
      this.$router.push({ path: '/repository/create' })
    },
    handleEdit(row) {
      this.$router.push({ path: '/repository/edit', query: { id: row.id }})
    },
    handleApplying(row) {
      this.$router.push({ path: '/shop/order/create', query: { merchandise: row }})
    },
    handleDownload() {
      /*      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['订单ID', '订单编号', '用户ID', '订单状态', '是否删除', '收货人', '收货联系电话', '收货地址']
          const filterVal = ['id', 'orderSn', 'userId', 'orderStatus', 'isDelete', 'consignee', 'mobile', 'address']
          excel.export_json_to_excel2(tHeader, this.list, filterVal, '订单信息')
          this.downloadLoading = false
        })*/
    },
    handleGetAllmerchandise() {
      console.log(this.$refs['table'].selection)
      if(!this.$refs['table'].selection || this.$refs['table'].selection.length == 0){
        this.$notify.error({
          title: this.$t('Failed'),
          message: this.$t('请选择数据')
        })
      }else{
        this.$router.push({ path: '/repository/apply', query: { merchandises: this.$refs['table'].selection }})
      }
    },
    handleChangeSellingPrice(row){
      //库存为0，不能修改
      if(!row.stock){
        this.$notify.error({
          title: this.$t('Failed'),
          message: this.$t('没有库存')
        })
        return
      }
      this.merchandiseForm.sellingPrice += ""
      this.shipDialogVisible = !this.shipDialogVisible
    }
  }
}
</script>

<style scoped>

</style>
