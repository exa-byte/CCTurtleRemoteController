<template>
  <div class="scene"></div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useWorldStore } from "../store/useWorld";
import { useWorldViewStore } from "../store/useWorldView";
import * as THREE from "three";
import CameraControls from "camera-controls";
import { PerspectiveCamera, Scene } from "three";
import { Block } from "../types/types";
import BlockRenderStructure from "../utils/BlockRenderStructure";
import DynamicInstancedMesh from "../utils/DynamicInstancedMesh";

CameraControls.install({ THREE: THREE });

var scene: Scene,
  camera: PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  cameraControls: CameraControls,
  blocks: THREE.Group,
  raycaster: THREE.Raycaster,
  clock: THREE.Clock,
  mouse = { x: 0, y: 0 },
  blockMeshes: BlockRenderStructure;

export default defineComponent({
  setup() {
    const world = useWorldStore();
    const worldView = useWorldViewStore();
    const geometry = new THREE.BoxGeometry();

    return { world, worldView, geometry };
  },
  methods: {
    onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.render(scene, camera);
    },
    initScene() {
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);

      raycaster = new THREE.Raycaster();
      renderer.domElement.addEventListener(
        "dblclick",
        (e) => {
          this.raycast(e)
          if (isNaN(this.worldView.selectedTurtleId) || this.worldView.selectedTurtleId == -1 || this.worldView.gotoBlockPos == null) return;
          const hLoc = this.worldView.gotoBlockPos;
          this.world.sendCommand(this.worldView.selectedTurtleId, "tapi.goTo(" + hLoc.x + "," + hLoc.y + "," + hLoc.z + ")");
        },
        false
      );

      renderer.domElement.addEventListener(
        "click",
        (e) => {
          this.raycast(e)
          if (this.worldView.hoveredBlock && this.worldView.hoveredBlock.inventory) { 
            this.worldView.selectedInventory = this.worldView.hoveredBlock.inventory; 
            this.worldView.selectedInventorySize = this.worldView.hoveredBlock.inventorySize as number; 
          }
          else {
            this.worldView.selectedInventory = null; 
            this.worldView.selectedInventorySize = 0; 
          }
        },
        false
      );

      renderer.domElement.addEventListener("mousemove", this.raycast, false);

      window.addEventListener("resize", this.onWindowResize, false);

      document.body.appendChild(renderer.domElement);

      clock = new THREE.Clock();

      camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        10000
      );
      camera.position.set(-4, 5, -10);
      camera.lookAt(0, 0, 0);

      scene = new THREE.Scene();
      blocks = new THREE.Group();
      scene.add(blocks);

      cameraControls = new CameraControls(camera, renderer.domElement);

      renderer.render(scene, camera);
    },
    getGotoBlockPosFromIntersect(intersection: THREE.Intersection) {
      let transform = new THREE.Matrix4();
      let instMesh = <DynamicInstancedMesh>intersection.object;
      instMesh.getMatrixAt(<number>intersection.instanceId, transform);
      let instPos = new THREE.Vector3().setFromMatrixPosition(transform);
      let offset = intersection.point.clone().sub(instPos);
      let vabs = new THREE.Vector3(Math.abs(offset.x), Math.abs(offset.y), Math.abs(offset.z)).toArray();
      let idx = vabs.indexOf(Math.max(...vabs));
      let discreteOffset = new THREE.Vector3(0, 0, 0);
      for (let i = 0; i < 3; i++) {
        if (i == idx) discreteOffset.setComponent(i, offset.getComponent(i) > 0 ? 1 : -1);
      }
      return instPos.clone().add(discreteOffset);
    },
    animate() {
      const delta = clock.getDelta();

      // check if turtle moved
      const turtleId = this.worldView.followedTurtle.turtleId;
      if (turtleId != -1) {
        const currPos = this.world.turtles[turtleId].loc;
        const lastPos = this.worldView.followedTurtle.lastPos;
        if (
          currPos.x !== lastPos.x ||
          currPos.y !== lastPos.y ||
          currPos.z !== lastPos.z
        ) {
          this.worldView.setCameraFocus(
            new THREE.Vector3(currPos.x, currPos.y, currPos.z)
          );
          this.worldView.followedTurtle.lastPos = currPos;
        }
      }

      const hasControlsUpdated = cameraControls.update(delta);
      requestAnimationFrame(this.animate);
      this.render();
    },
    raycast(e: any) {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(blocks.children);

      for (let i = 0; i < intersects.length; i++) {
        // console.log(intersects[i].object.position);
        const instanceId = intersects[i].instanceId;

        let instMesh = <DynamicInstancedMesh>intersects[i].object;
        let transform = new THREE.Matrix4();
        instMesh.getMatrixAt(<number>intersects[i].instanceId, transform);
        let instPos = new THREE.Vector3().setFromMatrixPosition(transform);
        this.worldView.hoveredBlock = this.world.getBlockByObjPosition(instPos);
        this.worldView.hoveredBlockPos = instPos;
        this.worldView.gotoBlockPos = this.getGotoBlockPosFromIntersect(intersects[i]);
        return;
        /*
          An intersection has the following properties :
          - object : intersected object (THREE.Mesh)
          - distance : distance from camera to intersection (number)
          - face : intersected face (THREE.Face3)
          - faceIndex : intersected face index (number)
          - point : intersection point (THREE.Vector3)
          - uv : intersection point in the object's UV coordinates (THREE.Vector2)
          */
      }
      this.worldView.hoveredBlock = null;
      this.worldView.hoveredBlockPos = null;
      this.worldView.gotoBlockPos = null;
    },
    regenerateSceneFromBlocks() {
      const world = useWorldStore();

      // delete objects
      scene.remove.apply(scene, scene.children);
      blocks.remove.apply(blocks, blocks.children);

      // add lighting
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(1, 2, 3);
      scene.add(directionalLight);
      const directionalLight2 = new THREE.DirectionalLight(0x777777, 1);
      directionalLight2.position.set(-1, -2, -3);
      scene.add(directionalLight2);
      const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
      scene.add(ambientLight);

      blockMeshes = new BlockRenderStructure(blocks);

      // add blocks
      for (const locString in world.blocks) {
        blockMeshes.addBlock(locString, world.blocks[locString]);
      }
      scene.add(blocks);

      // add turtles
      this.addTurtles();
    },
    addBlock(locString: string, block: Block) {
      const material = this.worldView.getBlockMaterial(block.name);
      const cube = new THREE.Mesh(this.geometry, material);
      let coords = locString.split(",");
      cube.position.set(
        Number(coords[0]),
        Number(coords[1]),
        Number(coords[2])
      );
      blockMeshes.addBlock(locString, block);
      console.log(`blockmeshes.addblock(${locString}`);
    },
    removeBlock(locString: string) {
      blockMeshes.removeBlock(locString);
    },
    addTurtles() {
      for (const turtleId in this.world.turtles) {
        this.addTurtle(turtleId);
      }
    },
    addTurtle(turtleId: string) {
      const geometry = new THREE.ConeGeometry(0.5, 1, 8);
      const material = new THREE.MeshPhongMaterial({
        color: 0xffff00,
        flatShading: true,
      });
      const turtle = new THREE.Mesh(geometry, material);
      scene.add(turtle);
      this.worldView.turtles[turtleId] = turtle;
      const turtleData = this.world.turtles[turtleId];
      turtle.position.set(turtleData.loc.x, turtleData.loc.y, turtleData.loc.z);
      turtle.rotation.set(Math.PI / 2, 0, ((turtleData.rot + 1) * Math.PI) / 2);
    },
    updateTurtle(turtleId: string) {
      let turtle = this.worldView.turtles[turtleId];
      if (!turtle) {
        this.addTurtle(turtleId);
        return;
      }
      const turtleData = this.world.turtles[turtleId];
      turtle.position.set(turtleData.loc.x, turtleData.loc.y, turtleData.loc.z);
      turtle.rotation.set(Math.PI / 2, 0, ((turtleData.rot + 1) * Math.PI) / 2);
      turtle.updateMatrix();
    },
    setCameraFocus(target: THREE.Vector3) {
      cameraControls.moveTo(target.x, target.y, target.z, true);
    },
    focusOnTurtle(turtleId: number) {
      const world = useWorldStore();
      const turtle = world.turtles[turtleId];
      if (!turtle) return;

      this.setCameraFocus(
        new THREE.Vector3(turtle.loc.x, turtle.loc.y, turtle.loc.z)
      );
    },
    render() {
      renderer.render(scene, camera);
      // console.log(blocks.children.length);
      // for (let i = 0; i < blocks.children.length; i++) {
      //   let pos1 = blocks.children[i].position;
      //   for(let j = i + 1; j < blocks.children.length; j++) {
      //     if (pos1.equals(blocks.children[j].position)) {
      //       console.log(`Detected two blocks on ${pos1}`);
      //     }
      //   }
      // }
      // TODO: fix that e.g. grass doesnt disappear when going through
      // seeeeems to be only blocks that automatically get destroyed when moving through
    },
  },
  mounted() {
    this.initScene();
    this.animate();
    const worldView = useWorldViewStore();
    worldView.regenerateSceneFromBlocks = this.regenerateSceneFromBlocks;
    worldView.render = this.render;
    worldView.setCameraFocus = this.setCameraFocus;
    worldView.focusOnTurtle = this.focusOnTurtle;
    worldView.addBlock = this.addBlock;
    worldView.removeBlock = this.removeBlock;
    worldView.updateTurtle = this.updateTurtle;
  },
});
</script>