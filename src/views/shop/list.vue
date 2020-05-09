<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" :placeholder="$t('Please_enter_store_name')"/>
      <el-input v-model="listQuery.address" clearable class="filter-item" style="width: 200px;" :placeholder="$t('请输入详细地址')"/>
      <el-cascader
        :placeholder="$t('请选择区域地址')"
        class="filter-item"
        v-model="listQuery.regionIds"
        :options="countrys"
        @active-item-change="handleItemChange"
        :props="props"
        clearable
      ></el-cascader>
      <el-select v-model="listQuery.status" clearable class="filter-item" :placeholder="this.$t('Please_select')">
        <el-option :value="1" :label="$t('Open_for_business')"/>
        <el-option :value="2" :label="$t('Closed')"/>
        <el-option :value="3" :label="$t('Renovating')"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('Search')}}</el-button>
      <el-button v-permission="['POST /admin/shop/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">{{$t('Add')}}</el-button>
<!--      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{$t('Find')}}</el-button>-->
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" :element-loading-text="$t('Searching')" border fit highlight-current-row>

      <el-table-column align="center" :label="$t('Store_name')" prop="name"/>

      <el-table-column align="center" :label="$t('Store_address')" prop="streetAddress">
        <template slot-scope="scope">
          <span v-if="scope.row.regions" v-for="item in scope.row.regions">
              {{item.nameCn}}
          </span>
          <span>{{scope.row.streetAddress}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('Store_Manager')" prop="shopkeeper"/>

      <el-table-column align="center" :label="$t('Partners')" prop="members"/>

      <el-table-column align="center" :label="$t('Time_added')" prop="addTime"/>

      <el-table-column align="center" :label="$t('Operation_Status')" prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status != 1 ? 'success' : 'error' ">{{ consStatus[scope.row.status]}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('Operate')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['GET /admin/shop/detail']" type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('Details')}}</el-button>
          <el-button v-permission="['DELETE /admin/shop/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">{{$t('Delete')}}</el-button>
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
  import { listShop, deleteShop } from '@/api/shop'
  import BackToTop from '@/components/BackToTop'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import { listCountryRegion, listSubRegion } from '@/api/region'
export default {
  name: 'ShopList',
  components: { ElSelectDropdown, BackToTop, Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        status: undefined,
        name: undefined,
        address: undefined,
        regionIds:undefined,
        sort: 'add_time',
        order: 'desc'
      },
      goodsDetail: '',
      detailDialogVisible: false,
      downloadLoading: false,
      consStatus:['',this.$t('Open_for_business'), this.$t('Closed'), this.$t('Renovating')],
/*      options: [{
        value:'1',
        label: '江苏',
        cities: [{label:'南京',value:2}]
      }, {
        value:'1',
        label: '浙江',
        cities: []
      }],*/
      props: {
        value:'id',
        label: 'nameCn',
        children: 'children',
        checkStrictly: true
      },
      countrys:[]
    }
  },
  created() {
    this.getList()
    this.getCountrys()
  },
  methods: {
    getList() {
      this.listLoading = true
      let param = _.clone(this.listQuery);
      if(param.regionIds){
        param.regionId = this.listQuery.regionIds[this.listQuery.regionIds.length-1]
      }
      delete param.regionIds
      listShop(param).then(response => {
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
      this.$router.push({ path: '/shop/create' })
    },
    handleUpdate(row) {
      this.$router.push({ path: '/shop/overview', query: { id: row.shopId }})
    },
    showDetail(detail) {
      this.goodsDetail = detail
      this.detailDialogVisible = true
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
      deleteShop(row.shopId).then(response => {
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
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['门店名称', '门店地址', '门店店长', '成员', '添加时间', '运营状态']
        const filterVal = ['name', 'address', 'shopkeeper', 'members', 'addTime', 'status']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '门店信息')
        this.downloadLoading = false
      })
    },
    handleItemChange(val) {
      let step = val.length
      console.log('active item:', val);
      let query = {
        id: val[val.length-1],
        type: 1
      }
      listSubRegion(query).then(response=>{
        // val.children = response.data.data.list
        let result = this.findObject(this.countrys, val)
        console.log(result)
        response.data.data.list.forEach(child=>{
          if(step <= 2){
            result.children.push(this._.defaults(child,{children:[]}))
          }else{
            result.children.push(child)
          }
        })
      })
/*      setTimeout(_ => {
        if (val.indexOf('江苏') > -1 && !this.options2[0].cities.length) {
          this.options2[0].cities = [{
            label: '南京'
          }];
        } else if (val.indexOf('浙江') > -1 && !this.options2[1].cities.length) {
          this.options2[1].cities = [{
            label: '杭州'
          }];
        }
      }, 300);*/
    },
    getCountrys(){
      listCountryRegion().then(response=>{
        this.countrys = response.data.data.list.map(function(country){
          return _.defaults(country,{children:[]})
        })
      })
    },
    findObject(arr, ids){
      // let result = undefined
      for(let i=0;i<=arr.length-1;i++){
        let obj = arr[i]
        if(ids.length == 1 && obj.id == ids[0]){
          return obj;
        }else if(obj.id == ids[0]){
          ids.shift()
          return this.findObject(obj.children, ids)
        }
      }
/*      arr.forEach(obj=>{
        if(ids.length == 1 && obj.id == ids[0]){

          result = obj;
        }else if(obj.id == ids[0]){
          ids.shift()
          return this.findObject(obj.children, ids)
        }
      })
      return result*/
    }
  }
}
</script>

<style scoped>

</style>
