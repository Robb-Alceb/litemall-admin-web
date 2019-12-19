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
      <el-button @click="handleCancel">取消</el-button>
      <el-button v-permission="['POST /admin/message/create']" type="primary" @click="handleCreate">提交</el-button>
    </div>

  </div>
</template>

<script>
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
        }
      }
    },
    methods: {
      handleCreate(){

      },
      handleCancel(){
        this.$router.push({path:'/message/list'})
      },
      handleAdd(){

      }
    }
  }
</script>

<style scoped>

</style>
