const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');
let MC_FILE = `${process.env.APPDATA}/.minecraft/versions/1.18/1.18.jar`.replaceAll('\\', '/');
let MOD_DIR = `${process.env.USERPROFILE}/curseforge/minecraft/Instances/computercraft thing/mods`.replaceAll('\\', '/');
const { exec } = require("child_process");

function extractTexturesFromJar(fileName) {
  fs.createReadStream(fileName)
    .pipe(unzipper.Parse())
    .on('entry', function (entry) {
      const fileName = entry.path;
      let regex = /assets\/(?<modname>.*)\/textures\/(?<textureType>.*)\/.*\.png$/m;
      let match = regex.exec(fileName);
      if (match && match.groups.textureType == "block") {
        const blockPath = `textures/blocks/${match.groups.modname}`
        fs.mkdirSync(blockPath, { recursive: true });
        entry.pipe(fs.createWriteStream(`${blockPath}/${path.parse(fileName).base}`));
      }
      else if (match && match.groups.textureType == "item") {
        const itemPath = `textures/items/${match.groups.modname}`
        fs.mkdirSync(itemPath, { recursive: true });
        entry.pipe(fs.createWriteStream(`${itemPath}/${path.parse(fileName).base}`));
      } else {
        entry.autodrain();
      }
    });
}

function renderBlockTextures() {
  fs.mkdirSync('grab/rendered', { recursive: true });
  return new Promise((resolve, reject) => {
    exec("node node_modules/minecraft-blocks-render/bin/index.js render --type png --scale 4 --renderTransparent --renderSides", (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
      }
      resolve();
    });
  })
}

function createBlockTextures() {
  return new Promise(async (resolve) => {
    const blockTexturePath = 'textures/blocks/'
    for (let modName of fs.readdirSync(blockTexturePath)) {
      copyFolderSync(blockTexturePath + modName, 'grab/blocks');
      await renderBlockTextures();
      copyFolderSync('grab/rendered', 'textures/items/' + modName);
      fs.rmSync('grab', { recursive: true });
    }
    resolve();
  });
}

function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true });
  fs.readdirSync(from).forEach(element => {
    if (fs.lstatSync(path.join(from, element)).isFile()) {
      fs.copyFileSync(path.join(from, element), path.join(to, element));
    } else {
      copyFolderSync(path.join(from, element), path.join(to, element));
    }
  });
}

function pickMultiFaceBlockDisplaySide() {
  // this adds some basic display for e.g. furnaces who dont have a furnace.png, but only furnace_front.png
  fs.readdirSync('textures/blocks/').forEach(modName => {
    const modDir = 'textures/blocks/' + modName;
    fs.readdirSync(modDir).forEach(fileName => {
      const filePath = modDir + '/' + fileName;
      if (fileName.endsWith('_front.png') && !fs.existsSync(modDir + '/' + fileName.replace('_front', '')))
        fs.copyFileSync(filePath, modDir + '/' + fileName.replace('_front', ''));
      else if (fileName.endsWith('_top.png') && !fs.existsSync(modDir + '/' + fileName.replace('_top', '')))
        fs.copyFileSync(filePath, modDir + '/' + fileName.replace('_top', ''));
      else if (fileName.endsWith('_still.png') && !fs.existsSync(modDir + '/' + fileName.replace('_still', '')))
        fs.copyFileSync(filePath, modDir + '/' + fileName.replace('_still', ''));
    });
  });
}

process.stdout.write("Gathering textures...");
if (!process.argv[2])
  throw new Error("Usage: node run build-textures <pathToYourMinecraftJar> <optional: pathToDirectoryContainingYourModJars>\nPaths might need to be absolute, but I'm not sure.");
MC_FILE = process.argv[2].replaceAll('\\\\', '/').replaceAll('\\', '/');
MOD_DIR = process.argv[3] ? process.argv[3].replaceAll('\\\\', '/').replaceAll('\\', '/') : '.';

extractTexturesFromJar(MC_FILE)
fs.readdirSync(MOD_DIR).forEach(fileName => {
  if (fileName.endsWith('.jar'))
    extractTexturesFromJar(MOD_DIR + '/' + fileName)
});
process.stdout.write("DONE\nRendering blocks for display as items...");
createBlockTextures()
  .then(() => {
    process.stdout.write("DONE\nSelecting appropriate side image to display for multi side blocks...");
    pickMultiFaceBlockDisplaySide();
    console.log("DONE\n\u001b[33mIF YOU GET ANY ERRORS, JUST RERUN THE COMMAND UNTIL NO ERRORS POP UP. Also please make sure to run this command at least twice to also get some basic support for multi side blocks like the furnace!\u001b[0m");
  });
