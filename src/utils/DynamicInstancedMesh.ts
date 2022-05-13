import { InstancedMesh, Matrix4 } from "three";
import { Block } from "../types/types";

class DynamicInstancedMesh extends InstancedMesh {
  maxInstanceCount: number;
  locStringToInstance = new BidirectionalMap({});
  constructor(geometry: THREE.BufferGeometry, material: THREE.Material, maxInstanceCount = 16) {
    super(geometry, material, maxInstanceCount);
    this.maxInstanceCount = maxInstanceCount;
    this.count = 0;
  }
  addBlock(locString: string, block: Block) {
    if (!block) throw new Error(`Given block is ${block}`);
    // if block exists, remove old block
    if (this.locStringToInstance.get(locString) !== undefined) {
      this.removeBlock(locString);
    }
    // and add new one
    let coords = locString.split(",");
    let mat = new Matrix4().setPosition(
      Number(coords[0]),
      Number(coords[1]),
      Number(coords[2]));;
    this.setMatrixAt(this.count, mat);
    this.instanceMatrix.needsUpdate = true;
    this.locStringToInstance.add(locString, this.count);
    this.count++;
  }
  removeBlock(locString: string) {
    let remIdx = this.locStringToInstance.get(locString);
    if (remIdx === undefined) return;

    // set transformation matrix of last entry into entry to delete
    let mat = new Matrix4();
    this.getMatrixAt(this.count - 1, mat);
    this.setMatrixAt(remIdx, mat);
    this.instanceMatrix.needsUpdate = true;

    // put last instance in place of this one and decrement instance count
    this.locStringToInstance.remove(locString);
    let movedLocString = this.locStringToInstance.getByValue(this.count - 1);
    this.locStringToInstance.remove(movedLocString);
    this.locStringToInstance.add(movedLocString, remIdx);
    this.count--;
  }
  setFromDynamicInstancedMesh(dynInstMesh: DynamicInstancedMesh) {
    this.locStringToInstance = dynInstMesh.locStringToInstance;
    let mat = new Matrix4();
    for (let i = 0; i < dynInstMesh.count; i++) {
      dynInstMesh.getMatrixAt(i, mat);
      this.setMatrixAt(i, mat);
      this.instanceMatrix.needsUpdate = true;
      this.count++;
    }
  }
};

class BidirectionalMap {
  fwdMap = {} as { [locString: string]: number };
  revMap = {} as { [index: number]: string };

  constructor(map: { [key: string]: number }) {
    this.fwdMap = { ...map };
    this.revMap = Object.keys(map).reduce(
      (acc, cur) => ({
        ...acc,
        [map[cur]]: cur,
      }),
      {}
    )
  }

  get(key: string): number | undefined {
    return this.fwdMap[key];
  }

  getByValue(value: number) {
    return this.revMap[value];
  }

  add(locString: string, index: number) {
    this.fwdMap[locString] = index;
    this.revMap[index] = locString;
  }

  remove(locString: string) {
    let index = this.fwdMap[locString];
    if (index === undefined) return;
    delete this.fwdMap[locString];
    delete this.revMap[index];
  }

  removeByValue(index: number) {
    let locstring = this.revMap[index];
    if (index === undefined) return;
    delete this.revMap[index];
    delete this.fwdMap[locstring];
  }
}

export default DynamicInstancedMesh;