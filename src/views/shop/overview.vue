<template>
    <div class="app-container dashboard-editor-container">
      <el-card>
        <div slot="header" class="clearfix">
          <span>基本信息</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="shopDetail()">查看详情</el-button>
        </div>
        <el-row align="center">
          <el-col :span="4" align="right">
            门店店长:
          </el-col>
          <el-col :span="4">
            张三
          </el-col>
          <el-col :span="4" align="right">
            营业状态:
          </el-col>
          <el-col :span="4">
            正在营业
          </el-col>
          <el-col :span="4" align="right">
            门店员工:
          </el-col>
          <el-col :span="4">
            （100人）
          </el-col>
        </el-row>
      </el-card>
      <el-card style="margin-top: 20px">
        <div slot="header" class="clearfix">
          <span>销售情况</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="salesDetail()">统计信息</el-button>
        </div>
        <el-row :gutter="40" class="panel-group">
          <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper icon-shoppingCard">
                <svg-icon icon-class="money" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">今日销售额</div>
                <count-to :start-val="0" :end-val="1" :duration="2600" class="card-panel-num"/>
              </div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper icon-message">
                <svg-icon icon-class="message" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">最近7日销售额</div>
                <count-to :start-val="0" :end-val="goodsTotal" :duration="3000" class="card-panel-num"/>
              </div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper icon-money">
                <svg-icon icon-class="message" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">历史销售额</div>
                <count-to :start-val="0" :end-val="productTotal" :duration="3200" class="card-panel-num"/>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <el-card style="margin-top: 20px">
        <div slot="header" class="clearfix">
          <span>订单情况</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="orderDetail()">订单详情</el-button>
        </div>
        <el-row :gutter="40" class="panel-group">
          <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper icon-shoppingCard">
                <svg-icon icon-class="money" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">今日订单总量</div>
                <count-to :start-val="0" :end-val="1" :duration="2600" class="card-panel-num"/>
              </div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper icon-message">
                <svg-icon icon-class="message" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">正在进行的订单</div>
                <count-to :start-val="0" :end-val="goodsTotal" :duration="3000" class="card-panel-num"/>
              </div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
            <div class="card-panel" @click="handleSetLineChartData('purchases')">
              <div class="card-panel-icon-wrapper icon-money">
                <svg-icon icon-class="message" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">历史总订单</div>
                <count-to :start-val="0" :end-val="productTotal" :duration="3200" class="card-panel-num"/>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>

    <el-card style="margin-top: 20px">
      <div slot="header" class="clearfix">
        <span>商品情况</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="goodsDetail()">商品详情</el-button>
      </div>
      <el-row align="center">
        <el-col :span="4" align="right">
          总上架商品:
        </el-col>
        <el-col :span="4">
          （100）
        </el-col>
        <el-col :span="4" align="right">
          待处理进货请求:
        </el-col>
        <el-col :span="4">
          （10）
        </el-col>
      </el-row>
    </el-card>
    </div>
</template>

<script>
  import CountTo from 'vue-count-to'
  export default {
    name: "overview",
    data(){
      return {

      }
    },
    components: {
      CountTo
    },
    methods:{
      goodsDetail(){

      },
      orderDetail(){

      },
      salesDetail(){

      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }

  .panel-group {
    margin-top: 18px;

    .card-panel-col{
      margin-bottom: 32px;
    }
    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);
      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }
        .icon-people {
          background: #40c9c6;
        }
        .icon-message {
          background: #36a3f7;
        }
        .icon-money {
          background: #f4516c;
        }
        .icon-shoppingCard {
          background: #34bfa3
        }
      }
      .icon-people {
        color: #40c9c6;
      }
      .icon-message {
        color: #36a3f7;
      }
      .icon-money {
        color: #f4516c;
      }
      .icon-shoppingCard {
        color: #34bfa3
      }
      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }
      .card-panel-icon {
        float: left;
        font-size: 48px;
      }
      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;
        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }
        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }
</style>
