<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.merchandiseSn" clearable class="filter-item" style="width: 200px;" :placeholder="$t('Merchandise_number')"/>
      <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" :placeholder="$t('Product_name')"/>
      <el-button v-permission="['GET /admin/merchandise/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('Search')}}</el-button>
      <el-button v-permission="['POST /admin/merchandise/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">{{$t('Add')}}</el-button>
      <el-button v-permission="['POST /admin/shopOrder/orderApplying']" v-shop="true" class="filter-item" type="primary" icon="el-icon-edit" @click="handleGetAllmerchandise">{{$t('Restock_request')}}</el-button>
<!--      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{$t('Find')}}</el-button>-->
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" :element-loading-text="$t('Searching')" border fit highlight-current-row>

      <el-table-column align="center" min-width="100" :label="$t('Merchandise_number')" prop="merchandiseSn"/>

      <el-table-column align="center" min-width="100" :label="$t('Product_name')" prop="name"/>

      <el-table-column align="center" min-width="100" :label="$t('Merchandise_picture')" prop="picUrl">
        <template slot-scope="scope">
          <img :src="scope.row.picUrl" width="40">
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('Price')" prop="sellingPrice"/>

      <el-table-column align="center" :label="$t('Number')" prop="number"/>

      <el-table-column align="center" label="单位" prop="unit"/>

      <el-table-column align="center" :label="$t('Operate')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-shop="false" v-permission="['GET /admin/merchandise/list']" type="primary" size="mini" @click="handleAdd(scope.row)">{{$t('Additional_comments')}}</el-button>
          <el-button v-shop="true" v-permission="['GET /admin/merchandise/list']" type="primary" size="mini" @click="handleApplying(scope.row)">{{$t('Additional_comments')}}</el-button>
          <el-button v-permission="['GET /admin/merchandise/update']" type="primary" size="mini" @click="handleEdit(scope.row)">{{$t('Details')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 补充库存对话框 -->
    <el-dialog :visible.sync="shipDialogVisible" title="补充库存">
      <el-form ref="merchandiseForm" :rules="rules" :model="merchandiseForm" status-icon label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="补充库存数量" prop="number">
          <el-input v-model.number="merchandiseForm.number"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="shipDialogVisible = false">{{$t('Cancel')}}</el-button>
        <el-button type="primary" @click="confirmAdd">{{$t('Confirm')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="merchandiseHQDialogVisible" title="总部货品列表">
      <el-table :data="merchandiseHQlist" :element-loading-text="$t('Searching')" border fit highlight-current-row>

        <el-table-column align="center" min-width="100" :label="$t('Merchandise_number')" prop="merchandiseSn"/>

        <el-table-column align="center" min-width="100" :label="$t('Product_name')" prop="name"/>

        <el-table-column align="center" min-width="100" :label="$t('Merchandise_picture')" prop="picUrl">
          <template slot-scope="scope">
            <img :src="scope.row.picUrl" width="40">
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('Price')" prop="sellingPrice"/>

        <el-table-column align="center" :label="$t('Number')" prop="number"/>

        <el-table-column align="center" label="单位" prop="unit"/>

        <el-table-column align="center" :label="$t('Operate')" width="100" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-permission="['GET /admin/merchandise/all']" type="primary" @click="handleApplying(scope.row)">{{$t('Restock_request')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="merchandiseHQDialogVisible = false">{{$t('Cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { listMerchandise, allMerchandise, merchandiseAddNumber } from '@/api/merchandise'
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
        number: undefined
      },
      rules: {
        number: [
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
      listMerchandise(this.listQuery).then(res => {
        this.list = res.data.data.list
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
          merchandiseAddNumber(this.merchandiseForm).then(response => {
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
    handleGetAllmerchandise() {
      allMerchandise().then(res => {
        this.merchandiseHQlist = res.data.data
        this.merchandiseHQDialogVisible = true
      })
    },
    handleDownload() {
      /*      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['订单ID', '订单编号', '用户ID', '订单状态', '是否删除', '收货人', '收货联系电话', '收货地址']
          const filterVal = ['id', 'orderSn', 'userId', 'orderStatus', 'isDelete', 'consignee', 'mobile', 'address']
          excel.export_json_to_excel2(tHeader, this.list, filterVal, '订单信息')
          this.downloadLoading = false
        })*/
    }
  }
}
</script>

<style scoped>

</style>
