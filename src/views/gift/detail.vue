<template>
  <div class="app-container">
    <el-card class="box-card">
      <h3>{{$t('基本信息')}}</h3>

      <div class="table-layout">
        <el-row>
          <el-col :span="4" class="table-cell-title">{{$t('Name')}}</el-col>
          <el-col :span="4" class="table-cell-title">{{$t('类型')}}</el-col>
          <el-col :span="4" class="table-cell-title">{{$t('图片')}}</el-col>
          <el-col :span="12" class="table-cell-title">{{$t('描述')}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">{{ gift.name }}</el-col>
          <el-col :span="4" class="table-cell">{{ typeMap[gift.type] }}</el-col>
          <el-col :span="4" class="table-cell">
            <img :src="gift.picUrl" width="40px" height="40px">
          </el-col>
          <el-col :span="12" class="table-cell">{{ gift.desc  }}</el-col>
        </el-row>
      </div>
    </el-card>

    <el-card class="box-card">
      <h3>{{$t('用户购买详情')}}</h3>

      <!-- 查询操作 -->
      <div class="filter-container">
        <el-input v-model="listQuery.userName" clearable class="filter-item" style="width: 200px;" :placeholder="$t('请输入用户名')"/>
        <el-button v-permission="['GET /admin/coupon/listuser']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('Search')}}</el-button>
      </div>
      <!-- 查询结果 -->
      <el-table v-loading="listLoading" :data="userList" :element-loading-text="$t('Searching')" border fit highlight-current-row>
        <el-table-column align="center" :label="$t('用户名')" prop="userName">
        </el-table-column>
        <el-table-column align="center" :label="$t('实物卡号')" prop="entityCardCode">
        </el-table-column>

        <el-table-column align="center" :label="$t('金额')" prop="amount"/>
        <el-table-column align="center" :label="$t('购买时间')" prop="addTime"/>
        <el-table-column align="center" :label="$t('购买时间')" prop="addTime"/>

        <el-table-column align="center" :label="$t('操作')">
          <template slot-scope="scope">
            <el-button v-permission="['POST /admin/giftcarduser/bind']" type="primary" size="mini" @click="handleBind(scope.row)">{{$t('绑定实物卡')}}</el-button>

            <el-button v-if="scope.row.entityCardCode" v-permission="['POST /admin/giftcarduser/unbind']" type="danger" size="mini" @click="handleUnBind(scope.row)">{{$t('解绑实物卡')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="userTotal>0" :total="userTotal" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getUserList" />
    </el-card>
    <div class="op-container">
      <el-button @click="handleBack">{{$t('Back')}}</el-button>
    </div>

    <!-- 绑定实物卡对话框 -->
    <el-dialog :visible.sync="bindDialogVisible" :title="$t('Undo')">
      <el-form ref="feedbackForm" :model="bindForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="内容" prop="reply">
          <el-input v-model="bindForm.entityCardCode"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bindDialogVisible = false">{{$t('Cancel')}}</el-button>
        <el-button type="primary" @click="doBind">{{$t('Confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { detailGiftCard, getUserListByGiftId, bindEntity, unBindEntity } from "@/api/gift";
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  export default {
    name: "giftcardDetail",
    components:{ Pagination },
    data(){
      const typeMap = {
        '1': '全场通用',
        '2': '指定类目'
      }
      return {
        typeMap,
        gift: {},
        userList: [],
        userTotal: 0,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 20,
          giftCardId: this.$route.query.id,
          userName: undefined,
          sort: 'add_time',
          order: 'desc'
        },
        bindDialogVisible: false,
        bindForm: {
          id: undefined,
          entityCardCode: undefined
        }
      }
    },
    created() {
      this.getDetail()
      this.getUserList()
    },
    methods: {
      getDetail(){
        let id = this.$route.query.id
        detailGiftCard(id).then(responnse=>{
          this.gift = responnse.data.data
        })
      },
      getUserList(){
        getUserListByGiftId(this.listQuery)
          .then(response => {
            this.userList = response.data.data.list
            this.userTotal = response.data.data.total
            this.listLoading = false
          })
          .catch(() => {
            this.userList = []
            this.userTotal = 0
            this.listLoading = false
          })
      },
      handleFilter(){
        this.getUserList()
      },
      handleBack(){
        this.$router.push({path: '/promotion/giftcard'})
      },
      handleBind(row){
        this.bindDialogVisible = !this.bindDialogVisible
        this.bindForm.id = row.id
        this.bindForm.entityCardCode = undefined
      },
      doBind(){
        bindEntity(this.bindForm).then(response => {
          this.bindDialogVisible = false
          this.$notify.success({
            title: this.$t('Success!'),
            message: this.$t('Success!')
          })
          this.getUserList()
        }).catch(response => {
          this.$notify.error({
            title: this.$t('Failed'),
            message: response.data.errmsg
          })
        })
      },
      handleUnBind(row){
        this.$confirm(this.$t('确认解绑?'), this.$t('Hint'), {
          confirmButtonText: this.$t('Confirm'),
          cancelButtonText: this.$t('Cancel'),
          type: 'warning'
        }).then(() => {
          this.doUnbind(row.id)
        });
      },
      doUnbind(id){
        unBindEntity(id).then(response => {
          this.bindDialogVisible = false
          this.$notify.success({
            title: this.$t('Success!'),
            message: this.$t('解绑实物卡成功!')
          })
          this.getUserList()
        }).catch(response => {
          this.$notify.error({
            title: this.$t('Failed'),
            message: response.data.errmsg
          })
        })
      }
    }
  }
</script>

<style scoped>
  .filter-container {
    margin-top: 20px;
  }

  .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }
  .table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }
  .table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
  }
</style>
