<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { parseUrl } from '@/util/util.js'
import { mapGetters, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapGetters('app', [
      'get_parseUrl'
    ])
  },
  methods: {
    ...mapMutations('app', [
      'mut_setParseUrl'
    ])
  },
  created () {
    let parseUrlJson = parseUrl(window.location.href)

    // 存储到vuex中
    console.log()
    if (window.location.href.indexOf('index') !== -1) {
      this.mut_setParseUrl(parseUrlJson)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/util/comm.scss";

</style>
<style>
  @import "~@/util/icons.css";
</style>
