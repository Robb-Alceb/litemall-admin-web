<template>
  <div class="app-container">
<!--    <div class="block-inline">
      <span class="demonstration">{{$t('金额(单位:元)')}}</span>
      <el-slider
        v-model="value"
        range
        show-input
        :max="1000">
      </el-slider>
      <el-button @click="addAmountRange">添加</el-button>
    </div>-->

    <el-form ref="dataForm" :model="dataForm" status-icon label-width="300px">
      <el-form-item v-for="(item,index) in dataForm.amountRange" :label="$t('金额范围')">
        <el-col :span="4">
          <el-input v-model="item[0]"></el-input>
        </el-col>
        <el-col align="center" :span="2">
          <span>{{$t('至')}}</span>
        </el-col>
        <el-col :span="4">
          <el-input v-model="item[1]"></el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" size="mini" @click="addAmountRange">{{$t('添加')}}</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="warning" size="mini" @click="deleteAmountRange(index)">{{$t('删除')}}</el-button>
        </el-col>
      </el-form-item>
    </el-form>
    <div align="center">{{$t('说明：此配置为配置统计金额的横坐标金额范围')}}</div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleUpdate">{{$t('Confirm')}}</el-button>
    </div>
  </div>
</template>

<script>
  import { listAmount, updateAmount } from '@/api/config'
  export default {
    name: "configAmount",
    data(){
      return {
        dataForm: {
          amountRange:[]
        },
        value: [1,100]
      }
    },
    created() {
      this.init()
    },
    methods: {
      init: function() {
        listAmount().then(response => {
          console.log(response.data.data)
          let tmp = response.data.data.litemall_statistics_amount;
          if(tmp){
            let arr = tmp.split(';')
            arr.forEach(data=>{
              let t = data.split('-');
              this.dataForm.amountRange.push(t);
            })
          }
        })
      },
      addAmountRange(){
        let max = this.dataForm.amountRange[this.dataForm.amountRange.length-1][1];
        this.dataForm.amountRange.push([max,max+100])
      },
      deleteAmountRange(index){
        console.log(index)
        this.dataForm.amountRange.splice(index, 1)
      },
      handleUpdate(){
        let body = '';
        this.dataForm.amountRange.forEach((arr,index)=>{
          if(index != this.dataForm.amountRange.length-1){
            body += arr.join('-') + ';'
          }else{
            body += arr.join('-')
          }
        })
        console.log(body);
        updateAmount({litemall_statistics_amount:body})
          .then(response => {
            this.$notify.success({
              title: this.$t('Success!'),
              message: '修改成功'
            })
          })
          .catch(response => {
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
  .demonstration {
    font-size: 14px;
    color: #8492a6;
    line-height: 44px;
  }
</style>
