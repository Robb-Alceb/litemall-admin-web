<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.question" clearable class="filter-item" style="width: 200px;" placeholder="请输入问题"/>
      <el-button v-permission="['GET /admin/issue/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('Search')}}</el-button>
      <el-button v-permission="['POST /admin/issue/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">{{$t('Add')}}</el-button>
<!--      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{$t('Find')}}</el-button>-->
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" :element-loading-text="$t('Searching')" border fit highlight-current-row>
      <el-table-column align="center" width="100px" label="问题ID" prop="id" sortable/>

      <el-table-column align="center" min-width="200px" label="问题内容" prop="question"/>

      <el-table-column align="center" min-width="400px" label="问题回复" prop="answer"/>

      <el-table-column align="center" :label="$t('Operate')" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/issue/update']" type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('Edit')}}</el-button>
          <el-button v-permission="['POST /admin/issue/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">{{$t('Delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="问题" prop="question">
          <el-input v-model="dataForm.question"/>
        </el-form-item>
        <el-form-item :label="$t('Undo')" prop="answer">
          <el-input v-model="dataForm.answer" :rows="8" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('Cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('Confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('Confirm')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listIssue, createIssue, updateIssue, deleteIssue } from '@/api/issue'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Issue',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        question: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        question: '',
        answer: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: this.$t('Edit'),
        create: this.$t('Create')
      },
      rules: {
        question: [{ required: true, message: '问题不能为空', trigger: 'blur' }],
        answer: [{ required: true, message: '回复不能为空', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listIssue(this.listQuery).then(response => {
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
    resetForm() {
      this.dataForm = {
        id: undefined,
        question: '',
        answer: ''
      }
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createIssue(this.dataForm).then(response => {
            this.list.unshift(response.data.data)
            this.dialogFormVisible = false
            this.$notify.success({
              title: this.$t('Success!'),
              message: this.$t('Creation_successful')
            })
          }).catch(response => {
            this.$notify.error({
              title: this.$t('Failed'),
              message: response.data.errmsg
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateIssue(this.dataForm).then(() => {
            for (const v of this.list) {
              if (v.id === this.dataForm.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.dataForm)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify.success({
              title: this.$t('Success!'),
              message: this.$t('Update_Successful')
            })
          }).catch(response => {
            this.$notify.error({
              title: this.$t('Failed'),
              message: response.data.errmsg
            })
          })
        }
      })
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
    doDelete(row) {
      deleteIssue(row).then(response => {
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
        const tHeader = ['问题ID', '问题内容', '问题回复']
        const filterVal = ['id', 'question', 'answer']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '常见问题信息')
        this.downloadLoading = false
      })
    }
  }
}
</script>
