import { BoxGeometry, BufferGeometry, Mesh, Object3D } from "three";
import { useWorldStore } from "../store/useWorld";
import { useWorldViewStore } from "../store/useWorldView";
import { Block } from "../types/types";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import DynamicInstancedMesh from "./DynamicInstancedMesh";

class BlockRenderStructure {
  meshArray: DynamicInstancedMesh[];
  blockToMeshIdxMap = {} as { [blockId: string]: number };
  defaultInstanceCount = 16;
  boxGeometry: BoxGeometry;
  geometryCache = {} as { [geometryId: string]: BufferGeometry | Promise<void> | null };

  constructor(parentSceneObject: Object3D) {
    // console.log("New BlockRenderStructure created");
    this.meshArray = parentSceneObject.children as DynamicInstancedMesh[];
    this.boxGeometry = new BoxGeometry();
  }
  addBlock(locString: string, block: Block) {
    if (!block || !locString) throw new Error(`Given block is ${block}`);
    const worldView = useWorldViewStore();

    // create new mesh if none exists
    // console.log(`Old array: `); console.log(this.meshArray);
    let instMeshIdx = this.blockToMeshIdxMap[block.name];
    if (instMeshIdx === undefined) {
      // console.log(`Creating mesh for new block type: ${block.name}`);
      let newMesh = new DynamicInstancedMesh(this.getBlockGeometry(block), worldView.getBlockMaterial(block.name));
      instMeshIdx = this.meshArray.push(newMesh) - 1;
      this.blockToMeshIdxMap[block.name] = instMeshIdx;
      // console.log(`New array: `); console.log(this.meshArray);
      // console.log(`New blockToMeshIdxMap: `); console.log(this.blockToMeshIdxMap);
    }
    instMeshIdx = this.blockToMeshIdxMap[block.name];
    let mesh = this.meshArray[instMeshIdx];

    // recreate mesh if max instance count is reached
    if (mesh.count == mesh.maxInstanceCount) {
      const oldMesh = mesh;
      mesh = new DynamicInstancedMesh(oldMesh.geometry, worldView.getBlockMaterial(block.name), oldMesh.count * 2);
      mesh.setFromDynamicInstancedMesh(oldMesh);
      this.meshArray[instMeshIdx] = mesh;
    }

    // add block to mesh
    mesh.addBlock(locString, block);
  }
  removeBlock(locString: string) {
    const world = useWorldStore();
    const block = world.blocks[locString];
    if (!block) return;
    let instMeshIdx = this.blockToMeshIdxMap[block.name];
    if (instMeshIdx === undefined) return;
    this.meshArray[instMeshIdx].removeBlock(locString);
  }
  getBlockGeometry(block: Block): BufferGeometry {
    const worldView = useWorldViewStore();
    let geometryId = worldView.geometryMap[block.name];
    if (!geometryId && (block.name.includes("sapling") || block.name.includes("kelp") || block.name.includes("seagrass") || block.name.includes("magrove_root"))) geometryId = "cross";
    if (!geometryId) return this.boxGeometry;
    if (!this.geometryCache[geometryId]) {
      const loader = new GLTFLoader();

      /* @ts-ignore */
      const promise = loader.loadAsync(`textures/turtle/${geometryId}.glb`)
        .then(
          (gltf) => gltf.scene.traverse((child) => {
            /* @ts-ignore */
            if (child.isMesh) {
              this.geometryCache[geometryId] = (child as Mesh).geometry;
              console.log("geometry request response:")
              console.log(this.geometryCache);
            }
          }))
      promise.catch((error) => {
        console.error(error);
        this.geometryCache[geometryId] = null;
      });
      this.geometryCache[geometryId] = promise;
    }

    let geometryOrPromise: BufferGeometry | Promise<void> | null = this.geometryCache[geometryId];
    // in case a previous request for the resource failed just return a box geometry
    if (geometryOrPromise === null) return this.boxGeometry;
    /* @ts-ignore */
    if (geometryOrPromise.catch) {
      // in case the geometry is already being requested, return box geom and change geom later
      console.log("geometry is being requested - returning box geometry")
      /* @ts-ignore */
      geometryOrPromise.then(() => {
        const geometry = this.geometryCache[geometryId];
        console.log("geometry request done")
        if (geometry) {
          console.log("geometry request successful - swapping mesh")
          this.meshArray[this.blockToMeshIdxMap[block.name]].geometry = geometry as BufferGeometry;
        }
        console.log(geometry)
      });
      return this.boxGeometry;
    }
    else {
      // in case the geometry is already cached, return it immediately
      console.log("geometry is already cached")
      return geometryOrPromise as BufferGeometry;
    }
  }
};

export default BlockRenderStructure;