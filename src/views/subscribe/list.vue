<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" :placeholder="$t('请输入名称')"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('Search')}}</el-button>
      <el-button v-permission="['POST /admin/subscribe/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">{{$t('Add')}}</el-button>
      <!--      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{$t('Find')}}</el-button>-->
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" :element-loading-text="$t('Searching')" border fit highlight-current-row>

      <el-table-column align="center" :label="$t('订阅配置名称')" prop="name"/>

      <el-table-column align="center" :label="$t('可订阅方式')" prop="methods">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.methods">{{filterMethod(item)}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('配送时间范围')" prop="timeRanges">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.timeRanges">{{item}}</el-tag>
        </template>
      </el-table-column>


<!--      <el-table-column align="center" :label="$t('配送星期限制')" prop="weeks">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.weeks">{{filterWeek(item)}}</el-tag>
        </template>
      </el-table-column>-->

      <el-table-column align="center" :label="$t('允许自动续订')" prop="members">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.autoSub" :disabled="true" :active-value="true" :nactive-value="false" active-color="#13ce66" inactive-color="#ff4949"/>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('Time_added')" prop="addTime"/>

      <el-table-column align="center" :label="$t('Operate')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['GET /admin/subscribe/read']" type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('详情')}}</el-button>
          <el-button v-permission="['DELETE /admin/subscribe/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">{{$t('Delete')}}</el-button>
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
  import BackToTop from '@/components/BackToTop'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import {listSubscribe, deleteSubscribe} from '@/api/subscribe'
  export default {
    name: "list",
    components: { BackToTop, Pagination },
    data(){
      return {
        list: [],
        total: 0,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 20,
          name: undefined,
          sort: 'add_time',
          order: 'desc'
        },
        weeks: ['', this.$t('星期一'), this.$t('星期二'), this.$t('星期三'), this.$t('星期四'), this.$t('星期五'), this.$t('星期六'), this.$t('星期日')]
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        listSubscribe(this.listQuery).then(response => {
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
        this.$router.push({ path: '/subscribe/create' })
      },
      handleUpdate(row) {
        this.$router.push({ path: '/subscribe/detail', query: { id: row.id }})
      },
      handleDelete(row) {
        this.$confirm(this.$t('Confirm_Delete?'), this.$t('Hint'), {
          confirmButtonText: this.$t('Confirm'),
          cancelButtonText: this.$t('Cancel'),
          type: 'warning'
        }).then(() => {
          this.doDelete(row)
        });
      },
      doDelete(row){
        deleteSubscribe(row.id).then(response => {
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
      filterMethod(method){
        if(method == 1){
          return this.$t('周')
        }else if(method == 2){
          return this.$t('月')
        }else{
          return this.$t('年')
        }
      },
      filterWeek(week){
        return this.weeks[week]
      }
    }
  }
</script>

<style scoped>

</style>
