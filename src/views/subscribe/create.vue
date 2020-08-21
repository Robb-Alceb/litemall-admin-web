<template>
  <div class="app-container">
    <el-card class="box-card">
      <h4>{{$t('Basic_Information')}}</h4>
      <el-form ref="subscribeForm" :rules="rules" :model="subscribe" label-width="150px">
        <el-form-item :label="$t('名称')" prop="name">
          <el-input v-model="subscribe.name"/>
        </el-form-item>
        <el-form-item :label="$t('支持订阅方式')" prop="methods">
          <el-checkbox-group v-model="subscribe.methods">
            <el-checkbox :label="1">{{ $t('周')}}</el-checkbox>
            <el-checkbox :label="2">{{ $t('月')}}</el-checkbox>
            <el-checkbox :label="3">{{ $t('年')}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('配送开始时间')" prop="timeStart">
          <el-time-picker v-model="subscribe.timeRanges[0]" format="HH:mm" value-format="HH:mm" :placeholder="$t('Morning')" style="width: 100%;"/>
        </el-form-item>
        <el-form-item :label="$t('配送结束时间')" prop="timeEnd">
          <el-time-picker v-model="subscribe.timeRanges[1]" format="HH:mm" value-format="HH:mm" :placeholder="$t('Morning')" style="width: 100%;"/>
        </el-form-item>
<!--        <el-form-item :label="$t('配送星期限制')" prop="weeks">
          <el-checkbox-group v-model="subscribe.weeks">
            <el-checkbox :label="1">{{$t('Monday')}}</el-checkbox>
            <el-checkbox :label="2">{{$t('Tuesday')}}</el-checkbox>
            <el-checkbox :label="3">{{$t('Wednesday')}}</el-checkbox>
            <el-checkbox :label="4">{{$t('Thursday')}}</el-checkbox>
            <el-checkbox :label="5">{{$t('Friday')}}</el-checkbox>
            <el-checkbox :label="6">{{$t('Saturday')}}</el-checkbox>
            <el-checkbox :label="7">{{$t('Sunday')}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>-->
        <el-form-item :label="$t('可订阅门店')" prop="selectShopIds">
          <el-select v-model="subscribe.selectShopIds" multiple clearable filterable  style="width: 400px;">
            <el-option v-for="item in shopOps" :value="item.id" :label="item.name">{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('允许自动续订')" prop="autoSub">
            <el-checkbox v-model="subscribe.autoSub">{{$t('是')}}</el-checkbox>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <h4>{{$t('商品信息')}}</h4>
      <el-button type="primary" size="mini" @click="handleAddSubGoods()">{{$t('添加')}}</el-button>
      <el-table :data="subscribe.subscribeGoodsDtos" border fit highlight-current-row>
        <el-table-column align="center" :label="$t('商品名')">
          <template slot-scope="scope">
            <el-select v-model="scope.row.goodsId" filterable clearable>
              <el-option v-for="item in goodsOps" :value="item.id" :label="item.name">{{item.name}}</el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('商品订阅价格')">
          <template slot-scope="scope">
            <el-input v-model="scope.row.basePrice"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('操作')">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="handleDeleteSubGoods(scope.row)">{{$t('删除')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-row style="padding-top: 20px;">
      <el-button type="primary" size="mini" @click="handleCreateSubscirbe()">{{$t('确定')}}</el-button>
      <el-button type="info" size="mini" @click="handleBack()">{{$t('返回')}}</el-button>
    </el-row>
  </div>
</template>

<script>
  import { goodsOps } from '@/api/goods'
  import { shopOps } from '@/api/shop'
  import { createSubscribe } from '@/api/subscribe'
  export default {
    name: "create",
    data(){
      return {
        subscribe: {
          methods: [],
          timeRanges: [],
          weeks: [],
          autoSub: true,
          subscribeGoodsDtos: [],
          subscribeShopDtos: [],
          selectShopIds: []
        },
        rules: {
          name: [
            { required: true, message: this.$t('名称不能为空'), trigger: 'blur' },
          ],
          methods: [
            { required: true, message: this.$t('订阅方式不能为空'), trigger: 'change' },
          ],

          timeStart: [
            // { required: true, message: this.$t('配送结束不能为空'), trigger: 'change' },
            {validator:(rule,value,callback)=>{
                if(!this.subscribe.timeRanges[0]){
                  debugger
                  callback(new Error("配送开始不能为空"));
                }else{
                  callback();
                }
              }, trigger: 'blur'}
          ],
          timeEnd: [
            // { required: true, message: this.$t('配送结束不能为空'), trigger: 'change' },
            {validator:(rule,value,callback)=>{
                if(!this.subscribe.timeRanges[1]){
                  callback(new Error("配送结束不能为空"));
                }else{
                  callback();
                }
              }, trigger: 'blur'}
          ],
          weeks: [
            { required: true, message: this.$t('配送星期不能为空'), trigger: 'change' },
          ],
          selectShopIds: [
            { required: true, message: this.$t('可订阅门店不能为空'), trigger: 'change' },
          ],
        },
        selectGoodsIds: [],
        selectShopIds: [],
        goodsOps: [],
        shopOps: []
      }
    },
    created(){
      this.getGoodsOps();
      this.getShopOps();
    },
    methods: {
      getGoodsOps(){
        goodsOps().then(response=>{
          this.goodsOps = response.data.data
        })
      },
      getShopOps(){
        shopOps().then(response=>{
          this.shopOps = response.data.data
        })
      },
      handleCreateSubscirbe(){
        this.$refs['subscribeForm'].validate((valid) => {
          if(valid){
            if(this.subscribe.subscribeGoodsDtos.length < 1){
              this.$message({
                type: 'error',
                message: this.$t('请添加商品')
              })
              return;
            }
            this.subscribe.subscribeShopDtos = [];
            this.subscribe.selectShopIds.forEach(id=>{
              this.subscribe.subscribeShopDtos.push({
                shopId: id
              })
            })
            createSubscribe(this.subscribe).then(response => {
              this.$notify.success({
                title: this.$t('Success!'),
                message: this.$t('添加成功')
              })
              this.$router.push({path: '/subscribe/list'})
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
      handleDeleteSubGoods(item){
        this._.forEach(this.subscribe.subscribeGoodsDtos, (i, index)=>{
          if(item.id == i.id){
            this.subscribe.subscribeGoodsDtos.splice(index, 1)
          }
        })
      },
      handleAddSubGoods(){
        this.subscribe.subscribeGoodsDtos.push({})
      },
      handleBack(){
        this.$router.push({path: '/subscribe/list'})
      }
    }
  }
</script>

<style scoped>

</style>
