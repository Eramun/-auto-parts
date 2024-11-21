<script setup>
import axios from "axios";
import { useRoute } from "vue-router";
import { reactive, ref, watch } from "vue";
import Accountlogin from "@/components/Accountlogin.vue";
import { useAuthStore } from "@/store/authStore.js";
import imageA from "../../img/img_11.png";
import imageB from "../../img/img_12.png";
import imageC from "../../img/img_13.png";
import imageD from "../../img/img_14.png";
import imageE from "../../img/img_15.png";
import Addtopurchases from "@/components/Addtopurchases.vue";
const route = useRoute();
const product = ref({});
const available = ref("нет в наличии");
const reviews = ref({});
const loginActive = ref(true);
const authStore = useAuthStore();
const userReview = reactive({
  review: "",
  product_id: route.params.productId,
});
const brandActive = ref(true);
const reviewState = ref();
const productImg = ref([imageA, imageB, imageC, imageD]);
const currentImage = ref(imageA);
const buyActive = ref(true);

function logInTest() {
  loginActive.value = !loginActive.value;
}

function changeActiveLogin(localData) {
  loginActive.value = localData;
  console.log(111);
}

async function addClientReview() {
  try {
    const response = await axios.post(
      "https://frost.runtime.kz/api/reviews",
      userReview,
    );
    console.log("Отзыв добавлен", response.data);
    window.location.reload();
  } catch (error) {
    console.error("Отзыв не добавлен", error);
  }
}

axios
  .get(
    `https://frost.runtime.kz/api/reviews/exists?productId=${route.params.productId}`,
  )
  .then((response) => {
    reviewState.value = response.data;
    console.log(response.data);
  })
  .catch((error) => {
    console.error("Ошибка отзыва", error);
  });

axios
  .get("https://frost.runtime.kz/api/products/" + route.params.productId)
  .then(function (response) {
    product.value.id = response.data.id;
    product.value.name = response.data.name;
    product.value.price = response.data.price;
    product.value.description = response.data.description;
    product.value.code = response.data.code;
    product.value.manufacturer = response.data.manufacturer;
    product.value.brand = response.data.brand;
    product.value.model = response.data.model;
    product.value.generation = response.data.generation;
    product.value.available = response.data.available;
    if (response.data.available === 1) {
      available.value = "В наличии";
    } else {
      available.value = "Нет в наличии";
    }
  });

watch(
  () => product.value.id,
  (newId) => {
    if (newId) {
      axios
        .get(`https://frost.runtime.kz/api/reviews?productId=${newId}`)
        .then(function (response) {
          const reviewsArray = [];
          for (let i = 0; i < response.data.length; i++) {
            const review = response.data[i];
            reviewsArray.push({
              firstName: review.user.firstName,
              lastName: review.user.lastName,
              review: review.review,
            });
          }
          reviews.value = reviewsArray;
        });
    }
  },
);
function swapBrandActive() {
  brandActive.value = !brandActive.value;
}
function switchImage(index) {
  const oldImage = currentImage.value;
  currentImage.value = productImg.value[index];
}
function changeActiveBuy(localActive) {
  buyActive.value = localActive;
}
function buy() {
  buyActive.value = !buyActive.value;
}
</script>

