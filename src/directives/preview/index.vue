<template>
  <div :class="['img-preview', flag && 'animation']">
    <div class="mask"></div>
    <el-icon
      class="close-icon"
      :size="20"
      @click="maskClick"
    >
      <Close />
    </el-icon>
    <div
      class="img-container"
      :style="style"
    >
      <img :src="src">
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref } from 'vue'
import { ElIcon } from 'element-plus'
import { Close } from '@element-plus/icons-vue'

const props = defineProps({
  el: {
    type: Object as PropType<HTMLImageElement>,
    required: true
  },
  src: {
    type: String,
    required: true
  },
  onClose: {
    type: Function as PropType<() => void>
  }
})

const flag = ref(true)

const getStyle = (rect: DOMRect) => {
  return {
    '--c-top': rect.top + 'px',
    '--c-left': rect.left + 'px',
    '--c-width': rect.width + 'px',
    '--c-height': rect.height + 'px'
  }
}

const style = ref<Record<string, any>>(getStyle(props.el.getBoundingClientRect()))

setTimeout(() => {
  flag.value = false
}, 100)

const maskClick = () => {
  style.value = getStyle(props.el.getBoundingClientRect())
  flag.value = true
  setTimeout(() => {
    props.onClose?.()
  }, 500)
}

</script>

<style lang="scss">
.img-preview {
  position: fixed;
  inset: 0;

  .mask {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, .3);
    z-index: 1;
    transition: all .5s;
  }

  .close-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 20;
    padding: 5px;
    width: 30px;
    height: 30px;
    background-color: #fff;
    cursor: pointer;
  }

  .img-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-content: center;
    transition: all .5s;
    z-index: 10;

    img {
      z-index: 11;
      max-width: 100%;
      max-height: 100%;
    }
  }

  &.animation {
    .img-container {
      top: var(--c-top);
      left: var(--c-left);
      width: var(--c-width);
      height: var(--c-height);
    }

    .mask {
      background-color: rgba(0, 0, 0, 0);
    }

  }
}
</style>
