<template>
  <div class="main-index">
    <div class="router-item">
      <router-link to="/config">新增动态页面</router-link>
    </div>
    <div class="router-item">
      <router-link to="/config?id=demo">编辑动态页面</router-link>
    </div>
    <div class="router-item">
      <router-link to="/render?pageId=demo">动态渲染页面</router-link>
    </div>
    <div class="router-item">
      <router-link to="/workflow">工作流页面配置</router-link>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Index'
}
</script>

<style lang="scss">
.main-index {
  padding-top: 100px;
  .router-item {
    text-align: center;
    margin: 20px;
  }
}
</style>
