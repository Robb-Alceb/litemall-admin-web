<template>
  <div class="app-container">

    <el-card class="box-card">
      <h3>发布消息</h3>

      <el-form ref="message" :rules="rules" :model="message" label-width="150px">
        <el-form-item label="消息标题" prop="title">
          <el-input v-model="message.title"/>
        </el-form-item>
        <el-form-item label="消息类型" prop="type">
          <el-radio v-model="message.type" :label="1" border>系统消息</el-radio>
          <el-radio v-model="message.type" :label="2" border>站内消息</el-radio>
        </el-form-item>
        <el-form-item v-show="message.type == 2" label="接收对象" prop="receiverNumber">
          <el-row>
            <span>{{message.receiverNumber}}个对象</span>
            <el-col>
              <el-button type="primary" @click="handleAdd">添加对象</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="消息内容" prop="content">
          <el-input v-model="message.content" type="textarea" placeholder=""/>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="op-container" style="padding-top:20px;">
      <el-button @click="handleCancel">{{$t('Cancel')}}</el-button>
      <el-button v-permission="['POST /admin/message/create']" type="primary" @click="handleCreate">提交</el-button>
    </div>

    <!-- 选择用户对话框 -->
    <el-dialog :visible.sync="userDialogVisible" title="详情">
      <template>
        <el-transfer
          filterable
          :titles="['用户', '已选择']"
          :filter-method="filterUserMethod"
          filter-placeholder="请输入用户名"
          v-model="selecteds"
          :data="users">
        </el-transfer>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userDialogVisible = false">{{$t('Confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {userOption} from '@/api/user'
  import { createMessage } from '@/api/message'
  import { MessageBox } from 'element-ui'
  export default {
    name: "createMessage",
    data(){
      return {
        message: {
          title: undefined,
          type: 1,
          receiverNumber: 0,
          content: undefined
        },
        rules: {
          title: [
            { required: true, message: '消息标题不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '消息类型不能为空', trigger: 'blur' }
          ],
          content: [{ required: true, message: '消息内容不能为空', trigger: 'blur' }]
        },
        userDialogVisible: false,
        users:[{
          label:'张三',
          key:1
        },{
          label:'李四',
          key:2
        },{
          label:'王五',
          key:3
        },{
          label:'赵六',
          key:4
        },{
          label:'卓七',
          key:5
        }],
        selecteds:[]
      }
    },
    created(){
      this.getData()
    },
    methods: {
      getData(){
        userOption().then(response=>{
          this.users = response.data.data
        })
      },
      handleCreate(){
        if(this.selecteds.length){
          this.message.receiverNumber = this.selecteds.length
        }
        this.$refs['message'].validate(valid=>{
          if(valid){
            let data = {
              message: this.message,
              users: this.selecteds
            }
            createMessage(data)
              .then(response => {
              this.$notify.success({
                title: this.$t('Success!'),
                message: this.$t('Creation_successful')
              })
              this.$router.push({ path: '/message/list' })
            })
              .catch(response => {
                MessageBox.alert(this.$t('Error') + response.data.errmsg, this.$t('Warning'), {
                  confirmButtonText: this.$t('Confirm'),
                  type: 'error'
                })
              })
          }
        })
      },
      handleCancel(){
        this.$router.push({path:'/message/list'})
      },
      handleAdd(){
        this.userDialogVisible = true
      },
      filterUserMethod(query, item){
        return item.label.indexOf(query) > -1
      }
    }
  }
</script>

<style scoped>

</style>
