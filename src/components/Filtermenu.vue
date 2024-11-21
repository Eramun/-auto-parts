<script setup>
import Checkbox from "@/components/Checkbox.vue";
import DropDownMenu from "@/components/DropDownMenu.vue";
import { ref, watch } from "vue";
import { useFilterStore } from "@/store/filterStore.js";
const brands = ref([]);
const modelName = ref([]);
const generation = ref([]);
const availableStatus = ref(false);
const autoFilterStore = useFilterStore();
autoFilterStore
  .fetchBrands()
  .then(() => (brands.value = autoFilterStore.brands));
// brands.value = autoFilterStore.brands;

watch(
  () => autoFilterStore.selectedBrandId,
  () => {
    autoFilterStore
      .fetchModel()
      .then(() => (modelName.value = autoFilterStore.modelName));
  },
);
watch(
  () => autoFilterStore.selectedModelId,
  () => {
    autoFilterStore
      .fetchGeneration()
      .then(() => (generation.value = autoFilterStore.generation));
  },
);
</script>

<template>
  <div class="searchDetailsContainer">
    <div class="leftCategory">
      <div class="category">
        <p class="text">Категория</p>
        <drop-down-menu
          :values="['Значение #1', 'Значение #2', 'Значение #3', 'Значение #4']"
          name="Все категории"
        />
      </div>
      <div class="category">
        <p class="text">Марка</p>
        <drop-down-menu :values="brands" name="Все марки" />
      </div>
      <div class="availability">
        <checkbox />
      </div>
    </div>
    <div class="rightCategory">
      <div class="category">
        <p class="text">Модель</p>
        <drop-down-menu :values="modelName" name="Все модели" />
      </div>
      <div class="category">
        <p class="text">Поколение</p>
        <drop-down-menu :values="generation" name="Все поколения" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.searchDetailsContainer {
  border: 2px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.leftCategory {
  display: flex;
  flex-direction: row;
}
.category {
  margin-right: 50px;
}
.text {
  padding-bottom: 10px;
  font-size: 1.3rem;
  font-weight: 700;
}
.rightCategory {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.availability {
  display: flex;
  align-items: center;
  margin-top: 30px;
  font-size: 1.3rem;
  font-weight: 700;
}
</style>