<template>
  <div class="mainContainer">
    <div class="imgSpecificationPrice">
      <div class="img">
        <div class="blueBox">
          <img :src="currentImage" alt="Alt text..." />
        </div>
        <div class="miniImg">
          <div
            class="miniBlueBox"
            v-for="(image, index) in productImg"
            :key="index"
            @click="switchImage(index)"
          >
            <img :src="image" alt="Alt text..." />
          </div>
        </div>
      </div>
      <div class="specification">
        <div class="name">
          <p>{{ product.name }}</p>
        </div>
        <div class="codeManDes">
          <p>Артикул:{{ product.code }}</p>
        </div>
        <div class="codeManDes">
          <p>Производитель:{{ product.manufacturer }}</p>
        </div>
        <div class="codeManDes">
          <p>Описание:{{ product.description }}</p>
        </div>
      </div>
      <div class="price">
        <div>
          <div class="productPrice">
            <p>{{ product.price }} тг</p>
          </div>

          <div class="availableDiv" v-if="available === 'В наличии'">
            <img
              class="availableImg"
              src="../../img/img_5.png"
              height="21"
              width="21"
            />
            <p class="available">{{ available }}</p>
          </div>
          <div class="availableDiv" v-else>
            <img
              class="availableImg"
              src="../../img/img_7.png"
              height="21"
              width="21"
            />
            <p class="available">{{ available }}</p>
          </div>

          <div class="city">
            <p>г.Астана</p>
            <p>г.Алмата</p>
          </div>
          <div v-if="product.available === 1">
            <button class="button" @click="buy">Купить</button>
          </div>
          <div v-else>
            <button class="button" style="background: #6a6a6a" disabled>
              Купить
            </button>
          </div>

          <Addtopurchases
            :active="buyActive"
            :productId="product.id"
            :specification="product.description"
            :available="product.available"
            :change="changeActiveBuy"
          >
          </Addtopurchases>
        </div>
      </div>
    </div>
    <div class="downMenu">
      <div class="applicability">
        <p class="reviewText">Применим к автомобилям:</p>
        <div class="autoApplicability">
          <div class="brandAndModel">
            <div class="brand" v-if="brandActive" @click="swapBrandActive">
              <img src="../../img/img_9.png" height="18" width="19" />
              {{ product.brand.name }}
            </div>
            <div class="brand" v-else @click="swapBrandActive">
              <img src="../../img/img_10.png" height="5" width="16" />
              {{ product.brand.name }}
            </div>
            <div class="model" v-if="!brandActive">
              <p>{{ product.model.name }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="reviewMain">
        <div class="review">
          <p class="reviewHead">Отзывы</p>
          <div v-if="authStore.user">
            <div v-if="reviewState">
              <p class="reviewAlert">
                Вы не может оставить больше отзывов об этом товаре
              </p>
            </div>
            <div v-else>
              <div class="addReviewDiv">
                <textarea
                  id="review"
                  name="firstReview"
                  v-model="userReview.review"
                  placeholder="Оставьте отзыв о товаре"
                  class="inputReview"
                  rows="4"
                  cols="50"
                ></textarea>
                <button class="addReview" @click="addClientReview">
                  Оставить отзыв
                </button>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="textAndLink">
              <p class="reviewText">Чтобы оставить отзыв</p>
              <button class="reviewLink" @click="logInTest">
                Войдите на сайт
              </button>
            </div>
          </div>
        </div>
        <div class="clientReview">
          <div class="newReview" v-for="review in reviews" :key="review.id">
            <div class="firstAndLastNameDiv">
              <p class="firstAndLastName">
                Имя:{{ review.firstName }} Фамилия: {{ review.lastName }}
              </p>
            </div>
            <p class="reviewTextSize">Отзыв:{{ review.review }}</p>
          </div>
        </div>
      </div>
    </div>
    <Accountlogin
      :active="loginActive"
      :change="changeActiveLogin"
    ></Accountlogin>
  </div>
</template>

<style scoped>
.mainContainer {
  width: calc(100% - 600px);
  align-self: center;
  margin-top: 40px;
  margin-bottom: 40px;
}

.imgSpecificationPrice {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.specification {
  width: 500px;
  height: 400px;
  /*background: red;*/
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /*padding: 0 60px 60px 60px;*/
}

.name {
  font-weight: 500;
  font-size: 2rem;
}

.codeManDes {
  color: #6a6a6a;
  font-size: 1.3rem;
}

.blueBox {
  width: 400px;
  height: 400px;
  margin-bottom: 20px;
}
.blueBox img {
  width: 100%;
  height: 100%;
}

.miniImg {
  display: flex;
  flex-direction: row;
}

.miniBlueBox {
  margin-right: 20px;
  width: 70px;
  height: 70px;
  border: 1px solid #000;
}

.miniBlueBox img {
  width: 100%;
  height: 100%;
}

.price {
  height: 200px;
  background: rgba(128, 128, 128, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.productPrice {
  display: flex;
  justify-content: center;
  font-size: 2.3rem;
  font-weight: 700;
}

.availableDiv {
  display: flex;
  flex-direction: row;
  padding-top: 10px;
  padding-bottom: 10px;
}

.img {
  padding-top: 4px;
  padding-right: 7px;
}

.available {
  font-size: 1.5rem;
  display: flex;
  justify-content: center;

  padding-left: 10px;
}

.availableImg {
  display: flex;
  align-self: center;
}

.city {
  display: flex;
  flex-direction: column;
  padding-left: 28px;
  padding-bottom: 20px;
  font-size: 1.2rem;
  color: grey;
}

.button {
  width: 200px;
  height: 40px;
  margin-top: 10px;
  font-weight: 700;
  font-size: 1.2rem;
  background: #2156bd;
  color: white;
}

.downMenu {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 50px;
}

.applicability {
  padding-top: 40px;
}

.autoApplicability {
  width: 400px;
  height: 500px;
  border: 2px solid rgba(128, 128, 128, 0.4);
}

.reviewMain {
  width: 800px;
  height: 400px;
}

.reviewHead {
  font-size: 2rem;
  font-weight: 700;
}

.textAndLink {
  display: flex;
  flex-direction: row;
}

.reviewText {
  font-size: 1.5rem;
  color: grey;
}

.reviewLink {
  text-decoration: underline;
  margin-left: 20px;
  font-size: 1.2rem;
  border: none;
  background: white;
  color: #2156bd;
}

.reviewLink:hover {
  color: grey;
  cursor: pointer;
}

.newReview {
  border: 1px solid grey;
  width: 600px;
}

.firstAndLastName {
  font-size: 1.5rem;
  font-weight: 700;
  padding: 5px;
}

.firstAndLastNameDiv {
  display: flex;
  flex-direction: row;
}

.clientReview {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  width: 620px;
  height: 450px;
}

.inputReview {
  width: 610px;
  height: 50px;
  padding: 5px;
  font-size: 1.2rem;
  font-weight: 500;
  align-self: flex-start;
  outline: none;
}

.inputReview:focus::placeholder {
  color: transparent;
}

.reviewTextSize {
  padding: 5px;
}

.addReviewDiv {
  display: flex;
  flex-direction: column;
  width: 620px;
  align-items: flex-end;
}

.addReview {
  width: 200px;
  height: 40px;
  margin-top: 10px;
  font-weight: 700;
  font-size: 1.2rem;
  background: #2156bd;
  color: white;
}
.reviewAlert {
  font-size: 1.2rem;
  font-weight: 500;
  color: #2156bd;
}
.brandAndModel {
  display: flex;
  flex-direction: column;
  font-size: 26px;
  font-weight: 500;
}
.brand {
  display: flex;
  align-items: center;
}
.model {
  padding-left: 50px;
}
</style>
