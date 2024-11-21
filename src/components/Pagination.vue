<script setup>
import { computed, ref, watch } from "vue";
import { useFilterStore } from "@/store/filterStore.js";
const filterStore = useFilterStore();
const props = defineProps({
  currentPage: Number,
  totalPage: Number,
  onChange: Function,
  brandId: Number,
  modelId: Number,
  generationId: Number,
});
let currentPage = ref(props.currentPage);
let pageList = computed(function () {
  if (currentPage.value === 1 && props.totalPage > 6) {
    if (props.totalPage < 4) {
      return [currentPage.value, currentPage.value + 1];
    } else {
      return [
        currentPage.value,
        currentPage.value + 1,
        currentPage.value + 2,
        "...",
      ];
    }
  } else if (currentPage.value === props.totalPage && props.totalPage > 6) {
    if (props.totalPage < 4) {
      return [currentPage.value - 1, currentPage.value];
    } else {
      return [
        "...",
        currentPage.value - 2,
        currentPage.value - 1,
        currentPage.value,
      ];
    }
  } else if (
    currentPage.value === props.currentPage + 1 &&
    props.totalPage > 6
  ) {
    if (props.totalPage < 4) {
      return [currentPage.value - 1, currentPage.value, currentPage.value + 1];
    } else {
      return [
        currentPage.value - 1,
        currentPage.value,
        currentPage.value + 1,
        "...",
      ];
    }
  } else if (currentPage.value === props.totalPage - 1 && props.totalPage > 6) {
    return [
      "...",
      currentPage.value - 1,
      currentPage.value,
      currentPage.value + 1,
    ];
  } else if (props.totalPage <= 6) {
    let arrays = [];
    for (let i = 1; i <= props.totalPage; i++) {
      arrays.push(i);
    }
    return arrays;
  } else {
    return [
      "...",
      currentPage.value - 1,
      currentPage.value,
      currentPage.value + 1,
      "...",
    ];
  }
});

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function nextPage() {
  if (currentPage.value < props.totalPage) {
    currentPage.value++;
  }
}

watch(
  () => [
    filterStore.selectedBrandId,
    filterStore.selectedModelId,
    filterStore.selectedGenerationId,
    filterStore.available,
  ],
  () => {
    currentPage.value = 1;
  },
);
</script>

<template>
  <div class="pagination">
    <button
      :class="{ noActive: currentPage === 1, backAndNext: true }"
      @click="prevPage"
    >
      <img class="img" src="../../img/img_3.png" height="15" width="10" /> Назад
    </button>
    <button
      :class="[
        { active: currentPage === 1 },
        { active: currentPage === 2 },
        { active: props.totalPage <= 6 },
      ]"
      @click="currentPage = 1"
    >
      {{ 1 }}
    </button>
    <button
      v-for="page in pageList"
      @click="(currentPage = page), props.onChange(page)"
      :class="{
        dot: page === '...',
        grey: currentPage === page || (page === 1 && currentPage <= 1),
      }"
    >
      {{ page }}
    </button>

    <button
      :class="[
        { active: currentPage === props.totalPage, grey: currentPage === page },
        {
          active: currentPage === props.totalPage - 1,
          grey: currentPage === page,
        },
        { active: props.totalPage <= 6 },
      ]"
      @click="currentPage = props.totalPage"
    >
      {{ props.totalPage }}
    </button>
    <button
      :class="{ noActive: currentPage === props.totalPage, backAndNext: true }"
      @click="nextPage"
    >
      Вперед <img src="../../img/img_3.png" height="15" width="10" />
    </button>
  </div>
</template>

<style scoped>
.dot {
  border: none;
  background: white;
  font-size: 1.2rem;
  padding: 8px 10px !important;
  pointer-events: none;
}

.pagination {
  display: flex;
  gap: 8px;
}

.pagination button {
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.active {
  visibility: hidden;
  position: absolute;
}

.grey {
  font-weight: bold;
  background-color: #ddd;
}

.pagination img {
  margin: 0 5px;
}

.img {
  transform: rotate(180deg);
}

.backAndNext {
  padding: 8px 7px !important;
}

.noActive {
  pointer-events: none;
  background-color: #ddd;
}
</style>
