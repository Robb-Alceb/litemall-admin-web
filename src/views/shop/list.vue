<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入门店名称"/>
      <el-select v-model="listQuery.status" clearable class="filter-item" placeholder="请选择">
        <el-option :value="1" label="正在运营"/>
        <el-option :value="2" label="正在装修"/>
        <el-option :value="3" label="歇业"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column align="center" label="门店名称" prop="name"/>

      <el-table-column align="center" label="门店位置" prop="address"/>

      <el-table-column align="center" label="门店店长" prop="shopkeeper"/>

      <el-table-column align="center" label="成员" prop="members"/>

      <el-table-column align="center" label="添加时间" prop="addTime"/>

      <el-table-column align="center" label="运营状态" prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isNew ? 'success' : 'error' ">{{ scope.row.isNew ? '新品' : '非新品' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" prop="ops">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isNew ? 'success' : 'error' ">{{ scope.row.isNew ? '新品' : '非新品' }}</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <!--<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />-->

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibility-height="100" />
    </el-tooltip>

  </div>
</template>

<script>
import ElSelectDropdown from 'element-ui/packages/select/src/select-dropdown'
export default {
  name: 'ShopList',
  components: { ElSelectDropdown },
  data() {
    return {
      list: [{
        name: '门店1',
        address: '深圳市',
        addTime: '2019-11-01 12:12:02',
        status: 1,
        ops: ['详情']
      }],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        status: undefined,
        name: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      goodsDetail: '',
      detailDialogVisible: false,
      downloadLoading: false
    }
  }
}
</script>

<style scoped>

</style>
