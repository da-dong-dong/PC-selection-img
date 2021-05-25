<template>
  <div>
    我是首页
    <div>{{get_ticket}}</div>
    <el-button type="primary" @click="onClickChangeVuex">更改vuex</el-button>
    <el-button type="primary" @click="onClickChangeApi">获取接口</el-button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getCloudChooseType } from '@/api/apiAll.js'
export default {
  computed: {
    ...mapGetters('app', [
      'get_ticket'
    ])
  },
  data () {
    return {
      aa: 'value'
    }
  },
  methods: {
    ...mapActions('app', [
      'act_ticket'
    ]),

    // 改变vuex
    onClickChangeVuex () {
      this.act_ticket('我变了哟')
    },

    // 获取接口
    onClickChangeApi () {
      console.log('获取接口')
      getCloudChooseType().then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
