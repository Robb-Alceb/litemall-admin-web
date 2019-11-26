<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.merchandiseSn" clearable class="filter-item" style="width: 200px;" placeholder="货号"/>
      <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" placeholder="货品名称"/>
      <el-button v-permission="['GET /admin/repository/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button v-permission="['POST /admin/merchandise/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column align="center" min-width="100" label="货号" prop="merchandiseSn"/>

      <el-table-column align="center" min-width="100" label="货品名称" prop="name"/>

      <el-table-column align="center" min-width="100" label="货品图片" prop="picUrl">
        <template slot-scope="scope">
          <img :src="scope.row.picUrl" width="40">
        </template>
      </el-table-column>

      <el-table-column align="center" label="价格" prop="sellingPrice"/>

      <el-table-column align="center" label="数量" prop="number"/>

      <el-table-column align="center" label="单位" prop="unit"/>

      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['GET /admin/merchandise/list']" type="primary" size="mini" @click="handleAdd(scope.row)">补充</el-button>
          <el-button v-permission="['GET /admin/merchandise/list']" type="primary" size="mini" @click="handleEdit(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 补充库存对话框 -->
    <el-dialog :visible.sync="shipDialogVisible" title="补充库存">
      <el-form :rules="rules" ref="merchandiseForm" :model="merchandiseForm" status-icon label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="补充库存数量" prop="number">
          <el-input v-model.number="merchandiseForm.number"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="shipDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { listMerchandise } from '@/api/repository' // Secondary package based on el-pagination
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
      rules:{
        number:[
          { required: true, message: '数量不能为空', trigger: 'change' },
          { type: 'number', message: '数量必须为数字', trigger: 'change' }
        ]
      },
      list: []
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
      this.merchandiseForm.merchandiseId = row.id
      this.merchandiseForm.number = undefined
      this.$nextTick(() => {
        this.$refs['merchandiseForm'].clearValidate()
      })
    },
    confirmAdd() {
      this.$refs['merchandiseForm'].validate(valid => {
        if (valid) {

        }
      })
      this.$nextTick(() => {
        this.$refs['merchandiseForm'].clearValidate()
      })
    },
    handleCreate() {
      this.$router.push({ path: '/repository/create' })
    },
    handleEdit(row){
      this.$router.push({ path: '/repository/edit',query:{id:row.id} })
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
