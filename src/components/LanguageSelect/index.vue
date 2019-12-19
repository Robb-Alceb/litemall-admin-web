<template>
  <el-dropdown trigger="click" @command="handleSetLanguage">
    <div>
      <svg-icon class-name="size-icon" icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="language==='en'" command="en">English</el-dropdown-item>
      <el-dropdown-item :disabled="language==='cn'" command="cn">中文</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
  import Vue from 'vue'
  export default {
    data(){
      return {
        language: undefined,
      }
    },
    mounted(){
      this.language = this.$store.getters.language
    },
    methods: {
      handleSetLanguage(val) {
        this.language = val
        this.$store.dispatch('setLanguage', val)
        this.$message({
          message: '语言切换成功',
          type: 'success'
        })
        val === 'cn' ? this.$i18n.locale = 'cn' : this.$i18n.locale = 'en';
        Vue.set(this.language, val, {label: this.$t('message.zh'), value: 0});
        Vue.set(this.language, val, {label: this.$t('message.en'), value: 1})
      },
    }
  }
</script>

<style scoped>
.size-icon {
  font-size: 20px;
  cursor: pointer;
  vertical-align: -4px!important;
}
</style>

