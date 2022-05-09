<template>
  <div class="hud">
    <div>
      <select v-model="worldView.selectedTurtleId">
        <option v-for="key in world.getTurtleIds" :key="key">{{ key }}</option>
      </select>
      <TurtlePanel
        v-if="Number(worldView.selectedTurtleId) != -1"
        :turtleId="Number(worldView.selectedTurtleId)"
      />
    </div>
    <Inventory
      v-if="worldView.selectedInventory"
      :inventory="worldView.selectedInventory"
      :inventorySize="worldView.selectedInventorySize"
      style="grid-column: 2"
    />
    <Scene />
    <KeyboardBindings />
    <BlockNameDisplay />
  </div>
</template>

<style scoped>
.hud {
  position: absolute;
  display: grid;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import { useWorldStore } from "../store/useWorld";
import { useWorldViewStore } from "../store/useWorldView";
import TurtlePanel from "./TurtlePanel.vue";
import Inventory from "./Inventory.vue";
import BlockNameDisplay from "./BlockNameDisplay.vue";
import Scene from "./Scene.vue";
import KeyboardBindings from "./KeyboardBindings.vue";

export default defineComponent({
  setup() {
    const world = useWorldStore();
    const worldView = useWorldViewStore();
    return { world, worldView };
  },
  data() {
    return {
      turtleId: -1 as Number,
    };
  },
  components: {
    TurtlePanel,
    Scene,
    BlockNameDisplay,
    Inventory,
    KeyboardBindings,
  },
  methods: {
    pollStatus() {
      const world = useWorldStore();
      const worldView = useWorldViewStore();

      fetch(world.apiURL + "getStateUpdate", {
        method: "POST",
        mode: "cors",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lastTransactionId: world.lastTransactionId }),
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          if (data.state) {
            world.setTurtleStatus(data.state.turtle);
            world.blocks = data.state.world.blocks;
            worldView.regenerateSceneFromBlocks();
            world.lastTransactionId = data.state.lastTransactionId;
          } else {
            world.applyTransactions(data.transactions);
          }
          worldView.render();
        });

      fetch(world.apiURL + "getCommandResult", {
        method: "POST",
        mode: "cors",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          turtleId: worldView.selectedTurtleId,
          getOnlyLatest: true,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.result) {
            world.commandResult[data.turtleId] = data.result.ret;
          }
        });
      setTimeout(() => this.pollStatus(), 400);
    },
  },
  mounted() {
    setTimeout(() => this.pollStatus(), 400);
  },
});
</script>
