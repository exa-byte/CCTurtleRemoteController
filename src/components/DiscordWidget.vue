<template>
  <div v-if="discordWidgetShown">
    <iframe
      src="https://discord.com/widget?id=976121065812131910&theme=dark"
      id="discord-widget"
      width="240"
      height="300"
      allowtransparency="true"
      frameborder="0"
      sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
    ></iframe>
    <a href="https://github.com/exa-byte/CCTurtleRemoteController" target="_blank" id="github-link">Code available on github</a>
    <button @click="hideSelf">X</button>
  </div>
</template>

<style scoped>
#discord-widget {
  position: fixed;
  bottom: 42px;
  right: 10px;
}

#github-link {
  position: fixed;
  bottom: 10px;
  right: 10px;
  background-color: #1e2124;
  border-radius: 5px;
  padding: 5px;
  color: #3498db;
}

button {
  padding: 4;
  border-radius: 8px;
  border-color: rgba(0, 0, 0, 0.304);
  background-color: rgb(51, 51, 51);
  position: fixed;
  bottom: 330px;
  right: 10px;
  color: darkgray;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {},
  data() {
    return {
      discordWidgetShown: true,
    };
  },
  methods: {
    hideSelf() {
      this.discordWidgetShown = false;
    },
  },
});
</script>
