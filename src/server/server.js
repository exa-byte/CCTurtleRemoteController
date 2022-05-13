const express = require('express');
const cors = require('cors');
const { Vector3 } = require('math3d');
const fs = require('fs');
const app = express();
const httpTerminator = require('http-terminator');

const AUTOSAVE_INTERVAL_MIN = 1;
const TRANSACTION_CACHE_COUNT = 10000;

app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use(express.static('dist'));
app.use('/turtle', express.static('turtle'));
app.use('/textures', express.static('textures'));

app.use((req, res, next) => {
  // console.log('Time: ', new Date(Date.now()));
  // console.log(req.method + " " + req.originalUrl)
  next();
});

app.get('/', (req, res) => {
  res.send('Successful response.');
});

// API
let state = {
  turtle: {},
  world: {
    blocks: {},
  },
  lastTransactionId: 0,
  lastReadyTransactionId: 0,
}
let transactionCache = {}
let commandResultCache = {}
let cmds = {}

try {
  let fs = require('fs');
  state = JSON.parse(fs.readFileSync('./src/server/saved_state.json', 'utf8'));
  state.lastTransactionId = 0;
  state.lastReadyTransactionId = 0;
}
catch { }

// transaction has format : { id: number, blocks: { [locstring] : BlockState | null }}
function applyTransaction(transaction, state, transactionCache) {
  for (const [locString, block] of Object.entries(transaction.blocks)) {
    if (block) state.world.blocks[locString] = block;
    else delete state.world.blocks[locString];
  }
  for (const [id, turtleState] of Object.entries(transaction.turtles)) {
    state.turtle[id] = turtleState;
  }

  // cache transaction
  transactionCache[transaction.id] = transaction;
  // keep only last TRANSACTION_CACHE_COUNT transactions in cache
  if (transactionCache[transaction.id - TRANSACTION_CACHE_COUNT]) delete transactionCache[transaction.id - TRANSACTION_CACHE_COUNT]
}

function Vec3toString(vec) {
  return vec.x + "," + vec.y + "," + vec.z;
}

function extractState(turtleState, state) {
  let loc = new Vector3(turtleState.loc.x, turtleState.loc.y, turtleState.loc.z);
  let transaction = {
    id: ++state.lastTransactionId,
    blocks: {},
    turtles: {},
  }

  transaction.blocks[Vec3toString(loc.add(Vector3.up))] = (turtleState.view.top) ? turtleState.view.top : null;
  transaction.blocks[Vec3toString(loc.add(Vector3.down))] = (turtleState.view.bottom) ? turtleState.view.bottom : null;

  let locString;
  switch (turtleState.rot) {
    case 3:
      locString = Vec3toString(loc.add(Vector3.forward));
      break;
    case 2:
      locString = Vec3toString(loc.add(Vector3.right));
      break;
    case 1:
      locString = Vec3toString(loc.add(Vector3.back));
      break;
    case 0:
      locString = Vec3toString(loc.add(Vector3.left));
      break;
    default:
      console.log(`error in extractBlockState: rot is invalid (${turtleState.rot})`);
  }
  transaction.blocks[locString] = (turtleState.view.front) ? turtleState.view.front : null;
  transaction.turtles[turtleState.id] = turtleState;
  state.lastReadyTransactionId++;
  return transaction;
}

app.get('/api/state', (req, res) => {
  res.send(state);
});

app.post('/api/getStateUpdate', (req, res) => {
  const useOldStateUpdateMethod = false; // until the transaction-only update method works bug free, use the old method
  if (useOldStateUpdateMethod) { res.send({ state: state }); return; }
  console.log(`${req.body.lastTransactionId} | ${state.lastReadyTransactionId} | ${state.lastTransactionId}`);
  // if no remote last transaction is given, send complete state
  if (!req.body.lastTransactionId == -1) { res.send({ state: state }); return; }
  // if frontend last transaction > server last transaction, send complete state
  if (req.body.lastTransactionId > state.lastReadyTransactionId) { res.send({ state: state }); return; }
  let newTransactionId = req.body.lastTransactionId + 1;
  let resJson = { transactions: {} }
  // if no further transactions happened since the remote last transaction return empty transaction obj
  if (newTransactionId > state.lastTransactionId) { res.send(resJson); return; }
  // if transactions are not cached, send complete state
  if (!transactionCache[newTransactionId]) { res.send({ state: state }); return; }
  // else fill transaction object with all new transactions and send
  for (let i = newTransactionId; i <= state.lastReadyTransactionId; i++) {
    resJson.transactions[transactionCache[i].id] = transactionCache[i];
  }
  res.send(resJson); return;
});

app.post('/api/state', (req, res) => {
  let s = req.body;
  applyTransaction(extractState(s, state), state, transactionCache);
  // console.log(s);
  res.sendStatus(200)
});

app.post('/api/getCommand', (req, res) => {
  let s = req.body;
  // console.log(s);
  // console.log('/api/getCommand');
  if (!cmds[s.id]) {
    res.send();
    return;
  }
  res.send(cmds[s.id].shift());
});

app.post('/api/commandResult', (req, res) => {
  console.log('/api/commandResult');
  let turtleId = req.body.turtleId;
  if (!commandResultCache[turtleId]) commandResultCache[turtleId] = [];
  commandResultCache[turtleId].push(req.body.result);
  res.sendStatus(200)
});

app.post('/api/getCommandResult', (req, res) => {
  let turtleId = req.body.turtleId;
  if (!commandResultCache[turtleId]) {
    res.send({});
    return;
  }
  if (req.body.getOnlyLatest) {
    res.send({ turtleId, result: commandResultCache[turtleId].at(-1) });
    return;
  }
  let startIndex = req.body.lastReceivedIndex ? req.body.lastReceivedIndex + 1 : 0;
  res.send({ turtleId, cmdResults: commandResultCache[turtleId].slice(startIndex) })
});

app.post('/api/setCommand', (req, res) => {
  let s = req.body;
  if (!cmds[s.id]) cmds[s.id] = []
  cmds[s.id].push(s.cmd);
  console.log(s);
  console.log('/api/setCommand');
  res.send({ response: "command set" })
});

app.post('/api/clearCommandQueue', (req, res) => {
  let s = req.body;
  cmds[s.id] = [];
  console.log(s);
  console.log('/api/clearCommandQueue');
  res.send({ response: "command queue cleared" })
});

app.get('/api/turtleFileNames', (req, res) => {
  fs.readdirSync('turtle')
  res.send(fs.readdirSync('turtle'));
});

app.post('/api/saveState', (req, res) => {
  saveStateToDisk();
  res.send(200)
});

function saveStateToDisk() {
  fs.writeFileSync('./src/server/saved_state.json', JSON.stringify(state));
}

function autoSave() {
  saveStateToDisk();
  setTimeout(() => autoSave(), AUTOSAVE_INTERVAL_MIN * 60 * 1000);
}

const server = app.listen(80, () => console.log('Turtle remote controller server is listening on port 80.'));
autoSave();

const terminator = httpTerminator.createHttpTerminator({
  gracefulTerminationTimeout: 200,
  server,
});

process.on('SIGINT', async () => {
  await terminator.terminate();
  saveStateToDisk();
  process.exit(0);
});