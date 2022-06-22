<template>
  <div>图片预览</div>
  <router-link to="/">首页</router-link>
  <div class="img-main">
    <template
      v-for="index in 10"
      :key="index"
    >
      <img
        v-preview
        src="~@/assets/img/t0.jpg"
      >
      <img
        v-preview
        src="~@/assets/img/t1.jpg"
      >
      <img
        v-preview
        src="~@/assets/img/t2.jpg"
      >
      <img
        v-preview
        src="~@/assets/img/t3.jpg"
      >
      <img
        v-preview
        src="~@/assets/img/t4.jpg"
      >
      <img
        v-preview
        src="~@/assets/img/t5.jpg"
      >
      <img
        v-preview
        src="~@/assets/img/t6.jpg"
      >
      <img
        v-preview
        src="~@/assets/img/t7.jpg"
      >
      <img
        v-preview
        src="~@/assets/img/t8.jpg"
      >
      <img
        v-preview
        src="~@/assets/img/t9.jpg"
      >
    </template>
  </div>
</template>

<script lang="ts" setup>
import vPreview from '@/directives/img-preview'
</script>

<style lang="scss" scoped>
.img-main {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

  img {
    width: 100px;
    height: 100px;
    margin: 10px;
    cursor: pointer;
  }
}
</style>
