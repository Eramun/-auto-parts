import { defineStore } from "pinia";
import axios from "axios";

export const useFilterStore = defineStore("filter", {
  state: () => ({
    selectedBrandId: 0,
    selectedModelId: 0,
    selectedGenerationId: 0,
    available: false,
    brands: [],
    modelName: [],
    generation: [],
    loadingModel: false,
    loadingGeneration: false,
  }),
  actions: {
    setBrand(id) {
      this.selectedBrandId = id;
    },
    setModel(id) {
      this.selectedModelId = id;
    },
    setGeneration(id) {
      this.selectedGenerationId = id;
    },
    toggleAvailability() {
      this.available = !this.available;
    },
    resetFilters() {
      this.selectedBrandId = 0;
      this.selectedModelId = 0;
      this.selectedGenerationId = 0;
      this.available = false;
    },
    async fetchBrands() {
      try {
        const response = await axios.get("https://frost.runtime.kz/api/brands");
        this.brands = response.data.map((datum) => ({
          name: datum.name,
          id: datum.id,
        }));
      } catch (error) {
        console.error("Ошибка при получении брендов:", error);
      }
    },
    async fetchModel() {
      this.modelName = [];
      this.selectedModelId = 0;
      this.selectedGenerationId = 0;
      this.loadingModel = true;

      if (this.selectedBrandId === 0) {
        return;
      }

      try {
        const response = await axios.get(
          `https://frost.runtime.kz/api/models?brandId=${this.selectedBrandId}`,
        );

        this.modelName = response.data.map((datum) => ({
          name: datum.name,
          id: datum.id,
        }));
        this.loadingModel = false;
        this.loadingGeneration = false;
      } catch (error) {
        console.error("Ошибка при получении моделей:", error);
      }
    },
    async fetchGeneration() {
      this.generation = [];
      this.selectedGenerationId = 0;
      this.loadingGeneration = true;

      if (this.selectedBrandId === 0) {
        return;
      }
      try {
        const response = await axios.get(
          `https://frost.runtime.kz/api/generations?modelId=${this.selectedModelId}`,
        );
        this.generation = response.data.map((datum) => ({
          name: datum.name,
          id: datum.id,
        }));
        this.loadingGeneration = false;
      } catch (error) {
        console.error("Ошибка при получении поколения", error);
      }
    },
    async availableSwap() {
      this.available = !this.available;
    },
  },
});
