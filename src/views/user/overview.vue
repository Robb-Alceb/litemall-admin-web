<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <h4>用户概览</h4>
    </div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>用户信息</span>
        <div  class="table-layout">
          <el-row>
            <el-col :span="4" class="table-cell-title" style="height: 111px;">
              <el-row align="center">
                <img src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80" width="60">
                <br>
                普通会员
              </el-row>
            </el-col>
            <el-col :span="20">
              <el-row>
                <el-col :span="4" class="table-cell-title">
                  用户ID
                </el-col>
                <el-col :span="8" class="table-cell">
                  1234
                </el-col>
                <el-col :span="4" class="table-cell-title">
                  用户昵称
                </el-col>
                <el-col :span="8" class="table-cell">
                  张三
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="20">
              <el-row>
                <el-col :span="4" class="table-cell-title">
                  性别
                </el-col>
                <el-col :span="8" class="table-cell">
                  男
                </el-col>
                <el-col :span="4" class="table-cell-title">
                  会员会费
                </el-col>
                <el-col :span="8" class="table-cell">
                  ￥ 10000
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="20">
              <el-row>
                <el-col :span="4" class="table-cell-title">
                  生日
                </el-col>
                <el-col :span="8" class="table-cell">
                  1997-01-01
                </el-col>
                <el-col :span="4" class="table-cell-title">
                  注册时间
                </el-col>
                <el-col :span="8" class="table-cell">
                  2018-01-01
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>账户详情</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="4" class="table-cell-title">账户余额</el-col>
          <el-col :span="4" class="table-cell-title">消费金额</el-col>
          <el-col :span="4" class="table-cell-title">订单数量</el-col>
          <el-col :span="4" class="table-cell-title">可用积分</el-col>
          <el-col :span="4" class="table-cell-title">优惠券</el-col>
          <el-col :span="4" class="table-cell-title">登录次数</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">￥ 1000</el-col>
          <el-col :span="4" class="table-cell">￥ 200</el-col>
          <el-col :span="4" class="table-cell">10</el-col>
          <el-col :span="4" class="table-cell">200</el-col>
          <el-col :span="4" class="table-cell">2</el-col>
          <el-col :span="4" class="table-cell">10</el-col>
        </el-row>
      </div>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>账户详情</span>
      </div>
      <!-- 查询结果 -->
      <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
        <el-table-column align="center" width="100px" label="地址ID" prop="id" sortable/>
        <el-table-column align="center" min-width="100px" label="用户ID" prop="userId"/>
        <el-table-column align="center" min-width="100px" label="收货人名称" prop="name"/>
        <el-table-column align="center" min-width="100px" label="手机号码" prop="tel"/>
        <el-table-column align="center" min-width="300px" label="区域地址">
          <template slot-scope="scope">
            {{ scope.row.province + scope.row.city + scope.row.county }}
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="300px" label="详细地址" prop="addressDetail"/>

        <el-table-column align="center" min-width="80px" label="默认" prop="isDefault">
          <template slot-scope="scope">
            {{ scope.row.isDefault ? '是' : '否' }}
          </template>
        </el-table-column>

      </el-table>
    </el-card>
  </el-card>
</template>

<script>
    export default {
        name: "overview"
    }
</script>


<style scoped>
  .detail-container {
    width: 80%;
    padding: 20px 20px 20px 20px;
    margin: 20px auto;
  }

  .operate-container {
    background: #F2F6FC;
    height: 80px;
    margin: -20px -20px 0;
    line-height: 80px;
  }

  .operate-button-container {
    float: right;
    margin-right: 20px
  }

  .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }

  .table-cell {
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

