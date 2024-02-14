import { defineStore } from 'pinia'
import { TurtleState, Block } from '../types/types';
import { useWorldViewStore } from './useWorldView';

const url = ""

export const useWorldStore = defineStore('world', {
  state: () => ({
    turtles: {} as { [id: string]: TurtleState; },
    blocks: {} as { [locString: string]: Block; },
    commandResult: {} as { [id: string]: string; },
    URL: `${url}`,
    apiURL: `${url}api/`,
    textureURL: `${url}textures/`,
    lastTransactionId: -1,
    isLoading: true,
  }),
  getters: {
    getTurtleIds(): number[] {
      return Object.keys(this.turtles).map(key => Number(key));
    },
  },
  actions: {
    setTurtleStatus(remoteTurtleState: any) {

      for (let id in remoteTurtleState) {
        let turtleState = remoteTurtleState[id];
        if (!this.turtles[id]) {
          const worldView = useWorldViewStore();
          worldView.selectedTurtleId = parseInt(id);
        }
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
      const worldView = useWorldViewStore();
      worldView.removeBlock(locString);
      this.blocks[locString] = block;
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
      let currTransactionId = this.lastTransactionId;
      const len = Object.keys(transactions).length
      for (let i = 0; i < len; i++) {
        currTransactionId++;
        const t = transactions[currTransactionId];
        for (const [locString, block] of Object.entries(t.blocks)) {
          if (block) {
            this.transactionAddBlock(locString, block as Block);
          }
          else this.transactionRemoveBlock(locString);
        }
        this.transactionSetTurtleState(t.turtles);
        this.lastTransactionId = currTransactionId;
      }
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
    sendStopSignal(turtleId: number) {
      fetch(this.apiURL + "setStopSignal", {
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