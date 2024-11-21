<script setup>
import DropDownMenu from "@/components/DropDownMenu.vue";
import Productlistauto from "@/components/Productlistauto.vue";
import Pagination from "@/components/Pagination.vue";
import Checkbox from "@/components/Checkbox.vue";
import axios from "axios";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Modalwindow from "@/components/Modalwindow.vue";
import { useAuthStore } from "@/store/authStore.js";
import Filtermenu from "@/components/Filtermenu.vue";

// https://frost.runtime.kz/api/products?page=...&size=...&brandId=...&modelId=...&generationId=...

const route = useRoute();
console.log(route.params.productId);

const authStore = useAuthStore();
console.log(authStore.user);

const brands = ref([]);
const modelName = ref([]);
const generation = ref([]);
const brandIdProps = ref(0);
const modelIdProps = ref(0);
const generationIdProps = ref(0);
const currentPage = ref(1);
const totalPage = ref(0);
const availableStatus = ref(false);
// axios.get("https://frost.runtime.kz/api/brands").then(function (response) {
//   for (let datum of response.data) {
//     brands.value.push({
//       name: datum.name,
//       id: datum.id,
//     });
//   }
// });
// let fixBrand = ref(undefined);
// function getId(){
//     if (fixBrand ==='Huindai'){
//         return 1
//     }else if (fixBrand ==='Kia'){
//         return 2
//     }
// }

// async function brandChange(brandId) {
//   if (brandId === 0) {
//     brandIdProps.value = 0;
//     modelName.value = [];
//     generation.value = [];
//   } else {
//     try {
//       const response = await axios.get(
//         `https://frost.runtime.kz/api/models?brandId=${brandId}`,
//       );
//       brandIdProps.value = 0;
//       brandIdProps.value = brandId;
//       generationIdProps.value = 0;
//       modelIdProps.value = 0;
//
//       modelName.value = [];
//       generation.value = [];
//       for (let datum of response.data) {
//         modelName.value.push({
//           name: datum.name,
//           id: datum.id,
//         });
//       }
//     } catch (error) {
//       console.error("Error", error);
//     }
//   }
// }

// async function modelChange(modelId) {
//   if (modelId === 0) {
//     modelIdProps.value = 0;
//     generation.value = [];
//   } else {
//     try {
//       const response = await axios.get(
//         `https://frost.runtime.kz/api/generations?modelId=${modelId}`,
//       );
//       console.log(modelId);
//       modelIdProps.value = 0;
//       modelIdProps.value = modelId;
//       generationIdProps.value = 0;
//       // console.log("---idmodel---");
//       // console.log(modelIdProps);
//       console.log("1212");
//       console.log(generationIdProps);
//       generation.value = [];
//       for (let datum of response.data) {
//         generation.value.push({
//           name: datum.name,
//           id: datum.id,
//         });
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   }
// }

// function generationChange(genId) {
//   if (genId === 0) {
//     generationIdProps.value = 0;
//   } else {
//     generationIdProps.value = 0;
//     generationIdProps.value = genId;
//   }
// }
function paginationChange(currentPageValue, totalPageValue) {
  currentPage.value = currentPageValue;
  totalPage.value = totalPageValue;
  console.log("---page---");
  console.log(currentPage.value);
  console.log(totalPage.value);
}
function currentPageChange(page) {
  currentPage.value = page;
  console.log("--- obj");
  console.log(currentPage);
  console.log("12312");
  console.log(page);
  console.log("12344");
}
function availableItems(status) {
  availableStatus.value = status;
}
</script>
<template>
  <img src="../../img/mainImg.png" style="width: 100%; height: auto" />
  <div class="mainContainer">
    <Filtermenu></Filtermenu>
    <!--    <div class="searchDetailsContainer">-->
    <!--      <div class="leftCategory">-->
    <!--        <div class="category">-->
    <!--          <p class="text">Категория</p>-->
    <!--          &lt;!&ndash;-->
    <!--                                                                                            [-->
    <!--                                                                                              {text: 'Hyundai', value: 1},-->
    <!--                                                                                              {text: 'Kia', value: 2},-->
    <!--                                                                                            ]-->
    <!--                                                                                            &ndash;&gt;-->
    <!--          <drop-down-menu-->
    <!--            :values="[-->
    <!--              'Значение #1',-->
    <!--              'Значение #2',-->
    <!--              'Значение #3',-->
    <!--              'Значение #4',-->
    <!--            ]"-->
    <!--            name="Все категории"-->
    <!--          />-->
    <!--        </div>-->
    <!--        <div class="category">-->
    <!--          <p class="text">Марка</p>-->
    <!--          <drop-down-menu-->
    <!--            :values="brands"-->
    <!--            name="Все марки"-->
    <!--            @change="brandChange"-->
    <!--          />-->
    <!--        </div>-->
    <!--        <div class="availability">-->
    <!--          &lt;!&ndash;                    <input type="checkbox" id="availabilityCheckbox" v-model="availability"/>&ndash;&gt;-->
    <!--          <checkbox @change="availableItems" />-->
    <!--          &lt;!&ndash;                    <label for="availabilityCheckbox">в наличии</label>&ndash;&gt;-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div class="rightCategory">-->
    <!--        <div class="category">-->
    <!--          <p class="text">Модель</p>-->
    <!--          <drop-down-menu-->
    <!--            :values="modelName"-->
    <!--            name="Все модели"-->
    <!--            @change="modelChange"-->
    <!--          />-->
    <!--        </div>-->
    <!--        <div class="category">-->
    <!--          <p class="text">Поколение</p>-->
    <!--          <drop-down-menu-->
    <!--            :values="generation"-->
    <!--            name="Все поколения"-->
    <!--            @change="generationChange"-->
    <!--          />-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
    <productlistauto
      :brand-id="brandIdProps"
      :model-id="modelIdProps"
      :generation-id="generationIdProps"
      :current-page="currentPage"
      :available="availableStatus"
      @change="paginationChange"
    />

    <div class="pagination">
      <pagination
        :currentPage="currentPage"
        :total-page="totalPage"
        :brand-id="brandIdProps"
        :model-id="modelIdProps"
        :generation-id="generationIdProps"
        @change="currentPageChange"
      />
    </div>
  </div>
</template>

<style scoped>
.mainContainer {
  width: 1170px;
  align-self: center;
  margin-top: 40px;
}

.searchDetailsContainer {
  padding: 50px;
  border: 2px solid #e5e5e5;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.searchDetail {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.text {
  padding-bottom: 10px;
  font-size: 1.3rem;
  font-weight: 700;
}

.leftCategory {
  /*height: 150px;*/
  display: flex;
  flex-direction: row;
  /*justify-content: space-between;*/
}

.rightCategory {
  /*height: 150px;*/
  display: flex;
  flex-direction: row;
  align-items: center;
  /*justify-content: space-between;*/
}

.availability {
  display: flex;
  align-items: center;
  margin-top: 30px;
  font-size: 1.3rem;
  font-weight: 700;
}

.availability label {
  margin-left: 10px;
}

.category {
  margin-right: 50px;
}

.availability input[type="checkbox"] {
  width: 20px;
  height: 20px;
  margin: 0;
  padding: 0;
  border: 2px solid #000;
  outline: none;
  cursor: pointer;
}

.pagination {
  display: flex;
  flex-direction: row;
  justify-content: end;
  padding-bottom: 20px;
}
</style>
