<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" :placeholder="$t('Please_enter_advertisement_title')"/>
      <el-input v-model="listQuery.content" clearable class="filter-item" style="width: 200px;" :placeholder="$t('Please_enter_advertisement_content')"/>
      <el-button v-permission="['GET /admin/ad/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('Search')}}</el-button>
      <el-button v-permission="['POST /admin/ad/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">{{$t('Add')}}</el-button>
<!--      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{$t('Find')}}</el-button>-->
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" :element-loading-text="$t('Searching')" border fit highlight-current-row>

      <el-table-column align="center" :label="$t('Store')">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type == 0">{{$t('All_stores')}}</el-tag>
          <el-tag v-else v-for="item in scope.row.shopIds">{{{shopId:item,shops} | shopNameFilter}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('Advertisement_Title')" prop="name"/>

      <el-table-column align="center" :label="$t('Advertisement_content')" prop="content"/>

      <el-table-column align="center" :label="$t('Advertisement_picture')" prop="url">
        <template slot-scope="scope">
          <img v-if="scope.row.url" :src="scope.row.url" width="80">
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('Advertisement_location')" prop="position"/>

      <el-table-column align="center" :label="$t('Event_link')"  prop="link"/>

      <el-table-column align="center" :label="$t('Activate?')" prop="enabled">
        <template slot-scope="scope">
          <el-tag :type="scope.row.enabled ? 'success' : 'error' ">{{ scope.row.enabled ? $t('Activate_') : $t('Do_not_activate') }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('Operate')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/ad/update']" type="primary" :disabled="isPermission(scope.row)" size="mini" @click="handleUpdate(scope.row)">{{$t('Edit')}}</el-button>
          <el-button v-permission="['POST /admin/ad/delete']" type="danger" :disabled="isPermission(scope.row)" size="mini" @click="handleDelete(scope.row)">{{$t('Delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('Store')" prop="shopIds">
          <el-select v-if="!store.state.user.shop" v-model="dataForm.shopIds" multiple clearable @change="handleAdTypeChange" :placeholder="$t('All_stores')">
            <el-option v-for="item in shops" :value="item.id" :label="item.name"></el-option>
          </el-select>
          <el-select v-else v-model="dataForm.shopIds" @change="handleAdTypeChange">
            <el-option v-for="item in shops" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('Advertisement_Title')" prop="name">
          <el-input v-model="dataForm.name"/>
        </el-form-item>
        <el-form-item :label="$t('Advertisement_content')" prop="content">
          <el-input v-model="dataForm.content"/>
        </el-form-item>
        <el-form-item>
          <el-col :span="11">
            <el-date-picker v-model="dataForm.startTime" type="datetime" placeholder="开始时间" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"/>
          </el-col>
          <el-col :span="2" class="line">至</el-col>
          <el-col :span="11">
            <el-date-picker v-model="dataForm.endTime" type="datetime" placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"/>
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('Advertisement_picture')" prop="url">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadUrl"
            :before-upload="checkFileSize"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif">
            <img v-if="dataForm.url" :src="dataForm.url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
            <div slot="tip" class="el-upload__tip">{{this.$t('Only_upload_jpg/png_files_and_may_not_exceed_1024kb')}}</div>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('Advertisement_location')" prop="position">
          <el-select v-model="dataForm.position" :placeholder="this.$t('Please_select')">
            <el-option :value="1" :label="$t('Home')"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('Event_link')" prop="link">
          <el-input v-model="dataForm.link"/>
        </el-form-item>
        <el-form-item :label="$t('Activate?')" prop="enabled">
          <el-select v-model="dataForm.enabled" :placeholder="this.$t('Please_select')">
            <el-option :value="true" :label="$t('Activate_')"/>
            <el-option :value="false" :label="$t('Do_not_activate')"/>
          </el-select>
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

<style>
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
</style>

<script>
import { listAd, createAd, updateAd, deleteAd } from '@/api/ad'
import { uploadPath } from '@/api/storage'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { allForPerm } from '@/api/shop'
import store from '@/store'

export default {
  name: 'Ad',
  components: { Pagination },
  data() {
    return {
      store,
      uploadPath,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        content: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        shopIds: undefined,
        name: undefined,
        content: undefined,
        url: undefined,
        link: undefined,
        position: 1,
        enabled: true
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: this.$t('Edit'),
        create: this.$t('Create')
      },
      rules: {
        name: [
          { required: true, message: this.$t('Advertisement_Title_cannot_be_empty'), trigger: 'blur' }
        ],
        content: [
          { required: true, message: this.$t('Advertisement_content_cannot_be_empty'), trigger: 'blur' }
        ],
        url: [{ required: true, message: this.$t('Advertisement_picture_cannot_be_empty'), trigger: 'blur' }]
      },
      downloadLoading: false,
      shops:[]
    }
  },
  filters: {
    shopNameFilter(data){
      let shop = data.shops.find(shop=>{
        if(shop.id == data.shopId){
          return shop.name
        }
      })
      if(shop){
        return shop.name;
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
    allForPerm().then(response=>{
      this.shops = response.data.data.list
    })
    if(this.store.state.user.shop){
      console.log(this.store.state.user.shop.id)
      this.dataForm.shopId = this.store.state.user.shop.id
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      listAd(this.listQuery)
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
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        name: undefined,
        content: undefined,
        url: undefined,
        link: undefined,
        position: 1,
        enabled: true
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
    uploadUrl: function(response) {
      this.dataForm.url = response.data.url
    },
    checkFileSize: function(file) {
      if (file.size > 1048576) {
        this.$message.error(`${file.name}文件大于1024KB，请选择小于1024KB大小的图片`)
        return false
      }
      return true
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createAd(this.dataForm)
            .then(response => {
              this.list.unshift(response.data.data)
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
          updateAd(this.dataForm)
            .then(() => {
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
                message: this.$t('Advertisement_update_successful')
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
      deleteAd(row)
        .then(response => {
          this.$notify.success({
            title: this.$t('Success!'),
            message: this.$t('Deleted')
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
        .catch(response => {
          this.$notify.error({
            title: this.$t('Failed'),
            message: response.data.errmsg
          })
        })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [
          '广告ID',
          '广告标题',
          '广告内容',
          '广告图片',
          '广告位置',
          '活动链接',
          '是否启用'
        ]
        const filterVal = [
          'id',
          'name',
          'content',
          'url',
          'postion',
          'link',
          'enabled'
        ]
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '广告信息')
        this.downloadLoading = false
      })
    },
    handleAdTypeChange(){
      if(this.dataForm.shopIds && this.dataForm.shopIds.length > 0){
        this.dataForm.type = 1
      }else{
        this.dataForm.type = 0
      }
    },
    isPermission(row){
      if(!this.store.state.user.shop){
        return false;
      }else{
        return this.store.state.user.shop.id != row.shopId
      }
    }
  }
}
</script>
