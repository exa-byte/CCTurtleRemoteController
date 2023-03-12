<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
// import HelloWorld from './components/HelloWorld.vue'
import CCRemoteController from "./components/CCRemoteController.vue";
import DiscordWidget from "./components/DiscordWidget.vue";
</script>

<template>
  <CCRemoteController />
  <DiscordWidget />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  margin: 0;
}

button {
  cursor: pointer;
}
button:hover {
  filter: brightness(150%);
}
button:active {
  filter: brightness(75%);
}
</style>
