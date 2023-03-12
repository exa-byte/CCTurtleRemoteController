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
    addAnimatedTexture: (texture: THREE.Texture) => { },
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
      "minecraft:water": 0x1e97f2,
      "minecraft:grass": BIOME_TINT,
      "minecraft:tall_grass": BIOME_TINT,
      "minecraft:grass_block": BIOME_TINT,
      "minecraft:acacia_leaves": BIOME_TINT,
      "minecraft:birch_leaves": 0x80a755,
      "minecraft:dark_oak_leaves": BIOME_TINT,
      "minecraft:jungle_leaves": BIOME_TINT,
      "minecraft:oak_leaves": BIOME_TINT,
      "minecraft:spruce_leaves": 0x619961,
      "minecraft:fern": BIOME_TINT,
      "minecraft:large_fern": BIOME_TINT,
      "minecraft:vine": BIOME_TINT,
      "minecraft:lily_pad": BIOME_TINT,
      "biomesoplenty:bush": BIOME_TINT,
      "biomesoplenty:clover": BIOME_TINT,
      "biomesoplenty:sprout": BIOME_TINT,
      "biomesoplenty:flowering_oak_leaves": BIOME_TINT,
      "biomesoplenty:mahogany_leaves": BIOME_TINT,
      "biomesoplenty:willow_leaves": BIOME_TINT,
      "biomesoplenty:willow_vine": BIOME_TINT,
    } as { [id: string]: number; },
    geometryMap: {
      "biomesoplenty:bush": "cross",
      "biomesoplenty:toadstool": "cross",
      "biomesoplenty:reed": "cross",
      "biomesoplenty:clover": "cross",
      "biomesoplenty:goldenrod": "cross",
      "biomesoplenty:sprout": "cross",
      "biomesoplenty:mangrove_root": "cross",
      "biomesoplenty:spanish_moss": "cross",
      "biomesoplenty:cattail": "cross",
      "biomesoplenty:willow_vine": "cross",
      "biomesoplenty:glowshroom": "cross",
      "biomesoplenty:orange_cosmos": "cross",
      "biomesoplenty:pink_daffodil": "cross",
      "minecraft:cobweb": "cross",
      "minecraft:oak_sapling": "cross",
      "minecraft:brown_mushroom": "cross",
      "minecraft:red_mushroom": "cross",
      "minecraft:sugar_cane": "cross",
      "minecraft:dead_bush": "cross",
      "minecraft:fern": "cross",
      "minecraft:large_fern": "cross",
      "minecraft:grass": "cross",
      "minecraft:tall_grass": "cross",
      "minecraft:vine": "cross",
      "minecraft:dandelion": "cross",
      "minecraft:lilac": "cross",
      "minecraft:poppy": "cross",
      "minecraft:allium": "cross",
      "minecraft:rose": "cross",
      "minecraft:rose_bush": "cross",
      "minecraft:lily_of_the_valley": "cross",
      "minecraft:azure_bluet": "cross",
      "minecraft:blue_orchid": "cross",
      "minecraft:oxeye_daisy": "cross",
      "minecraft:white_tulip": "cross",
      "minecraft:sunflower": "cross",
      "minecraft:cornflower": "cross",
      "minecraft:peony": "cross",
      "quark:root": "cross",
    } as { [blockId: string]: string },
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
            if (this.geometryMap[id] === "cross" || id.includes("leaves") || id.includes("sapling") || id.includes("kelp") || id.includes("seagrass"))
              this.materials[id].alphaTest = 1;
            if (this.geometryMap[id] === "cross" || id.includes("sapling") || id.includes("kelp") || id.includes("seagrass"))
              this.materials[id].side = THREE.DoubleSide;
            if (texture.image.width !== texture.image.height)
              this.addAnimatedTexture(texture);
            // this.materials[id].transparent = true;
            // this.materials[id].opacity = .5;
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