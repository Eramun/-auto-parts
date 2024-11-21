<script setup>
import { ref, watch } from "vue";
import Loading from "@/components/Loading.vue";
// Проверка работы гит

const props = defineProps({
  active: Boolean,
  change: Function,
  waitingForData: Boolean,
});
const localActive = ref(props.active);
const localWaiting = ref(props.waitingForData);
watch(
  () => props.active,
  (newVal) => {
    localActive.value = newVal;
  },
);
watch(
  () => props.waitingForData,
  (newVal) => {
    localWaiting.value = newVal;
  },
);
function noActive() {
  localActive.value = !localActive.value;
  props.change(localActive.value);
}
</script>

<template>
  <div
    style="z-index: 10000"
    :class="{ active: localActive, grey: true }"
    @click="noActive"
  ></div>
  <div style="z-index: 10000" :class="{ active: localActive, main: true }">
    <div v-if="localWaiting">
      <Loading></Loading>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.main {
  width: 500px;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 25px;
  box-shadow: 0px 0px 25px 0px #00000026;
  background: #ffffff;
}

.grey {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  background: rgba(128, 128, 128, 0.3);
}
.waiting {
  background: rgba(128, 128, 128, 0.3);
}
.active {
  display: none;
}
</style>
