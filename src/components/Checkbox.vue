<script setup>
import { ref } from "vue";
import { watch } from "vue";
import { useFilterStore } from "@/store/filterStore.js";
const filterStore = useFilterStore();

const indication = ref(false);
const props = defineProps({
  onChange: Function,
});
// watch(
//   () => filterStore.available,
//   () => {
//     props.onChange(indication.value);
//   },
// );
</script>

<template>
  <div class="main">
    <div
      :class="{ activ: filterStore.available, checkbox: true }"
      @click="filterStore.available = !filterStore.available"
    >
      <img
        src="../../img/img_4.png"
        height="12"
        width="16"
        :class="{ hide: !filterStore.available }"
      />
    </div>
    <p class="text" @click="filterStore.available = !filterStore.available">
      в наличии
    </p>
  </div>
</template>

<style scoped>
.main {
  display: flex;
  flex-direction: row;
}
.checkbox {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  border: 1px solid #d3d3d3;
  margin-right: 15px;
}
.activ {
  border: 1px solid #d3d3d3;
  background: #2156bd;
}
.hide {
  display: none;
}
.text {
  font-size: 1.3rem;
  font-weight: 700;
}
</style>
