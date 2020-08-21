<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.code" clearable class="filter-item" style="width: 200px;" :placeholder="$t('请输入code')"/>
<!--      <el-input v-model="listQuery.mobile" clearable class="filter-item" style="width: 200px;" placeholder="请输入手机号"/>-->
      <region :options="regionSearchOptions"></region>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('Search')}}</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleAdd">{{$t('Add')}}</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" :element-loading-text="$t('Searching')" border fit highlight-current-row>
<!--      <el-table-column align="center" width="100px" :label="$t('Member_ID')" prop="id" sortable="custom"/>-->

      <el-table-column align="center" :label="$t('区域名')" prop="regionNameCn" sortable="custom">
        <template slot-scope="scope">
          <el-tag >{{ scope.row.name || scope.row.regionNameCn || scope.row.regionNameEn }}</el-tag>
        </template>
      </el-table-column>

<!--      <el-table-column align="center" :label="$t('税率名称')" prop="name" sortable="custom"/>-->

      <el-table-column align="center" :label="$t('税率代码')" prop="code"/>

      <el-table-column align="center" :label="$t('税率类型')" prop="type">
        <template slot-scope="scope">
          <el-tag >{{ typeDic[scope.row.type] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="税率值" prop="value">
      </el-table-column>

      <el-table-column align="center" label="启用" prop="enable">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.enable" v-permission="['PUT /admin/tax/enable']" @change="handleEnable(scope.row)" :active-value="true" :nactive-value="false" active-color="#13ce66" inactive-color="#ff4949"/>
        </template>
      </el-table-column>


      <el-table-column align="center" :label="$t('Operate')" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/tax/update']" type="primary" size="small" @click="handleEdit(scope.row)">{{$t('编辑')}}</el-button>
          <el-button v-permission="['DELETE /admin/tax/delete']" type="danger" size="small" @click="handleDelete(scope.row)">{{$t('删除')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getTaxes" />

    <!-- 创建、编辑税费对话框 -->
    <el-dialog :visible.sync="taxDialogVisible" :title="dialogTitle">
      <el-form ref="taxForm" :model="taxForm" :rules="rules" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
<!--        <el-form-item :label="$t('名称')" prop="name">
          <el-input v-model="taxForm.name" :placeholder="$t('税率名称')" />
        </el-form-item>-->
<!--        <el-form-item :label="$t('区域')" prop="region">
          <el-cascader
            :placeholder="$t('区域')"
            class="filter-item"
            v-model="taxForm.regionId"
            :options="countrys"
            @active-item-change="handleItemChange"
            :props="props"
            clearable
          ></el-cascader>
        </el-form-item>-->
        <el-form-item v-if="dialogType == 1" :label="$t('区域')" prop="regionId">
          <region :options="regionOptions" ></region>
        </el-form-item>
        <el-form-item :label="$t('税率代码')" prop="code">
          <el-select v-model="taxForm.code">
            <el-option value="GST" label="GST"></el-option>
            <el-option value="PST" label="PST"></el-option>
            <el-option value="HST" label="HST"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('税率类型')" prop="type">
          <el-select v-model="taxForm.type">
            <el-option :value="1" label="国税"></el-option>
            <el-option :value="2" label="省税"></el-option>
            <el-option :value="3" label="地方税"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('税率值')" prop="value">
          <el-input v-model.number="taxForm.value" :placeholder="$t('税率值')" >
            <template slot="append"> {{$t('%')}}</template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('启用')" prop="enable">
          <el-checkbox v-model="taxForm.enable" :label="$t('启用')"></el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="taxDialogVisible = false">{{$t('Cancel')}}</el-button>
        <el-button v-if="dialogType == 1" type="primary" @click="taxConfirm">{{$t('Confirm')}}</el-button>
        <el-button v-if="dialogType == 2" type="warning" @click="taxUpdate">{{$t('修改')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import Region from '@/components/Region'
  import { listTaxes, createTax, deleteTax, updateTax, enableTax } from '@/api/tax'
  import { getParentIds } from '@/api/region'
  import BackToTop from '@/components/BackToTop'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  export default {
    name: "tax",
    components:{
      Region,BackToTop, Pagination
    },
    data(){
      return {
        listLoading: true,
        total:0,
        listQuery: {
          page: 1,
          limit: 20,
          code: undefined,
          regionId:undefined,
          sort: 'add_time',
          order: 'desc'
        },
        typeDic: ['', '国税', '省税', '地方税'],
        dialogTitle: this.$t('编辑'),
        dialogType: 1,
        taxDialogVisible: false,
        taxForm: {},
        list: [],
        regionOptions: {
        },
        regionSearchOptions: {},
        rules:{
          regionId: [
            { required: true, message: this.$t('区域不能为空'), trigger: 'blur' }
          ],
          code: [
            { required: true, message: this.$t('税率代码不能为空'), trigger: 'blur' }
          ],
          type: [
            { required: true, message: this.$t('税率类型不能为空'), trigger: 'blur' }
          ],
          value: [
            { required: true, message: this.$t('税率值不能为空'), trigger: 'blur' }
          ],
        }
      }
    },
    created() {
      this.getTaxes()
    },
    methods: {
      getTaxes(){
        listTaxes(this.listQuery)
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
      handleFilter(){
        this.getTaxes()
      },
      taxConfirm(){
        this.taxForm.regionId = this.regionOptions.regionIds[this.regionOptions.regionIds.length - 1]
        createTax(this.taxForm).then(response => {
          this.taxDialogVisible = false
          this.$notify.success({
            title: this.$t('Success!'),
            message: this.$t('Success!')
          })
          this.getTaxes()
        }).catch(response => {
          this.$notify.error({
            title: this.$t('Failed'),
            message: response.data.errmsg
          })
        })
      },
      taxUpdate(){
        updateTax(this.taxForm).then(response => {
          this.taxDialogVisible = false
          this.$notify.success({
            title: this.$t('Success!'),
            message: this.$t('Success!')
          })
          this.getTaxes()
        }).catch(response => {
          this.$notify.error({
            title: this.$t('Failed'),
            message: response.data.errmsg
          })
        })
      },
      handleAdd(){
        this.dialogType = 1
        this.dialogTitle = this.$t('添加')
        this.taxDialogVisible = !this.taxDialogVisible
        this.resetForm()
      },
      resetForm(){
        this.taxForm = {}
      },
      handleEdit(row){
        getParentIds(row.regionId).then(response=>{
          this.regionOptions.regionIds = response.data.data
          this.dialogType = 2
          this.dialogTitle = this.$t('编辑')
          this.taxDialogVisible = !this.taxDialogVisible
          this.taxForm = row
        })
      },
      handleEnable(row){
        enableTax(row).then(response => {
          this.taxDialogVisible = false
          this.$notify.success({
            title: this.$t('Success!'),
            message: this.$t('Success!')
          })
        }).catch(response => {
          this.$notify.error({
            title: this.$t('Failed'),
            message: response.data.errmsg
          })
        })
      }
    },
    watch: {
      'regionOptions.regionIds': function(newVal, oldVal) {
        // if(newVal && newVal.length > 0){
          this.taxForm.regionId = this.regionOptions.regionIds[this.regionOptions.regionIds.length - 1]
        // }
      },
      'regionSearchOptions.regionIds': function(newVal, oldVal) {
        if(newVal && newVal.length > 0){
          this.listQuery.regionId = this.regionSearchOptions.regionIds[this.regionSearchOptions.regionIds.length - 1]
        }else{
          this.listQuery.regionId = undefined
        }
      }
    }
  }
</script>

<style scoped>

</style>
