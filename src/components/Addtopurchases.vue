<script setup>
import Modalwindow from "@/components/Modalwindow.vue";
import { ref, defineProps, watch, onMounted, onBeforeUnmount } from "vue";
import axios from "axios";
import { useAuthStore } from "@/store/authStore.js";
import Accountlogin from "@/components/Accountlogin.vue";

const props = defineProps({
  active: Boolean,
  specification: String,
  productId: String,
  change: Function,
  available: String,
});

const authStore = useAuthStore();
const quantityOfGoods = ref(1);
const localActive = ref(props.active);
const waitingForData = ref(false);
const loginActive = ref(true);

watch(
  () => props.active,
  (newVal) => {
    localActive.value = newVal;
  },
);

function changeActive(localdata) {
  props.change(localdata);
}

const increaseQuantity = () => {
  quantityOfGoods.value += 1;
};

const decreaseQuantity = () => {
  if (quantityOfGoods.value > 1) {
    quantityOfGoods.value -= 1;
  }
};

function increaseQuantityAndBlur(event) {
  increaseQuantity();
  event.target.blur();
}

function decreaseQuantityAndBlur(event) {
  decreaseQuantity();
  event.target.blur();
}

function addProductCart() {
  axios
    .get(
      `https://frost.runtime.kz/api/cart/add?productId=${props.productId}&count=${quantityOfGoods.value}`,
    )
    .then((response) => {
      console.log("Добавлен в корзину", response.data);
      localActive.value = !localActive.value;
    })
    .catch((error) => {
      console.error("Ошибка", error);
    });
}

function logInTest() {
  loginActive.value = !loginActive.value;
}

function changeActiveLogin(localData) {
  loginActive.value = localData;
}

function handleKeydown(event) {
  if (event.key === "ArrowLeft") {
    decreaseQuantity();
  } else if (event.key === "ArrowRight") {
    increaseQuantity();
  } else if (event.key === "Enter") {
    addProductCart();
  }
}
onMounted(() => {
  console.log("mounted");
  document.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  console.log("unmounted");
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <form @submit.prevent="addProductCart">
    <Modalwindow
      :active="localActive"
      v-if="localActive === false"
      :change="changeActive"
    >
      <p class="regText">Товар добавлен в корзину</p>
      <p class="descriptionText">{{ props.specification }}</p>
      <div class="quantityContainer">
        <p class="quantityText">Укажите количество:</p>
        <button
          type="button"
          class="quantityButton"
          @click="decreaseQuantityAndBlur"
        >
          -
        </button>
        <div class="quantityDisplay">{{ quantityOfGoods }}</div>
        <button
          type="button"
          class="quantityButton"
          @click="increaseQuantityAndBlur"
        >
          +
        </button>
      </div>
      <div v-if="authStore.user">
        <div v-if="props.available === 1">
          <button type="submit" class="orderButton">Оформить заказ</button>
        </div>
        <div v-else>
          <button
            type="button"
            class="orderButton"
            style="background: #6a6a6a; cursor: default"
            disabled
          >
            Оформить заказ
          </button>
        </div>
      </div>
      <div v-else>
        <button type="button" class="orderButton" @click="logInTest">
          Вход в личный кабинет
        </button>
      </div>

      <a href="" class="continueShopping">Продолжить выбор товаров</a>
    </Modalwindow>
  </form>

  <Accountlogin
    :active="loginActive"
    :change="changeActiveLogin"
  ></Accountlogin>
</template>

<style scoped>
.regText {
  font-size: 2.5rem;
  padding-bottom: 20px;
}

.descriptionText {
  font-size: 1.3rem;
  padding-bottom: 20px;
}

.quantityContainer {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
}

.quantityButton {
  border: none;
  background: white;
  padding: 10px;
  font-size: 1.5rem;
  cursor: pointer;
}

.quantityDisplay {
  border: 1px solid #d3d3d3;
  margin: 0 15px;
  padding: 5px 15px 5px 15px;
  font-size: 2rem;
}

.quantityText {
  font-size: 1.3rem;
}

.orderButton {
  background: #2156bd;
  width: 480px;
  height: 60px;
  font-size: 20px;
  line-height: 24.51px;
  text-align: center;
  color: #ffffff;
  margin-bottom: 20px;
  cursor: pointer;
}

.continueShopping {
  align-self: center;
  text-decoration: none;
  font-size: 20px;
  line-height: 24.51px;
  text-align: center;
  color: #989898;
}
</style>
