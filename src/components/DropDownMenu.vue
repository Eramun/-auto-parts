<script setup>
import { ref, computed } from "vue";
import { watch } from "vue";
import { useFilterStore } from "@/store/filterStore.js";
import Loading from "@/components/Loading.vue";

const props = defineProps({
  values: {
    type: Array,
  },
  name: {
    type: String,
  },
  onChange: Function,
});
const autoFilterStore = useFilterStore();

const bool = ref(false);
const fixed = ref(props.name);
const newArray = ref(props.values);
watch(
  () => props.values,
  (newValue) => {
    if (newValue.length === 0) {
      fixed.value = props.name;
      newArray.value = [];
    } else {
      fixed.value = props.name;
      newArray.value = newValue;
    }
  },
);
watch(
  () => fixed.value,
  (newFixed) => {
    if (newFixed === "Все марки") {
      autoFilterStore.loadingModel = false;
      autoFilterStore.loadingGeneration = false;
    }
  },
);
function handleSelect(num) {
  console.log(autoFilterStore.loadingModel);
  console.log(111);
  if (fixed.value === "Все марки") {
  }
  if (num) {
    fixed.value = num.name;
    bool.value = !bool.value;
    if (props.name === "Все марки") {
      autoFilterStore.selectedBrandId = num.id;
    } else if (props.name === "Все модели") {
      autoFilterStore.selectedModelId = num.id;
    } else if (props.name === "Все поколения") {
      autoFilterStore.selectedGenerationId = num.id;
    }

    if (!newArray.value.find((item) => item.id === 0)) {
      newArray.value.unshift({ name: props.name, id: 0 });
    }
    props.onChange(num.id);
  }
}
</script>

<template>
  <div>
    <div class="list" @click="bool = !bool">
      {{ fixed }}
      <div class="loadAndImg">
        <div v-if="props.name === 'Все модели'">
          <loading
            :class="[{ loading: !autoFilterStore.loadingModel }]"
          ></loading>
        </div>
        <div v-if="props.name === 'Все поколения'">
          <loading
            :class="[{ loading: !autoFilterStore.loadingGeneration }]"
          ></loading>
        </div>
        <!--        <div v-if="props.name === 'Все поколения'">-->
        <!--          <loading-->
        <!--            :class="[{ loading: !autoFilterStore.loadingModel }]"-->
        <!--          ></loading>-->
        <!--        </div>-->

        <img
          src="../../img/img_2.png"
          height="7"
          width="15"
          :class="[
            { loading: autoFilterStore.loadingModel },
            { loading: autoFilterStore.loadingGeneration },
          ]"
        />
      </div>
    </div>
    <div
      :class="[
        'absolute_position_options',
        { open: bool },
        { loading: autoFilterStore.loadingModel },
      ]"
    >
      <div
        v-for="num in newArray.values()"
        :key="num.id"
        :class="['list', { open: bool }, { hide: fixed === num.name }]"
        @click="handleSelect(num)"
      >
        {{ num.name }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.list {
  width: 400px;
  height: 25px;
  background: #f6f6f6;
  border: 1px solid #d3d3d3;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  font-size: 1.3rem;
  font-weight: 700;
}

.absolute_position_options {
  background: white;
  position: absolute;
  visibility: hidden;
  opacity: 0;
  z-index: 1000;
}

.open {
  visibility: visible;
  opacity: 1;
}

.hide {
  position: absolute;
  visibility: hidden;
}
.loading {
  display: none;
}
</style>
