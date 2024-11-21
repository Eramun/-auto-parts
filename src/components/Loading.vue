<script setup></script>
<template>
  <div class="loader-overlay">
    <div class="loader"></div>
  </div>
</template>
<style scoped>
.loader-overlay {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f6f6f6;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loader {
  border: 12px solid #d3d3d3;
  border-top: 12px solid rgba(68, 0, 255, 0.7);
  border-radius: 50%;
  width: 6px;
  height: 6px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
