<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.key" clearable class="filter-item" style="width: 200px;" :placeholder="$t('请输入关键字')"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('Search')}}</el-button>

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleAdd">{{$t('Add')}}</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" :element-loading-text="$t('Searching')" border fit highlight-current-row>
      <el-table-column align="center" :label="$t('关键字')" prop="key"/>

<!--      <template slot-scope="scope">
        <el-table-column v-for="item in scope.row.i18ns" align="center" :label="langMap[item.type]">
          <div @click="handleEdit(item)">
            {{item.value}}
          </div>
        </el-table-column>
      </template>-->
<!--      <template slot="header" slot-scope="scope">-->
        <el-table-column v-for="(value,key) in langMap" align="center" :label="value">
          <template slot-scope="scope">
            <div v-if="findObj(scope.row.i18ns, key)" @click="handleEdit(scope.row.i18ns, key)" :title="$t('修改')" style="cursor: pointer">
              {{ filterI18nTypeValue(scope.row.i18ns, key)}}
            </div>
            <div v-else style="cursor: pointer">
              <el-tag @click="handleCreate(scope.row.key)">{{$t('设置')}}</el-tag>
            </div>
          </template>
        </el-table-column>
<!--      </template>-->
      <el-table-column align="center" :label="$t('Operate')" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['DELETE /admin/i18n/delete']" type="danger" size="small" @click="handleDelete(scope.row)">{{$t('删除')}}</el-button>
<!--          <el-button v-permission="['POST /admin/i18n/create']" type="primary" size="small" @click="handleCreate(scope.row)">{{$t('增加')}}</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 编辑,添加国际化对话框 -->
    <el-dialog :visible.sync="i18nDialogVisible">
      <el-form ref="i18nForm" :model="i18nForm" :rules="rules" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('关键字')" prop="code">
          <el-input v-if="dialogType == 3" v-model="i18nForm.key"></el-input>
          <el-input v-else v-model="i18nForm.key" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('语言类型')" prop="type">
          <el-select v-model="i18nForm.type">
            <el-option value="en" :label="$t('English')"></el-option>
            <el-option value="cn" :label="$t('中文')"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('值')" prop="value">
          <el-input v-model.number="i18nForm.value" >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="i18nDialogVisible = false">{{$t('Cancel')}}</el-button>
        <el-button v-if="dialogType == 1 || dialogType == 3" type="primary" @click="i18nConfirm">{{$t('Confirm')}}</el-button>
        <el-button v-if="dialogType == 2" v-permission="['PUT /admin/i18n/put']" type="warning" @click="i18nUpdate">{{$t('修改')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {listI18n, updateI18n, createI18n, deleteI18nByKey} from '@/api/i18n'
  import BackToTop from '@/components/BackToTop'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  export default {
    name: "i18n",
    components:{
      BackToTop, Pagination
    },
    data() {
      const langMap = {
        'en': this.$t('English'),
        'cn': this.$t('中文简体')
      }
      return {
        langMap,
        list: [],
        total: 0,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 20,
          key: undefined,
          sort: 'add_time',
          order: 'desc'
        },
        i18nForm: {},
        i18nDialogVisible: false,
        dialogType: 1,
        rules:{}
      }
    },
    created(){
      this.getList()
    },
    methods: {
      getList(){
        listI18n(this.listQuery).then(response => {
          this.list = response.data.data.list
          this.total = response.data.data.total
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      },
      handleFilter(){
        this.getList()
      },
      handleEdit(list, type){
        this.i18nForm = this.findObj(list, type)
        this.dialogType = 2
        this.i18nDialogVisible = !this.i18nDialogVisible
      },
      handleDelete(row){
        this.$confirm(this.$t('Confirm_Delete?'), this.$t('Hint'), {
          confirmButtonText: this.$t('Confirm'),
          cancelButtonText: this.$t('Cancel'),
          type: 'warning'
        }).then(() => {
          this.doDelete(row).then(response => {
            this.$notify.success({
              title: this.$t('Success!'),
              message: this.$t('Deleted')
            })
            this.getList()
          }).catch(response => {
            this.$notify.error({
              title: this.$t('Failed'),
              message: response.data.errmsg
            })
          })
        });
      },
      doDelete(row){
        deleteI18nByKey(row.key)
      },
      handleCreate(key){
        this.i18nForm.key = key
        this.dialogType = 1
        this.i18nDialogVisible = !this.i18nDialogVisible
      },
      i18nConfirm(){
        createI18n(this.i18nForm).then(response => {
          this.$notify.success({
            title: this.$t('Success!'),
            message: this.$t('Success!')
          })
          this.i18nDialogVisible = !this.i18nDialogVisible
          this.getList()
        }).catch(response => {
          this.$notify.error({
            title: this.$t('Failed'),
            message: response.data.errmsg
          })
        })
      },
      i18nUpdate(){
        updateI18n(this.i18nForm).then(response => {
          this.$notify.success({
            title: this.$t('Success!'),
            message: this.$t('Success!')
          })
          this.i18nDialogVisible = !this.i18nDialogVisible
          this.getList()
        }).catch(response => {
          this.$notify.error({
            title: this.$t('Failed'),
            message: response.data.errmsg
          })
        })
      },
      filterI18nTypeValue(list, type){
        let obj = this.findObj(list, type)
        if(obj){
          return obj.value
        }
        return ""
      },
      findObj(list, type){
        return _.find(list, i18n=>{
          return i18n.type == type
        });
      },
      handleAdd(){
        this.dialogType = 3
        this.i18nDialogVisible = !this.i18nDialogVisible
      }
    }
  }
</script>

<style scoped>

</style>
