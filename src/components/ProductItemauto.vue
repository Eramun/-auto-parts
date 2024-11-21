<script setup>
import { ref } from "vue";
import Addtopurchases from "@/components/Addtopurchases.vue";

const props = defineProps({
  product: Object,
});
console.log(props);
const buyActive = ref(true);

function changeActiveBuy(localActive) {
  buyActive.value = localActive;
}
function buy() {
  buyActive.value = !buyActive.value;
}
</script>
<template>
  <div class="main">
    <div class="whitebox">
      <img src="../../img/zaglushka.png" height="200" width="300" />
    </div>
    <a :href="'/products/' + props.product.id" class="specification">{{
      props.product.specification
    }}</a>
    <div class="boxprice">
      <p class="price">{{ props.product.price }}</p>
      <button class="button" @click="buy">Купить</button>
    </div>
    <Addtopurchases
      :active="buyActive"
      :productId="props.product.id"
      :specification="props.product.specification"
      :available="props.product.available"
      :change="changeActiveBuy"
      v-if="buyActive === false"
    >
    </Addtopurchases>
  </div>
</template>

<style scoped>
.main {
  width: 350px;
  height: 400px;
  display: flex;
  flex-direction: column;
  border: 2px solid rgba(189, 189, 189, 0.4);
  margin-bottom: 50px;
  padding: 15px;
}

.boxprice {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
}

.whitebox {
  align-self: center;
  padding-bottom: 20px;
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

.price {
  padding-top: 15px;
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 33px;
}

.specification {
  margin-bottom: 20px;
  height: 50px;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 166.34%;
  text-decoration: none;
}
</style>
