<script setup>
import { useRoute } from "vue-router";
import { reactive, ref } from "vue";
import axios from "axios";
import { useAuthStore } from "@/store/authStore.js";

const route = useRoute();
document.body.style.backgroundColor = "#F6F6F6";
const paymentMethod = [
  "Оплата при получении",
  "Банковской картой",
  "Предоплата наличными",
];
const selectedPaymentMethod = ref(paymentMethod[1]);
const paymentMethodActive = ref(false);
const productInCart = ref([]);
const allPrice = ref(0);
const oneActive = ref(false);
const twoActive = ref(true);
const threeActive = ref(true);
const fourActive = ref(true);
const userData = reactive({
  phone: "+77",
  area: "",
  city: "",
  street: "",
  house: "",
  apartment: "",
});
const orderId = ref("");
const authStore = useAuthStore();
console.log(authStore.user);

function swapPaymentMethod(method) {
  selectedPaymentMethod.value = method;
  paymentMethodActive.value = !paymentMethodActive.value;
}

axios
  .get("https://frost.runtime.kz/api/cart")
  .then(function (response) {
    for (let datum of response.data.items) {
      productInCart.value.push({
        description: datum.product.description,
        price: datum.product.price,
        code: datum.product.code,
        count: datum.count,
        id: datum.product.id,
      });
      allPrice.value += datum.product.price * datum.count;
    }
  })
  .catch(function (error) {
    console.error(error);
  });
const increaseQuantity = (index, id) => {
  const product = productInCart.value[index];
  if (product) {
    product.count++;
    allPrice.value += product.price;
  }
  axios.get(`https://frost.runtime.kz/api/cart/increase?productId=${id}`);
};
const decreaseQuantity = (index, id) => {
  const product = productInCart.value[index];
  if (product && product.count > 1) {
    product.count--;
    allPrice.value -= product.price;
    axios.get(`https://frost.runtime.kz/api/cart/decrease?productId=${id}`);
  } else {
    axios.get(`https://frost.runtime.kz/api/cart/delete?productId=${id}`);
    productInCart.value.splice(index, 1);
  }
};
const delInCart = (id, index) => {
  axios.get(`https://frost.runtime.kz/api/cart/delete?productId=${id}`);
  productInCart.value.splice(index, 1);
};

function swapActiveMenu(active) {
  if (active === 1) {
    oneActive.value = false;
    twoActive.value = true;
    threeActive.value = true;
    fourActive.value = true;
  } else if (active === 2) {
    oneActive.value = true;
    twoActive.value = false;
    threeActive.value = true;
    fourActive.value = true;
  } else if (active === 3) {
    if (userData.phone.length === 12) {
      oneActive.value = true;
      twoActive.value = true;
      threeActive.value = false;
      fourActive.value = true;
    } else {
      oneActive.value = true;
      twoActive.value = false;
      threeActive.value = true;
      fourActive.value = true;
    }
  } else if (active === 4) {
    if (orderId.value) {
      oneActive.value = true;
      twoActive.value = true;
      threeActive.value = true;
      fourActive.value = false;
    } else {
      oneActive.value = true;
      twoActive.value = true;
      threeActive.value = false;
      fourActive.value = true;
    }
  }
}

async function addAnOrder() {
  try {
    const response = await axios.post(
      "https://frost.runtime.kz/api/orders",
      userData,
    );
    console.log("информация добавлена", response.data);
    orderId.value = response.data;
  } catch (error) {
    console.log("информация не добавлена", error);
  }
}
</script>

