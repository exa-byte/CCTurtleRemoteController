import { BoxGeometry, Object3D } from "three";
import { useWorldStore } from "../store/useWorld";
import { useWorldViewStore } from "../store/useWorldView";
import { Block } from "../types/types";
import DynamicInstancedMesh from "./DynamicInstancedMesh";

class BlockRenderStructure {
  meshArray: DynamicInstancedMesh[];
  blockToMeshIdxMap = {} as { [blockId: string]: number };
  defaultInstanceCount = 16;
  geometry: BoxGeometry;

  constructor(parentSceneObject: Object3D) {
    // console.log("New BlockRenderStructure created");
    this.meshArray = parentSceneObject.children as DynamicInstancedMesh[];
    this.geometry = new BoxGeometry();
  }
  addBlock(locString: string, block: Block) {
    if (!block || !locString) throw new Error(`Given block is ${block}`);
    const worldView = useWorldViewStore();

    // create new mesh if none exists
    // console.log(`Old array: `); console.log(this.meshArray);
    let instMeshIdx = this.blockToMeshIdxMap[block.name];
    if (instMeshIdx === undefined) {
      // console.log(`Creating mesh for new block type: ${block.name}`);
      let newMesh = new DynamicInstancedMesh(this.geometry, worldView.getBlockMaterial(block.name));
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
      mesh = new DynamicInstancedMesh(this.geometry, worldView.getBlockMaterial(block.name), mesh.count * 2);
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
};

export default BlockRenderStructure;