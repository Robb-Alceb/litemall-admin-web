<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-button v-permission="['POST /admin/category/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">{{$t('Add')}}</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" :element-loading-text="$t('Searching')" border fit highlight-current-row row-key="id">

<!--      <el-table-column align="center" label="类目ID" prop="id"/>-->

      <el-table-column align="center" label="类目名" prop="name"/>

      <el-table-column align="center" property="iconUrl" :label="$t('Category_Label')">
        <template slot-scope="scope">
          <img v-if="scope.row.iconUrl" :src="scope.row.iconUrl" width="40">
        </template>
      </el-table-column>

      <el-table-column align="center" property="picUrl" :label="$t('Category_Image')">
        <template slot-scope="scope">
          <img v-if="scope.row.picUrl" :src="scope.row.picUrl" width="80">
        </template>
      </el-table-column>

<!--      <el-table-column align="center" label="关键字" prop="keywords"/>-->

      <el-table-column align="center" min-width="100" label="简介" prop="desc"/>

      <el-table-column align="center" :label="$t('Level')" prop="level">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level === 'L1'" type="primary">{{$t('Category_Level_1')}}</el-tag>
          <el-tag v-if="scope.row.level === 'L2'" type="info">{{$t('Category_Level_2')}}</el-tag>
          <el-tag v-if="scope.row.level === 'L3'" type="warning">{{$t('Category_Level_3')}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('Operate')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/category/update']" type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('Edit')}}</el-button>
          <el-button v-permission="['POST /admin/category/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">{{$t('Delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('Category_Name')" prop="name">
          <el-input v-model="dataForm.name"/>
        </el-form-item>
<!--        <el-form-item label="关键字" prop="keywords">
          <el-input v-model="dataForm.keywords"/>
        </el-form-item>-->
        <el-form-item :label="$t('Level')" prop="level">
          <el-select v-model="dataForm.level" @change="onLevelChange">
            <el-option :label="$t('Category_Level_1')" value="L1"/>
            <el-option :label="$t('Category_Level_2')" value="L2"/>
            <el-option :label="$t('Category_Level_3')" value="L3"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="dataForm.level === 'L2'" :label="$t('Main_Category')" prop="pid">
          <el-select v-model="dataForm.pid">
            <el-option v-for="item in catL1" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('Main_Category')" v-show="dataForm.level === 'L3'">
          <el-cascader :options="categoryList" v-model="categoryIds" expand-trigger="hover" @change="handleCategoryChange"/>
        </el-form-item>
        <el-form-item :label="$t('Category_Label')" prop="iconUrl">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="true"
            :on-success="uploadIconUrl"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif">
            <img v-if="dataForm.iconUrl" :src="dataForm.iconUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
            <label v-if="dataForm.iconUrl" class="el-upload-list__item-status-label avatar-uploader__status_label" @click.stop="handleRemove()"><i class="el-icon-delete"></i></label>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('Category_Image')" prop="picUrl">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadPicUrl"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif">
            <img v-if="dataForm.picUrl" :src="dataForm.picUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
            <label v-if="dataForm.picUrl" class="el-upload-list__item-status-label avatar-uploader__status_label" @click.stop="handlePicRemove()"><i class="el-icon-delete"></i></label>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('Category_description')" prop="desc">
          <el-input v-model="dataForm.desc"/>
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

<style scoped>
.filter-item{
  margin-left: 100px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 145px;
  height: 145px;
  display: block;
}
.avatar-uploader__status_label{
  display: block;
  color: red;
  cursor: pointer;
}
</style>

<script>
import { listCategory, listCatL1, createCategory, updateCategory, deleteCategory } from '@/api/category'
import { uploadPath } from '@/api/storage'
import { getToken } from '@/utils/auth'
import { listCatL2 } from '@/api/category'
import Editor from '@tinymce/tinymce-vue'

export default {
  name: 'Category',
  components: { Editor },
  data() {
    return {
      uploadPath,
      list: [],
      listLoading: true,
      catL1: {},
      categoryList: [],
      categoryIds: [],
      dataForm: {
        id: undefined,
        name: '',
        keywords: '',
        level: 'L2',
        pid: undefined,
        desc: '',
        iconUrl: '',
        picUrl: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: this.$t('Edit'),
        create: this.$t('Create')
      },
      rules: {
        name: [{ required: true, message: this.$t('Category_Name_cannot_be_empty'), trigger: 'blur' }]
      }
    }
  },
  computed: {
    headers() {
      return {
        'X-Litemall-Admin-Token': getToken()
      }
    }
  },
  created() {
    this.getList()
    this.getCatL1();
    listCatL2().then(response => {
      this.categoryList = response.data.data.categoryList
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      listCategory()
        .then(response => {
          this.list = response.data.data.list
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.listLoading = false
        })
    },
    getCatL1() {
      listCatL1().then(response => {
        this.catL1 = response.data.data.list
      })
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        name: '',
        keywords: '',
        level: 'L1',
        pid: undefined,
        desc: '',
        iconUrl: '',
        picUrl: ''
      }
    },
    onLevelChange: function(value) {
      if (value === 'L1') {
        this.dataForm.pid = 0
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
    uploadIconUrl: function(response) {
      this.dataForm.iconUrl = response.data.url
    },
    uploadPicUrl: function(response) {
      this.dataForm.picUrl = response.data.url
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createCategory(this.dataForm)
            .then(response => {
              this.getList()
              // 更新L1目录
              this.getCatL1()
              this.dialogFormVisible = false
              this.$notify.success({
                title: this.$t('Success!'),
                message: this.$t('Creation_successful')
              })
            })
            .catch(response => {
              this.$notify.error({
                title: this.$t('Failed'),
                message: response.data.errmsg
              })
            })
        }
      })
    },
    handleUpdate(row) {
      this.categoryIds.splice(0,this.categoryIds.length)
      this.list.forEach(first=>{
        if(first.children){
          first.children.forEach(second=>{
            if(second.id == row.pid){
              this.categoryIds.push(first.id)
              this.categoryIds.push(second.id)
            }
          })
        }
      })
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateCategory(this.dataForm)
            .then(() => {
              this.getList()
              // 更新L1目录
              this.getCatL1()
              this.dialogFormVisible = false
              this.$notify.success({
                title: this.$t('Success!'),
                message: this.$t('Update_Successful')
              })
            })
            .catch(response => {
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
      deleteCategory(row)
        .then(response => {
          this.getList()
          // 更新L1目录
          this.getCatL1()
          this.$notify.success({
            title: this.$t('Success!'),
            message: this.$t('Deleted')
          })
        })
        .catch(response => {
          this.$notify.error({
            title: this.$t('Failed'),
            message: response.data.errmsg
          })
        })
    },
    handleCategoryChange(value) {
      this.dataForm.pid = value[value.length - 1]
    },
    handleRemove: function() {
      this.dataForm.iconUrl = undefined
    },
    handlePicRemove: function() {
      this.dataForm.picUrl = undefined
    },
  }
}
</script>
