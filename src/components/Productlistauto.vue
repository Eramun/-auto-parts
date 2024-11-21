<script setup>
import ProductItemauto from "@/components/ProductItemauto.vue";
import axios from "axios";
import { ref } from "vue";
import { watch } from "vue";
import { useFilterStore } from "@/store/filterStore.js";

const props = defineProps({
  brandId: Number,
  modelId: Number,
  generationId: Number,
  onChange: Function,
  currentPage: Number,
  available: Boolean,
});
const filterBrand = useFilterStore();
const items = ref([]);
const products = ref([]);
const currentPage = ref(props.currentPage);
const propsCurrentPage = ref(props.currentPage);
const totalPage = ref(0);
const getProducts = async (page) => {
  try {
    let url = `https://frost.runtime.kz/api/products?page=${page}&size=9`;
    if (filterBrand.available === false) {
      url += "&available=0";
    } else {
      url += "&available=1";
    }
    if (filterBrand.selectedBrandId) {
      url += `&brandId=${filterBrand.selectedBrandId}`;
      if (filterBrand.selectedModelId !== 0) {
        url += `&modelId=${filterBrand.selectedModelId}`;
      }
      if (filterBrand.selectedGenerationId !== 0) {
        url += `&generationId=${filterBrand.selectedGenerationId}`;
      }
    }
    const response = await axios.get(url);
    if (response.data.items) {
      console.log("Полный ответ сервера:", response.data);
      products.value = [];
      for (let item of response.data.items) {
        products.value.push({
          specification: item.description,
          price: item.price,
          id: item.id,
          available: item.available,
        });
      }
      // currentPage.value = response.data.currentPage;
      totalPage.value = response.data.totalPages;
      props.onChange(page, totalPage.value);
    }
  } catch (error) {
    console.error("Ошибка", error);
  }
};
watch(
  () => [
    filterBrand.selectedBrandId,
    filterBrand.selectedModelId,
    filterBrand.selectedGenerationId,
    filterBrand.available,
  ],
  () => {
    getProducts(1);
  },
  { immediate: true },
);
watch(
  () => [props.currentPage],
  () => {
    getProducts(props.currentPage);
  },
);
</script>
<template>
  <div class="newProduct">
    <div v-for="(product, index) in products" :key="index">
      <product-itemauto :product="product" />
    </div>
  </div>
</template>

<style scoped>
.newProduct {
  margin: 0 auto;
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding-top: 50px;
}
</style>
