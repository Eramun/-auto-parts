import "./assets/main.css";
import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import MainPage from "@/pages/MainPage.vue";
import CartPage from "@/pages/CartPage.vue";
import { createPinia } from "pinia";
import { useAuthStore } from "@/store/authStore.js";
import ProductPage from "@/pages/ProductPage.vue";
import PersonalAccount from "@/components/PersonalAccount.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: MainPage },
    // { path: "/products/:productId", component: MainPage },
    { path: "/products/:productId", component: ProductPage },
    { path: "/cart", component: CartPage, meta: { auth: true } },
    { path: "/account", component: PersonalAccount, meta: { auth: true } },
  ],
});
router.beforeEach(async function (to, from, next) {
  const authStore = useAuthStore();
  await authStore.checkTokenAndGetUser();
  if (to.meta.auth) {
    if (authStore.isAuthenticated()) {
      next();
    } else {
      next("/");
    }
  } else {
    next();
  }
});

const app = createApp(App);
app.use(router);
const pinia = createPinia();
app.use(pinia);
app.mount("#app");
