<script setup>
import { reactive, ref } from "vue";
import { useAuthStore } from "@/store/authStore.js";
import axios from "axios";
import { useFilterStore } from "@/store/filterStore.js";
import Filtermenu from "@/components/Filtermenu.vue";

document.body.style.backgroundColor = "#F6F6F6";
const filterBrand = useFilterStore();
const activeOrder = ref(true);
const activeData = ref(false);
const activeDelivery = ref(false);
const authStore = useAuthStore();
const userData = reactive({
  phone: "+77",
  area: "",
  city: "",
  street: "",
  house: "",
  apartment: "",
});
const orderInfo = ref([]);
const personalInfo = ref({
  area: "",
  city: "",
  street: "",
  house: "",
});
function swapActiveMenu(number) {
  if (number === 1) {
    activeOrder.value = true;
    activeData.value = false;
    activeDelivery.value = false;
  } else if (number === 2) {
    activeOrder.value = false;
    activeData.value = true;
    activeDelivery.value = false;
  } else if (number === 3) {
    activeOrder.value = false;
    activeData.value = false;
    activeDelivery.value = true;
  }
}
axios.get("https://frost.runtime.kz/api/orders").then(function (response) {
  for (let datum of response.data) {
    if (personalInfo.value.area === "") {
      personalInfo.value.area = datum.area;
      personalInfo.value.city = datum.city;
      personalInfo.value.house = datum.house;
      personalInfo.value.street = datum.street;
      console.log(personalInfo.value);
    }
    if (datum.items.length > 0) {
      for (let info of datum.items) {
        let orderData = {
          description: "",
          price: "",
          id: "",
          time: "",
        };
        orderData.description = info.product.name;
        orderData.price = info.product.price;
        orderData.id = datum.id;
        orderData.time = formatDate(new Date(datum.created_at));
        orderInfo.value.push(orderData);
      }
    }
  }
});
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}
</script>
<template>
  <div class="mainContainer">
    <p class="personalAccountText">Личный кабинет</p>
    <div class="leftAndRightMenu">
      <div class="leftMenuMain">
        <div class="leftMenu">
          <img src="../../img/img_18.png" height="31" width="26" />
          <p
            :class="{ text: true, blue: activeOrder }"
            @click="swapActiveMenu(1)"
          >
            Мои Заказы
          </p>
        </div>
        <div class="leftMenu">
          <img src="../../img/img_20.png" height="31" width="31" />
          <p
            :class="{ text: true, blue: activeData }"
            @click="swapActiveMenu(2)"
          >
            Контактные данные
          </p>
        </div>
        <div class="leftMenu">
          <img class="imgG" src="../../img/img_19.png" height="31" width="31" />
          <p
            :class="{ text: true, blue: activeDelivery }"
            @click="swapActiveMenu(3)"
          >
            Доставка
          </p>
        </div>
      </div>
      <div class="rightMenuMain">
        <div :class="{ orderHistoryMain: true, hide: activeOrder }">
          <p class="orderHistory">История заказов</p>
          <div class="orderData">
            <p class="order number">Номер заказа</p>
            <p class="order product">Наименование товара</p>
            <p class="order date">Дата заказа</p>
            <p class="order price">Стомость</p>
          </div>
          <div class="test">
            <div class="orderData" v-for="datum of orderInfo">
              <p class="order number">№{{ datum.id }}</p>
              <p class="order product">{{ datum.description }}</p>
              <p class="order date">{{ datum.time }}</p>
              <p class="order price">{{ datum.price }}</p>
            </div>
          </div>
        </div>
        <div :class="{ orderHistoryMain: true, hide: activeData }">
          <p class="orderHistory">Контактные данные</p>

          <div class="personalInfo">
            <div>
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
            </div>
            <div>
              <p class="textDetails">E-mail</p>
              <input
                type="text"
                class="inputContactDetails"
                v-model="authStore.user.email"
              />
              <p class="textDetails">Телефон</p>
              <div
                v-if="
                  userData.phone.length < 12 || /[^0-9+]/.test(userData.phone)
                "
              ></div>
              <input
                type="tel"
                class="inputContactDetails"
                v-model="userData.phone"
              />
            </div>
          </div>
          <a class="changePassword" href="">Изменить пароль</a>
        </div>
        <div :class="{ orderHistoryMain: true, hide: activeDelivery }">
          <p class="orderHistory">Контактные данные</p>

          <div class="personalInfo">
            <div>
              <p class="textDetails">Страна</p>

              <input type="text" class="inputContactDetails" />
              <p class="textDetails">Регион/Область</p>
              <input
                type="text"
                class="inputContactDetails"
                v-model="personalInfo.area"
              />
              <p class="textDetails">Город или поселок</p>
              <input
                type="text"
                class="inputContactDetails"
                v-model="personalInfo.city"
              />
            </div>
            <div>
              <p class="textDetails">Улица</p>
              <input
                type="text"
                class="inputContactDetails"
                v-model="personalInfo.street"
              />
              <p class="textDetails">Дом</p>
              <input
                type="text"
                class="inputContactDetails"
                v-model="personalInfo.house"
              />
              <p class="textDetails">Квартира</p>
              <input type="text" class="inputContactDetails" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <button :class="{ confirmOrder: true, hide: activeData }">
      Сохранить изменения
    </button>
    <button :class="{ confirmOrder: true, hide: activeDelivery }">
      Сохранить изменения
    </button>
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
  display: flex;
  flex-direction: column;
}
.leftAndRightMenu {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  margin-bottom: 40px;
}
.personalAccountText {
  font-size: 3rem;
}
.leftMenuMain {
  width: 350px;
  height: 200px;
  display: flex;
  flex-direction: column;
  background: white;
  font-size: 1.7rem;
  justify-content: space-between;
  padding: 50px 30px 50px 30px;
  margin-right: 50px;
}
.leftMenu {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
}
.text {
  padding-left: 15px;
  cursor: pointer;
}
.rightMenuMain {
  background: white;
  width: 100%;
  padding: 50px;
}
.blue {
  color: #2156bd;
}
.orderData {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid #d3d3d3;
  padding-top: 20px;
  padding-bottom: 20px;
}
.order {
  font-size: 1.5rem;
}
.number {
  width: 140px;
  margin-left: 10px;
}
.product {
  width: 300px;
}
.date {
  width: 130px;
}
.price {
  width: 130px;
}
.orderHistory {
  font-size: 2rem;
  margin-bottom: 30px;
}
.orderHistoryMain {
  display: none;
}
.confirmOrder {
  display: none;
  justify-content: center;
  width: 300px;
  height: 40px;
  align-items: center;
  align-self: flex-end;
  margin-top: 40px;
  margin-bottom: 40px;
  background: #2156bd;
  color: white;
  font-size: 1.2rem;
}
.hide {
  display: flex;
  flex-direction: column;
}
.textDetails {
  font-size: 25px;
  font-weight: 600;
  text-align: left;
  color: #646464;
  padding-bottom: 10px;
  padding-top: 10px;
}
.inputContactDetails {
  font-size: 20px;
  font-weight: 200;
  padding-left: 10px;

  width: 350px;
  height: 35px;
  background: #f6f6f6;
  border: 1px solid #d3d3d3;
}
.alertText {
  color: red;
}
.personalInfo {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.changePassword {
  align-self: flex-end;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2156bd;
}
.test {
  height: 350px;
  overflow-y: scroll;
}
</style>
