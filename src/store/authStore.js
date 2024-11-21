import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore({
  id: "authStore",
  state() {
    return {
      tokenInfo: JSON.parse(localStorage.getItem("tokenInfo")),
      user: null,
    };
  },
  actions: {
    isAuthenticated() {
      return this.tokenInfo && this.tokenInfo.expiresIn > new Date().getTime();
    },
    // Проверка токена и загрузка пользователя
    //  Вход в систему
    async checkTokenAndGetUser() {
      // this.tokenInfo.expiresIn
      if (this.tokenInfo && this.tokenInfo.expiresIn > new Date().getTime()) {
        // https://frost.rutime.kz/api/auth/user (post) - возвращает информацию о текущем авторизованном пользоватееле
        // (токен которого ыл предоставлен в запросе). Если запрос требует авторизацию, то в него необходимо включать заголовок Autorization со значением
        // которомы должен быть токен доступа полученый ранее от сервера
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${this.tokenInfo.accessToken}`;
        const response = await axios.post(
          "https://frost.runtime.kz/api/auth/user",
        );
        console.log(response.data);
        this.user = response.data;
      }
    },
    async login(username, password) {
      const response = await axios.post(
        "https://frost.runtime.kz/api/auth/token",
        { username, password },
      );
      const tokenInfo = {
        accessToken: response.data.access_token,
        expiresIn: new Date().getTime() + response.data.expires_in * 1_000,
      };
      localStorage.setItem("tokenInfo", JSON.stringify(tokenInfo));
      this.tokenInfo = tokenInfo;
      await this.checkTokenAndGetUser(response);
    },
    //   Выход из системы
    logout() {
      localStorage.removeItem("tokenInfo");
      this.tokenInfo = null;
      this.user = null;
    },
  },
});
