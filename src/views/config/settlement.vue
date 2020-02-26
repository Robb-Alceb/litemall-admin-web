<template>
  <div class="app-container">
    <el-form ref="dataForm" :model="dataForm" status-icon label-width="300px">
      <el-form-item v-for="(item,index) in dataForm.amountRange" :label="$t('面额')">
        <el-col :span="4">
          <el-input v-model="dataForm.amountRange[index]"></el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" size="mini" @click="addAmountRange">{{$t('添加')}}</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="warning" size="mini" @click="deleteAmountRange(index)">{{$t('删除')}}</el-button>
        </el-col>
      </el-form-item>
    </el-form>
    <div align="center">{{$t('说明：此配置为配置ipad用户下班结算时的面额配置')}}</div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleUpdate">{{$t('Confirm')}}</el-button>
    </div>
  </div>
</template>

<script>
  import { listSettlement, updateSettlement } from "@/api/config";
  export default {
    name: "settlement",
    data(){
      return {
        dataForm: {
          amountRange:[]
        },
      }
    },
    created() {
      this.init()
    },
    methods: {
      init: function() {
        listSettlement().then(response => {
          console.log(response.data.data)
          let tmp = response.data.data.litemall_settlement_amount;
          if(tmp){
            let arr = tmp.split(';')
            arr.forEach(data=>{
              this.dataForm.amountRange.push(data);
            })
            this.dataForm.amountRange = this._.sortBy(this.dataForm.amountRange, function(o){
              return Number(o.amount)
            })
          }
        })
      },
      addAmountRange(){
        this.dataForm.amountRange.push(1)
      },
      deleteAmountRange(index){
        console.log(index)
        this.dataForm.amountRange.splice(index, 1)
      },
      handleUpdate(){
        let body = this.dataForm.amountRange.join(';')
        console.log(body);
        updateSettlement({litemall_settlement_amount:body})
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

</style>
