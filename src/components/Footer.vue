<script setup></script>
<template>
  <footer class="footer">
    <div class="mainContainer">
      <div class="Container">
        <img src="../../img/img_1.png" height="33" width="33" />
        <a class="instaLink" href="">frostauto</a>
      </div>
      <div class="Container">
        <img src="../../img/mail.png" height="33" width="40" />
        <a class="instaLink" href="">frostauto@gmail.com</a>
      </div>
      <div class="Container">
        <img src="../../img/phone.png" height="33" width="40" />
        <div>
          <p class="cityAndNumber">г.Астана</p>
          <p class="cityAndNumber">+7 777 777 77 77</p>
        </div>
      </div>
      <div class="Container">
        <img src="../../img/phone.png" height="33" width="40" />
        <div>
          <p class="cityAndNumber">г.Алмата</p>
          <p class="cityAndNumber">+7 777 777 77 77</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: auto;
  width: 100%;
  background: black;
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  flex-direction: row;
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

.Container {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 1170px;
}

.instaLink {
  margin-left: 10px;
  color: white;
  text-decoration: none;
}

.cityAndNumber {
  margin-left: 10px;
  color: white;
  text-decoration: none;
}
</style>
