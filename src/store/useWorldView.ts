import { defineStore } from 'pinia'
import * as THREE from "three";
import { Block, Inventory } from '../types/types';
import { useWorldStore } from './useWorld';


export const useWorldViewStore = defineStore('worldView', {
  state: () => ({
    // scene: null as unknown as THREE.Scene,
    // camera: null as unknown as THREE.PerspectiveCamera,
    // controls: null as unknown as OrbitControls,
    // renderer: null as unknown as THREE.WebGLRenderer,
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
    blockMeshes: {} as { [id: string]: THREE.Mesh; },
    selectedInventory: null as Inventory | null,
    selectedInventorySize: 0 as number,
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