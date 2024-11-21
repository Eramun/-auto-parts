<script setup>
import Modalwindow from "@/components/Modalwindow.vue";
import { reactive, ref, watch } from "vue";
import Accountlogin from "@/components/Accountlogin.vue";
import axios from "axios";
import Loading from "@/components/Loading.vue";
import { useAuthStore } from "@/store/authStore.js";

const regActive = ref(true);
const loginActive = ref(true);
const redActive = ref(false);
const firstNameError = ref("");
const lastNameError = ref("");
const emailError = ref("");
const passwordError = ref("");
const waitingForData = ref(false);
const authStore = useAuthStore();

const userData = reactive({
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  repeatPassword: "",
});

function changeActiveLogin(localData) {
  loginActive.value = localData;
}

function logInTest() {
  loginActive.value = !loginActive.value;
}

function changeActiveReg(localActive) {
  regActive.value = localActive;
}

async function authLogIn() {
  try {
    await authStore.login(userData.email, userData.password);
    regActive.value = true;
    waitingForData.value = false;
  } catch (error) {}
}

async function registrationUser() {
  waitingForData.value = true;
  try {
    const response = await axios.post(
      "https://frost.runtime.kz/api/registration",
      userData,
    );
    firstNameError.value = "";
    lastNameError.value = "";
    emailError.value = "";
    passwordError.value = "";

    authLogIn();

    function authStoreLogInData() {
      authStore
        .login(userData.username, userData.password)
        .then(function () {})
        .catch(function () {
          //
        });
    }
  } catch (error) {
    firstNameError.value = error.response.data.errors.first_name || "";
    lastNameError.value = error.response.data.errors.last_name || "";
    emailError.value = error.response.data.errors.email || "";
    passwordError.value = error.response.data.errors.password || "";
    waitingForData.value = false;
  }
}
</script>

<template>
  <header class="header">
    <div class="mainContainer">
      <a href="/">
        <img src="../../img/img.png" height="96" width="129" />
      </a>
      <div class="cityAndNumbersContainer">
        <div class="cityAndNumber">
          <p class="city">г.Астана</p>
          <p>+7 777 777 77 77</p>
        </div>
        <div class="cityAndNumber">
          <p class="city">г.Алмата</p>
          <p>+7 777 777 77 77</p>
        </div>
      </div>
      <div class="search-container">
        <div class="search-box">
          <input class="search-input" type="text" placeholder="Поиск" />
          <div class="lupa-container">
            <img class="lupa" src="../../img/lupa.png" />
          </div>
        </div>
      </div>
      <div class="regAndEntrance">
        <div v-if="authStore.user">
          <a class="whiteText" href="/account">
            {{ authStore.user.email }}
          </a>
        </div>
        <div v-else>
          <a class="whiteText" href="" @click.prevent="logInTest"
            >Вход в личный кабинет</a
          >
        </div>

        >
        <Accountlogin
          :active="loginActive"
          :change="changeActiveLogin"
        ></Accountlogin>
        <div v-if="authStore.user">
          <a class="whiteText" href="" @click.prevent="authStore.logout()"
            >Выход из системы</a
          >
        </div>
        <div v-else>
          <a class="whiteText" href="#" @click.prevent="regActive = !regActive"
            >Зарегистрироваться</a
          >
        </div>
        <form @submit.prevent="registrationUser">
          <Modalwindow
            :active="regActive"
            :change="changeActiveReg"
            :waitingForData="waitingForData"
          >
            <p class="regText">Создание учетной записи</p>
            <div class="firstAndLastName">
              <div>
                <p class="firstNameError">{{ firstNameError[0] }}</p>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  v-model="userData.first_name"
                  placeholder="Имя"
                />
              </div>
              <div>
                <p class="firstNameError">{{ lastNameError[0] }}</p>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  v-model="userData.last_name"
                  placeholder="Фамилия"
                />
              </div>
            </div>
            <p class="firstNameError">{{ emailError[0] }}</p>

            <input
              type="text"
              id="email"
              name="email"
              v-model="userData.email"
              placeholder="Адрес электронной почты"
            />
            <p class="firstNameError">{{ passwordError[0] }}</p>

            <input
              type="text"
              id="password"
              name="password"
              v-model="userData.password"
              placeholder="Пароль"
            />
            <div v-if="userData.password !== userData.repeatPassword">
              <p class="firstNameError">Пароли не совпадают</p>
            </div>
            <div v-else></div>
            <input
              type="text"
              id="retryPassword"
              v-model="userData.repeatPassword"
              name="password_II"
              placeholder="Повторите пароль"
            />
            <button class="regButton">Зарегестрироваться</button>
            <a href="" class="login">Войти в существующую учетную запись</a>
          </Modalwindow>
        </form>
      </div>
      <div v-if="authStore.user">
        <a href="/cart/">
          <img src="../../img/basket.png" height="40" width="37" alt="Basket" />
        </a>
      </div>
      <div v-else>
        <img
          src="../../img/basket.png"
          height="40"
          width="37"
          alt="Basket"
          @click="logInTest"
        />
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  width: 100%;
  background: black;
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.mainContainer {
  display: flex;
  flex-direction: row;
  align-self: center;
  align-items: center;
  justify-content: space-between;
  width: 1170px;
  margin: 0 auto;
}

