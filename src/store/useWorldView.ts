import { defineStore } from 'pinia'
import * as THREE from "three";
import { Block, Inventory } from '../types/types';
import { useWorldStore } from './useWorld';

const BIOME_TINT = 0x88C149;

export const useWorldViewStore = defineStore('worldView', {
  state: () => ({
    regenerateSceneFromBlocks: () => { },
    render: () => { },
    setCameraFocus: (target: THREE.Vector3) => { },
    focusOnTurtle: (turtleId: number) => { },
    addBlock: (locString: string, block: Block) => { },
    removeBlock: (locString: string) => { },
    updateTurtle: (turtleId: string) => { },
    followedTurtle: {
      turtleId: -1 as number,
      lastPos: {} as { x: number, y: number, z: number }
    },
    materials: {} as { [id: string]: THREE.MeshPhongMaterial; },
    hoveredBlock: null as Block | null,
    hoveredBlockPos: null as THREE.Vector3 | null,
    gotoBlockPos: null as THREE.Vector3 | null,
    selectedTurtleId: -1 as number,
    turtles: {} as { [id: string]: THREE.Object3D; },
    selectedInventory: null as Inventory | null,
    selectedInventorySize: 0 as number,
    blockTint: {
      "minecraft:grass": BIOME_TINT,
      "minecraft:grass_block": BIOME_TINT,
      "minecraft:acacia_leaves": BIOME_TINT,
      "minecraft:birch_leaves": 0x80a755,
      "minecraft:dark_oak_leaves": BIOME_TINT,
      "minecraft:jungle_leaves": BIOME_TINT,
      "minecraft:oak_leaves": BIOME_TINT,
      "minecraft:spruce_leaves": 0x619961,
      "minecraft:fern": BIOME_TINT,
      "minecraft:vine": BIOME_TINT,
      "minecraft:lily_pad": BIOME_TINT,
    } as { [id: string]: number; }
  }),
  getters: {

  },
  actions: {
    getBlockMaterial(id: string) {
      if (!this.materials[id]) {
        this.materials[id] = new THREE.MeshPhongMaterial({
          color: Math.floor(Math.random() * 0xff00ff),
        });
        const loader = new THREE.TextureLoader();
        const world = useWorldStore();
        loader.load(
          // resource URL
          world.textureURL + `blocks/${id.replace(':', '/')}.png`,

          // onLoad callback
          (texture) => {
            texture.minFilter = THREE.NearestFilter;
            texture.magFilter = THREE.NearestFilter;
            this.materials[id].map = texture;
            this.materials[id].color.setHex(0xffffff);
            const tint = this.blockTint[id];
            if (tint) this.materials[id].color.setHex(tint);
            this.materials[id].needsUpdate = true;
          },

          // onProgress callback currently not supported
          undefined,

          // onError callback
          (err) => {
            console.log(`No block texture found for ${id}`);
          }
        );
      }
      return this.materials[id];
    },
    followTurtle(turtleId: number) {
      if (turtleId === this.followedTurtle.turtleId) turtleId = -1;
      this.followedTurtle.turtleId = turtleId;
      if (turtleId === -1) return;
      const world = useWorldStore();
      this.followedTurtle.lastPos = world.turtles[turtleId].loc;
      this.focusOnTurtle(turtleId);
    },
  },
})