<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" :placeholder="$t('请输入礼物卡名称')"/>
      <el-button v-permission="['GET /admin/giftcard/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('Search')}}</el-button>
      <el-button v-permission="['POST /admin/giftcard/create']" class="filter-item" type="primary" icon="el-icon-search" @click="handleCreate">{{$t('Create')}}</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" :element-loading-text="$t('Searching')" border fit highlight-current-row>

      <el-table-column align="center" :label="$t('礼物卡名称')" prop="name"/>

      <el-table-column align="center" :label="$t('礼物卡图片')" prop="picUrl">
        <template slot-scope="scope">
          <img :src="scope.row.picUrl" width="40px" height="40px">
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('礼物卡类型')" prop="type">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type == 1 ? 'success' : 'error' ">{{ typeMap[scope.row.type]}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('礼物卡描述')" prop="desc"/>

      <el-table-column align="center" :label="$t('添加时间')" prop="addTime"/>


      <el-table-column align="center" :label="$t('Operate')" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['GET /admin/giftcard/detail']" type="primary" size="mini" @click="handleDetail(scope.row)">{{$t('Details')}}</el-button>
          <el-button v-permission="['POST /admin/giftcard/update']" type="info" size="mini" @click="handleEdit(scope.row)">{{$t('Edit')}}</el-button>
          <el-button v-permission="['DELETE /admin/giftcard/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">{{$t('Delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-tooltip placement="top" :content="$t('Back_to_top')">
      <back-to-top :visibility-height="100" />
    </el-tooltip>
  </div>
</template>
<script>
  import ElSelectDropdown from 'element-ui/packages/select/src/select-dropdown'
  import BackToTop from '@/components/BackToTop'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import { listGiftCard, deleteGiftCard } from "@/api/gift";

  export default {
    name: "giftCardList",
    components: { ElSelectDropdown, BackToTop, Pagination },
    data() {
      const typeMap = ['','全场通用']
      return {
        typeMap,
        list: [],
        total: 0,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 20,
          name: undefined,
          sort: 'add_time',
          order: 'desc'
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList(){
        this.listLoading = true
        listGiftCard(this.listQuery).then(response => {
          this.list = response.data.data.list
          this.total = response.data.data.total
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      },
      handleDelete(row){
        this.$confirm(this.$t('Confirm_Delete?'), this.$t('Hint'), {
          confirmButtonText: this.$t('Confirm'),
          cancelButtonText: this.$t('Cancel'),
          type: 'warning'
        }).then(() => {
          this.doDelete(row)
        });
      },
      doDelete(row){
        deleteGiftCard(row.id).then(response => {
          this.$notify.success({
            title: this.$t('Success!'),
            message: this.$t('Deleted')
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        }).catch(response => {
          this.$notify.error({
            title: this.$t('Failed'),
            message: response.data.errmsg
          })
        })
      },
      handleFilter(){
        this.getList()
      },
      handleCreate(){
        this.$router.push({path:'/promotion/giftcard/create'})
      },
      handleEdit(row){
        this.$router.push({path: '/promotion/giftcard/edit',query:{id: row.id}})
      },
      handleDetail(row){
        this.$router.push({path: '/promotion/giftcard/detail',query:{id: row.id}})
      }
    }
  }
</script>

<style scoped>

</style>
