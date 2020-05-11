<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" :placeholder="$t('Please_enter_operating_controller')"/>
      <el-button v-permission="['GET /admin/log/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('Search')}}</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" :element-loading-text="$t('Searching')" border fit highlight-current-row>
      <el-table-column align="center" :label="$t('Operating_Controller')" prop="admin"/>
      <el-table-column align="center" label="IP地址" prop="ip"/>
      <el-table-column align="center" :label="$t('Operating_time')" prop="addTime"/>
      <el-table-column align="center" :label="$t('Operating_Category')" prop="type">
        <template slot-scope="scope">
          <el-tag>{{ typeFilter(scope.row.type)  }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('Operating_action')" prop="action"/>
      <el-table-column align="center" :label="$t('Operating_status')" prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status ? 'success' : 'error' ">{{ scope.row.status ? $t('Success!') : $t('Failed') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('Operating_results')" prop="result"/>
      <el-table-column align="center" :label="$t('Notes_info')" prop="comment"/>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { listLog } from '@/api/log'
import Pagination from '@/components/Pagination'



export default {
  name: 'Log',
  components: { Pagination },
  filters: {

  },
  data() {
    const typeMap = {
      0: this.$t('Normal_operations'),
      1: this.$t('Safety_operations'),
      2: this.$t('Tickets_operations'),
      3: this.$t('Other_operations')
    }
    return {
      typeMap,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      rules: {
        name: [
          { required: true, message: this.$t('Role_name_cannot_be_empty'), trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    typeFilter(type) {
      return this.typeMap[type]
    },
    getList() {
      this.listLoading = true
      listLog(this.listQuery)
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
    }
  }
}
</script>
