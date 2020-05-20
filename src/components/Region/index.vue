<template>
  <el-cascader
    :placeholder="$t('区域')"
    class="filter-item"
    v-model="options.regionIds"
    :options="countries"
    @active-item-change="handleItemChange"
    :props="props"
    clearable
    filterable
  ></el-cascader>
</template>

<script>
  import { listCountryRegion, listSubRegion } from '@/api/region'
  export default {
    name: "index",
    props: ['options'],
    data(){
      return {
        props: {
          value:'id',
          label: 'nameEn',
          children: 'children',
          checkStrictly: true
        },
        countries:[]
      }
    },
    mounted(){
      this.getCountries()
/*      this.$nextTick(()=>{
        this.init()
      })*/
    },
    methods: {
       init(){
        if(this.options.regionIds && this.options.regionIds.length > 0){
          this.options.regionIds.forEach(async (value, index)=>{
            await this.handleItemChange(this.options.regionIds.slice(0,index+1))
          })
          // await this.handleItemChange([1])

          // setTimeout(() => {
          // await this.handleItemChange([1, 2])
          // }, 1000);
          // setTimeout(() => {
          // await this.handleItemChange([1, 2, 34])
          // }, 2000);
        }
      },
      getCountries(){
        listCountryRegion().then(response=>{
          this.countries = response.data.data.list.map(function(country){
            return _.defaults(country,{children:[]})
          })
        })
      },
      handleItemChange(val) {
        let step = val.length
        let query = {
          id: val[val.length-1],
          type: 1
        }
        listSubRegion(query).then(response=>{
          let result = this.findObject(this.countries, val)
          console.log("result",result)
          if(result.children){
            result.children = []
          }
          response.data.data.list.forEach(child=>{
            if(step <= 2){
              result.children.push(this._.defaults(child,{children:[]}))
            }else{
              result.children.push(child)
            }
          })
        })
      },
      findObject(arr, ids){
        for(let i=0;i<=arr.length-1;i++){
          let obj = arr[i]
          if(ids.length == 1 && obj.id == ids[0]){
            return obj;
          }else if(obj.id == ids[0]){
            ids.shift()
            return this.findObject(obj.children, ids)
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