<template>
  <div class="mainContainer">
    <div class="headAndSwapBox">
      <p class="placingOrder">Оформление заказа</p>
      <div class="allSwapBox">
        <div
          :class="{ swapBox: true, one: oneActive }"
          @click="swapActiveMenu(1)"
        >
          <p>Корзина</p>
        </div>
        <div
          :class="{ swapBox: true, one: twoActive }"
          @click="swapActiveMenu(2)"
        >
          <p>Контактные данные</p>
        </div>
        <div
          :class="{ swapBox: true, one: threeActive }"
          @click="swapActiveMenu(3)"
        >
          <p>Доставка</p>
        </div>
        <div
          :class="{ swapBox: true, one: fourActive }"
          @click="swapActiveMenu(4)"
        >
          <p>Завершение</p>
        </div>
      </div>
    </div>
    <div :class="{ cartMain: true, nonVisibility: oneActive }">
      <div class="cart">
        <div>
          <p class="cartText">Корзина</p>
          <div class="nameCountPrice">
            <p class="nameCountPriceText">Наименование товара</p>
            <div class="CountPrice">
              <p class="nameCountPriceText">Количество</p>
              <p class="nameCountPriceText">Цена</p>
            </div>
          </div>
          <div v-for="(product, index) in productInCart" :key="product.id">
            <div class="productMenu">
              <div class="leftProductMenu">
                <p class="description">{{ product.description }}</p>
                <div class="codeAndDelProduct">
                  <p>Артикул:{{ product.code }}</p>
                  <button class="del" @click="delInCart(product.id, index)">
                    Удалить из корзины
                  </button>
                </div>
              </div>
              <div class="rightProductMenu">
                <div class="count">
                  <button
                    class="buttonPlusAndMinus"
                    @click="decreaseQuantity(index, product.id)"
                  >
                    -
                  </button>
                  <div class="countProduct">{{ product.count }}</div>
                  <button
                    class="buttonPlusAndMinus"
                    @click="increaseQuantity(index, product.id)"
                  >
                    +
                  </button>
                </div>
                <p class="priceProductText">
                  {{ product.price * product.count }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="footMain">
          <div class="paymentMethodMain">
            <p class="paymentMethod">Способ оплаты</p>
            <div
              class="selectedPayment"
              @click="paymentMethodActive = !paymentMethodActive"
            >
              {{ selectedPaymentMethod
              }}<img src="../../img/img_6.png" height="10" width="20" />
            </div>
            <div
              :class="{ dropDownActive: paymentMethodActive, dropDown: true }"
            >
              <div v-for="method of paymentMethod">
                <div class="selectedPayment" @click="swapPaymentMethod(method)">
                  {{ method }}
                </div>
              </div>
            </div>
          </div>
          <div class="allPriceMain">
            <p class="allPrice">Итого к оплате:</p>
            <p class="allPriceSum">{{ allPrice }} тг</p>
          </div>
        </div>
      </div>
      <button class="confirmOrder">Оформить заказ</button>
    </div>
    <div :class="{ cartMain: true, nonVisibility: twoActive }">
      <div class="cart">
        <p class="cartText">Контактные данные</p>
        <div class="contactDetails">
          <div class="contactDetailsLeft">
            <p class="textDetails">Фамилия</p>
            <input
              type="text"
              class="inputContactDetails"
              v-model="authStore.user.lastName"
            />
            <p class="textDetails">Имя</p>
            <input
              type="text"
              class="inputContactDetails"
              v-model="authStore.user.firstName"
            />
            <p class="textDetails">Отчество</p>
            <input
              type="text"
              class="inputContactDetails"
              v-model="authStore.user.lastName"
            />
            <p class="textDetails">Телефон</p>
            <div
              v-if="
                userData.phone.length < 12 || /[^0-9+]/.test(userData.phone)
              "
            >
              <p class="alertText">Неверный формат номера телефона</p>
            </div>

            <input
              type="tel"
              class="inputContactDetails"
              v-model="userData.phone"
            />
          </div>
          <div class="greyLine"></div>
          <div class="contactDetailsRight">
            <p class="textDetails">E-mail</p>
            <input
              type="text"
              class="inputContactDetails"
              v-model="authStore.user.email"
            />
            <p class="textDetails">Пароль</p>
            <input type="text" class="inputContactDetails" />
            <p class="textDetails">Повторите пароль</p>
            <input type="text" class="inputContactDetails" />
          </div>
        </div>
      </div>
      <button class="confirmOrder" @click="swapActiveMenu(3)">
        Подтвердить
      </button>
    </div>
    <div :class="{ cartMain: true, nonVisibility: threeActive }">
      <div class="cart">
        <p class="cartText">Доставка</p>
        <div class="contactDetails">
          <div class="contactDetailsLeft">
            <p class="textDetails">Область</p>
            <input
              type="text"
              class="inputContactDetails"
              v-model="userData.area"
            />
            <p class="textDetails">Город или поселок</p>
            <input
              type="text"
              class="inputContactDetails"
              v-model="userData.city"
            />
          </div>
          <div class="greyLineHome"></div>
          <div class="contactDetailsRight">
            <p class="textDetails">Улица</p>
            <input
              type="text"
              class="inputContactDetails"
              v-model="userData.street"
            />
            <div class="home">
              <div class="homeTextInput">
                <p class="textDetails">Дом</p>
                <input
                  type="text"
                  class="inputContactDetailsHome"
                  v-model="userData.house"
                />
              </div>
              <div class="homeTextInput right">
                <p class="textDetails">Квартира</p>
                <input
                  type="text"
                  class="inputContactDetailsHome"
                  v-model="userData.apartment"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <button class="confirmOrder" @click="addAnOrder">Оформить заказ</button>
    </div>

    <div :class="{ cartMain: true, nonVisibility: fourActive }">
      <div class="cart">
        <div v-if="orderId.length !== 0">
          <p class="cartText">Заказ успешно создан</p>
          <div class="endOrder">
            <img src="../../img/img_17.png" height="60" width="60" />
            <p class="textDetails">
              Заказ №{{ orderId }} был создан. <br />Вы можете просмотреть
              список всех ваших заказов в личном кабинете.
            </p>
            <a href="">Перейти в личный кабинет</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
body {
  background: blue;
}

.mainContainer {
  width: 1170px;
  align-self: center;
  margin-top: 40px;
}

.headAndSwapBox {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.allSwapBox {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.placingOrder {
  font-size: 2.3rem;
}

.swapBox {
  width: 210px;
  height: 40px;
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.swapBox {
  background: #2156bd;
  cursor: pointer;
}

.swapBox.two {
  color: #9e9e9e;
  border: 1px solid #e5e5e5;
  background: white;
}

.swapBox.three {
  color: #9e9e9e;
  border: 1px solid #e5e5e5;
  background: white;
}

.swapBox.four {
  color: #9e9e9e;
  border: 1px solid #e5e5e5;
  background: white;
}

/*.swapBox.one:after {*/
/*  content: "";*/
/*  position: absolute;*/
/*  right: -40px;*/
/*  border: 20px solid transparent;*/
/*  border-left: 20px solid #2156bd;*/
/*}*/
/*.swapBox.two:after {*/
/*  content: "";*/
/*  position: absolute;*/
/*  right: -40px;*/
/*  border: 20px solid grey;*/
/*  border-left: 20px solid white;*/
/*}*/

.cartMain {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
}

.cart {
  width: calc(100% - 100px);
  background: white;
  /*height: 635px;*/
  align-self: center;
  margin-top: 40px;
  border: 1px solid #e5e5e5;
  padding: 70px 50px 70px 50px;
}

.cartText {
  font-size: 2.5rem;
}

.nameCountPrice {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.CountPrice {
  display: flex;
  flex-direction: row;
  width: 350px;
  justify-content: space-between;
}

.nameCountPriceText {
  font-size: 1.8rem;
}

.confirmOrder {
  width: 300px;
  height: 40px;
  align-self: flex-end;
  margin-top: 40px;
  margin-bottom: 40px;
}

.footMain {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 50px;
}

.allPriceMain {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 25px;
}

.allPrice {
  font-size: 2rem;
  padding-right: 50px;
}

.allPriceSum {
  font-size: 2rem;
}

.paymentMethod {
  font-size: 1.2rem;
  color: #646464;
}

.paymentMethodMain {
  width: 400px;
}

.selectedPayment {
  display: flex;
  justify-content: space-between;
  padding: 3px 15px 3px 15px;
  align-items: center;
  width: 419px;
  height: 35px;
  background: #f6f6f6;
  font-size: 1.2rem;
  border: 1px solid #d3d3d3;
}

.dropDown {
  visibility: hidden;
  opacity: 0;
  position: absolute;
}

.dropDownActive {
  visibility: visible;
  opacity: 1;
}

.productMenu {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 50px;
  border-bottom: 1px solid #d3d3d3;
  padding-bottom: 40px;
}

.leftProductMenu {
  display: flex;
  flex-direction: column;
  width: 750px;
}

.codeAndDelProduct {
  display: flex;
  flex-direction: row;
  width: 300px;
  justify-content: space-between;
  color: #7a7a7a;
}

.rightProductMenu {
  display: flex;
  flex-direction: row;
  width: 350px;
  justify-content: space-between;
}

.count {
  display: flex;
  flex-direction: row;
}

.buttonPlusAndMinus {
  width: 30px;
  font-size: 2rem;
  border: none;
  background: white;
  align-self: center;
}

.countProduct {
  font-size: 1.5rem;
  align-self: center;
  padding: 0 10px 0 10px;
}

.priceProductText {
  font-size: 1.5rem;
  align-self: center;
}

.del {
  color: #2156bd;
}

.description {
  padding-bottom: 20px;
  font-size: 1.3rem;
}

.confirmOrder {
  background: #2156bd;
  color: white;
  font-size: 1.2rem;
}

.nonVisibility {
  visibility: hidden;
  opacity: 0;
  display: none;
}

.one {
  cursor: pointer;
  color: #9e9e9e;
  border: 1px solid #e5e5e5;
  background: white;
}

.contactDetails {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.contactDetailsLeft {
  width: 600px;
}

.contactDetailsRight {
  width: 600px;
}

.inputContactDetails {
  font-size: 20px;
  font-weight: 200;
  padding-left: 10px;

  width: 430px;
  height: 35px;
  background: #f6f6f6;
  border: 1px solid #d3d3d3;
}

.inputContactDetailsHome {
  font-size: 20px;
  font-weight: 200;
  padding-left: 10px;
  width: 200px;
  height: 35px;
  background: #f6f6f6;
  border: 1px solid #d3d3d3;
}

.inputContactDetailsHome.right {
  margin-left: 20px;
}

.greyLine {
  border: 1px solid #d3d3d3;
  height: 500px;
  margin-left: 20px;
  margin-right: 100px;
}

.greyLineHome {
  border: 1px solid #d3d3d3;
  height: 200px;
  margin-left: 20px;
  margin-right: 100px;
}

.textDetails {
  font-size: 25px;
  font-weight: 600;
  text-align: left;
  color: #646464;
  padding-bottom: 10px;
  padding-top: 10px;
}

.home {
  display: flex;
  flex-direction: row;
}

.homeTextInput {
  display: flex;
  flex-direction: column;
}

.homeTextInput.right {
  margin-left: 30px;
}

.alertText {
  color: red;
}
.endOrder {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
