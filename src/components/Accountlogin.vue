<script setup>
import Modalwindow from "@/components/Modalwindow.vue";
import axios from "axios";
import { reactive, ref, watch } from "vue";
import { useAuthStore } from "@/store/authStore.js";

const props = defineProps({
  active: Boolean,
  change: Function,
});
const userData = reactive({
  username: "",
  password: "",
});
const userNameError = ref("");
const passwordError = ref("");
const waitingForData = ref(false);
const authStore = useAuthStore();
const localActive = ref(props.active);

watch(
  () => props.active,
  (newVal) => {
    localActive.value = newVal;
  },
);

async function logIn() {
  waitingForData.value = true;
  try {
    const response = await axios.post(
      "https://frost.runtime.kz/api/auth/token",
      userData,
    );
    userNameError.value = "";
    waitingForData.value = false;
  } catch (error) {
    if (error) {
      userNameError.value = "Invalid email or password information";
    } else {
      userNameError.value = "";
    }
    waitingForData.value = false;
  }
}

function authStoreLogInData() {
  authStore
    .login(userData.username, userData.password)
    .then(function () {
      console.log("--- auth store");
      console.log(authStore.tokenInfo);
      console.log(authStore.user);
      localActive.value = true;
      userData.username = "";
      userData.password = "";
      userNameError.value = "";
      passwordError.value = "";
    })
    .catch(function () {
      logIn();
    });
}
function changeActiveLogin(localdata) {
  props.change(localdata);
}
</script>

<template>
  <form @submit.prevent="authStoreLogInData" style="z-index: 100000">
    <Modalwindow
      :active="localActive"
      :waiting-for-data="waitingForData"
      :change="changeActiveLogin"
    >
      <p class="regText">Вход в учетную запись</p>
      <p class="error">{{ userNameError }}</p>
      <input
        type="text"
        id="email"
        name="lastname"
        v-model="userData.username"
        placeholder="Адрес электронной почты"
        class="inputField"
      />
      <input
        type="password"
        id="password"
        name="lastname"
        v-model="userData.password"
        placeholder="Пароль"
        class="inputField"
      />
      <a href="" class="forgotPassword">Забыли пароль?</a>
      <button class="regButton">Войти</button>
      <a href="" class="login">Создать новую учетную запись</a>
    </Modalwindow>
  </form>
</template>

<style scoped>
.regText {
  font-size: 2rem;
  padding-bottom: 20px;
}

.inputField {
  border: 1px solid #d3d3d3;
  background: #f6f6f6;
  color: #4b4b4b;
  padding: 3px;
  width: 470px;
  font-size: 16px;
  margin-bottom: 20px;
}

.forgotPassword {
  align-self: flex-end;
  margin-right: 26px;
  text-decoration: none;
  font-size: 16px;
  line-height: 24.51px;
  color: #2156bd;
  display: block;
  margin-bottom: 20px;
}

.regButton {
  background: #2156bd;
  width: 480px;
  height: 50px;
  font-size: 18px;
  line-height: 24.51px;
  text-align: center;
  color: #ffffff;
  margin-bottom: 20px;
}

.login {
  align-self: center;
  text-decoration: none;
  font-size: 18px;
  line-height: 24.51px;
  text-align: center;
  color: #989898;
}

.error {
  color: red;
}
</style>