.cityAndNumbersContainer {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.cityAndNumber {
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 1.3rem;
  /*margin-bottom: 5px;*/
  padding-left: 30px;
  padding-right: 30px;
}

.search-container {
  display: flex;
  align-items: center;
}

.search-box {
  display: flex;
  align-items: center;
  background: #474747;
  border: 1px solid #6a6a6a;
  overflow: hidden;
  color: #989898;
}

.search-input {
  width: 300px;
  height: 35px;
  padding: 0 10px;
  font-size: 1rem;
  border: none;
  outline: none;
  background: transparent;
  color: rgba(255, 253, 253, 0.56);
}

.lupa-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 35px;
  width: 45px;
}

.lupa-container::before {
  content: "";
  position: absolute;
  left: -1px;
  height: 100%;
  width: 1px;
  background-color: rgba(255, 253, 253, 0.56);
}

.lupa {
  width: 20px;
  height: 20px;
  background: transparent;
  cursor: pointer;
}

.regAndEntrance {
  display: flex;
  flex-direction: column;
}

.whiteText {
  color: white;
  text-decoration: none;
  margin-left: auto;
  padding-bottom: 5px;
  font-size: 1.1rem;
}

.regText {
  font-size: 2rem;
  padding-bottom: 20px;
}

.firstAndLastName {
  display: flex;
  flex-direction: row;
  padding-bottom: 20px;
}

#firstname {
  border: 1px solid #d3d3d3;
  background: #f6f6f6;
  color: #4b4b4b;
  padding: 3px;
  width: 220px;
  font-size: 16px;
  margin-right: 20px;
}

#lastname {
  border: 1px solid #d3d3d3;
  background: #f6f6f6;
  color: #4b4b4b;
  padding: 3px;
  width: 220px;
  font-size: 16px;
}

#email {
  border: 1px solid #d3d3d3;
  background: #f6f6f6;
  color: #4b4b4b;
  padding: 3px;
  width: 470px;
  font-size: 16px;
  margin-bottom: 20px;
}

#password {
  border: 1px solid #d3d3d3;
  background: #f6f6f6;
  color: #4b4b4b;
  padding: 3px;
  width: 470px;
  font-size: 16px;
  margin-bottom: 20px;
}

#retryPassword {
  border: 1px solid #d3d3d3;
  background: #f6f6f6;
  color: #4b4b4b;
  padding: 3px;
  width: 470px;
  font-size: 16px;
  margin-bottom: 40px;
}

.regButton {
  background: #2156bd;
  width: 480px;
  height: 50px;
  font-size: 18px;
  line-height: 24.51px;
  text-align: center;
  color: #ffffff;
}

.login {
  text-decoration: none;
  font-size: 18px;
  line-height: 24.51px;
  text-align: center;
  color: #989898;
  padding-left: 100px;
  padding-top: 20px;
}

.firstNameError {
  color: red;
}
</style>
