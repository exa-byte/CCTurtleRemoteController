import { defineStore } from 'pinia'
import { TurtleState, Block } from '../types/types';
import { useWorldViewStore } from './useWorldView';

const url = "http://localhost/"

export const useWorldStore = defineStore('world', {
  state: () => ({
    turtles: {} as { [id: string]: TurtleState; },
    blocks: {} as { [locString: string]: Block; },
    URL: `${url}`,
    apiURL: `${url}api/`,
    textureURL: `${url}textures/`,
    lastTransactionId: 0,
  }),
  getters: {
    getTurtleIds(): number[] {
      return Object.keys(this.turtles).map(key => Number(key));
    }
  },
  actions: {
    setTurtleStatus(remoteTurtleState: any) {

      for (let id in remoteTurtleState) {
        let turtleState = remoteTurtleState[id]
        this.turtles[id] = turtleState;
        this.turtles[id].modified = Date.now();

        // replace 0s in inv with null
        for (let i = 0; i < turtleState.inv.length; i++)
          if (turtleState.inv[i] === 0) turtleState.inv[i] = undefined;
      }
    },
    transactionRemoveBlock(locString: string) {
      const worldView = useWorldViewStore();
      worldView.removeBlock(locString);
      delete this.blocks[locString];
    },
    transactionAddBlock(locString: string, block: Block) {
      this.blocks[locString] = block;
      const worldView = useWorldViewStore();
      worldView.removeBlock(locString);
      worldView.addBlock(locString, block);
    },
    transactionSetTurtleState(turtleState: any) {
      this.setTurtleStatus(turtleState);
      const worldView = useWorldViewStore();
      for (const id of Object.keys(turtleState)) {
        worldView.updateTurtle(id);
      }
    },
    applyTransactions(transactions: any) {
      let currTransactionId = 0;
      const len = Object.keys(transactions).length
      for (let i = 0; i < len; i++) {
        currTransactionId = i + this.lastTransactionId + 1;
        const t = transactions[currTransactionId];
        for (const [locString, block] of Object.entries(t.blocks)) {
          if (block) {
            this.transactionAddBlock(locString, block as Block);
            console.log(locString);
          }
          else this.transactionRemoveBlock(locString);
        }
        if (i == len - 1) {
          this.transactionSetTurtleState(t.turtles);
        }
      }
      this.lastTransactionId = currTransactionId;
    },
    sendCommand(turtleId: number, cmd: string) {
      fetch(this.apiURL + "setCommand", {
        method: 'POST',
        mode: "cors",
        headers: {
          "Access-Control-Allow-Origin": "*",
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: turtleId, cmd: cmd }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        });
    },
    clearCommandQueue(turtleId: number) {
      fetch(this.apiURL + "clearCommandQueue", {
        method: 'POST',
        mode: "cors",
        headers: {
          "Access-Control-Allow-Origin": "*",
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: turtleId }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        });
    },
    getBlockByObjPosition(pos: THREE.Vector3) {
      return this.blocks[pos.x + "," + pos.y + "," + pos.z];
    },
  },
})