<template>
  <div class="dynamic-main">aside</div>
</template>

<script lang="ts">
export default {
  name: 'DpAside'
}
</script>

<script lang="ts" setup>
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})
console.log(props.data)
</script>
