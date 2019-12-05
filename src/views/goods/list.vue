<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.goodsSn" clearable class="filter-item" style="width: 200px;" placeholder="请输入商品编号"/>
      <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入商品名称"/>
      <el-button v-permission="['GET /admin/goods/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button v-permission="['POST /admin/goods/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column align="center" label="商品编号" prop="goodsSn"/>

      <el-table-column align="center" min-width="100" label="名称" prop="name"/>

      <el-table-column align="center" property="iconUrl" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.picUrl" width="40">
        </template>
      </el-table-column>

      <!--      <el-table-column align="center" property="iconUrl" label="分享图">
        <template slot-scope="scope">
          <img :src="scope.row.shareUrl" width="40">
        </template>
      </el-table-column>-->

      <!--      <el-table-column align="center" label="详情" prop="detail">
        <template slot-scope="scope">
          <el-dialog :visible.sync="detailDialogVisible" title="商品详情">
            <div v-html="goodsDetail"/>
          </el-dialog>
          <el-button type="primary" size="mini" @click="showDetail(scope.row.detail)">查看</el-button>
        </template>
      </el-table-column>-->

      <!--<el-table-column align="center" label="专柜价格" prop="counterPrice"/>-->

      <el-table-column align="center" label="价格" prop="retailPrice"/>

<!--      <el-table-column align="center" label="货号" prop="goodsNum"/>-->

      <el-table-column align="center" label="标签">
        <template slot-scope="scope">
          <el-row>
            <span>上架:</span>
            <el-switch :disabled="true" v-model="scope.row.isOnSale" :active-value="true" :nactive-value="false" active-color="#13ce66" inactive-color="#ff4949"/>
          </el-row>
          <el-row>
            <span>新品:</span>
            <el-switch :disabled="true" v-model="scope.row.isNew" :active-value="true" :nactive-value="false" active-color="#13ce66" inactive-color="#ff4949"/>
          </el-row>
          <el-row>
            <span>推荐:</span>
            <el-switch :disabled="true" v-model="scope.row.isHot" :active-value="true" :nactive-value="false" active-color="#13ce66" inactive-color="#ff4949"/>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column align="center" label="上架时间" prop="addTime"/>

      <el-table-column align="center" label="库存" prop="number"/>

      <el-table-column align="center" label="销量" prop="sales"/>

      <el-table-column align="center" label="审核状态" prop="reviewType">
        <template slot-scope="scope">
          {{ scope.row.reviewType | reviewFilter }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-row>
            <el-button type="primary" size="mini" :disabled="isShowReview(scope.row.reviewType)" @click="handleReview(scope.row)">审核</el-button>
            <el-button type="primary" size="mini" @click="handleLog(scope.row)">日志</el-button>
          </el-row>
          <el-row style="margin-top: 5px;">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibility-height="100" />
    </el-tooltip>

    <el-dialog :visible.sync="reviewDialogVisiable" title="商品审核">
      <el-form ref="reviewForm" :model="reviewForm" status-icon label-position="left" label-width="100px">
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="reviewForm.goodsName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="备注信息" prop="content">
          <el-input type="textarea" v-model="reviewForm.content"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reviewDialogVisiable = false">取消</el-button>
        <el-button @click="reviewHandleReject()" type="danger">不通过</el-button>
        <el-button @click="reviewHandlePass()" type="primary">通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style>
  .table-expand {
    font-size: 0;
  }
  .table-expand label {
    width: 100px;
    color: #99a9bf;
  }
  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
  }
  .gallery {
    width: 80px;
    margin-right: 10px;
  }
</style>

<script>
import { listGoods, deleteGoods, approveGoods, rejectGoods } from '@/api/goods'
import BackToTop from '@/components/BackToTop'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const reviewMap = {
  1: '待审核',
  2: '已审核',
  3: '已拒绝'
}
export default {
  name: 'GoodsList',
  components: { BackToTop, Pagination },
  filters: {
    reviewFilter(review) {
      return reviewMap[review]
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        goodsSn: undefined,
        name: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      reviewForm:{
        id:undefined,
        goodsSn:undefined,
        goodsName:undefined,
        content:undefined,
        type:undefined
      },
      goodsDetail: '',
      detailDialogVisible: false,
      downloadLoading: false,
      reviewDialogVisiable:false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listGoods(this.listQuery).then(response => {
        console.log(response.data.data.list)
        this.list = response.data.data.list
        this.total = response.data.data.total

        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {
      this.$router.push({ path: '/goods/create' })
    },
    handleUpdate(row) {
      this.$router.push({ path: '/goods/edit', query: { id: row.id }})
    },
    showDetail(detail) {
      this.goodsDetail = detail
      this.detailDialogVisible = true
    },
    handleDelete(row) {
      this.$confirm('是否删除商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doDelete(row)
      });
    },
    doDelete(row){
      deleteGoods(row).then(response => {
        this.$notify.success({
          title: '成功',
          message: '删除成功'
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      }).catch(response => {
        this.$notify.error({
          title: '失败',
          message: response.data.errmsg
        })
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['商品ID', '商品编号', '名称', '专柜价格', '当前价格', '是否新品', '是否热品', '是否在售', '首页主图', '宣传图片列表', '商品介绍', '详细介绍', '商品图片', '商品单位', '关键字', '类目ID', '品牌商ID']
        const filterVal = ['id', 'goodsSn', 'name', 'counterPrice', 'retailPrice', 'isNew', 'isHot', 'isOnSale', 'listPicUrl', 'gallery', 'brief', 'detail', 'picUrl', 'goodsUnit', 'keywords', 'categoryId', 'brandId']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '商品信息')
        this.downloadLoading = false
      })
    },
    handleLog(row) {
      this.$router.push({ path: '/goods/logs', query: { id: row.id }})
    },
    handleReview(row) {
      this.reviewForm.goodsName = row.name
      this.reviewForm.id = row.id
      this.reviewForm.goodsSn = row.goodsSn
      this.reviewDialogVisiable = true
    },
    reviewHandlePass(){
      this.reviewForm.type = 2
      approveGoods(this.reviewForm).then(res=>{
        this.$notify.success({
          title: '成功',
          message: '审核成功'
        })
        this.getList()
        this.reviewDialogVisiable = false
      }).catch(response => {
        this.$notify.error({
          title: '失败',
          message: response.data.errmsg
        })
      })
    },
    reviewHandleReject(){
      this.reviewForm.type = 3
      rejectGoods(this.reviewForm).then(res=>{
        this.$notify.success({
          title: '成功',
          message: '审核成功'
        })
        this.getList()
        this.reviewDialogVisiable = false
      }).catch(response => {
        this.$notify.error({
          title: '失败',
          message: response.data.errmsg
        })
      })
    },
    isShowReview(reviewType){
      if(reviewType == 1){
        return false
      }else{
        return true;
      }
    }
  }
}
</script>
