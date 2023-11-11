# CCTurtleRemoteController
A node server with user interface for remote controlling your computercraft turtles in your browser via the http api.
<img width="960" alt="image" src="https://user-images.githubusercontent.com/14824895/166954166-ecf32647-2f5f-4cff-bf16-a79f6dba9573.png">

**Setup**

1. Clone this repo or download it as zip and extract it
2. Install Node.js including npm (https://nodejs.org/en/) or make sure you update the version you are using else it will likely cause some errors.
3. Run `npm install` in the root directory of the repo
4. Now you have 2 options, pick one of them:
    * setup port forwarding and replace every localhost in the code ("src/server/server.js" Line 22, "src/store/useworld.ts" Line 5 for the ui and "turtle/startup" Line 2, "turtle/tapi" Line 6 for the turtle) with your public ip address
    * allow http calls to localhost in your <mcsavegame>/serverconfig/computercraft-server.toml
6. Build the frontend using `npm run build`
7. If you don't want to see textured blocks and items in the ui you can skip this point, ~~else run the command `npm run build-textures "<pathToYourMinecraftJar>" "<optional: directoryContainingYourModJars>"`; in case any errors pop up, just restart the command until no errors pop up. The command will need to be executed 2 times without errors due to some bug. After completion, the ui will be able to display most blocks and items with default mc textures applied~~ (currently doesn't work, you can still add your own icon renders though)
8. Run the server: `npm run server`
9. You can now reach the ui from http://localhost/ or your public ip address if you chose the second option in step 4
10. Add any amount of turtles by running `wget run http://localhost/turtle/startup` or `wget run http://<yourip>/turtle/startup` in the turtles command line and following the displayed instructions
11. You can now select a turtle id in the top left corner of the ui and press the `toggle follow` button to move the camera to it
12. The selected turtle can be controlled by the buttons on the interface or some basic keyboard shortcuts (wasdqe)
13. You can also directly input code to be executed on the turtle, however if you use the native move functions of the turtle, you will desync the turtle location - use the `tapi` library equivalents instead
  
**Block and item textures**

❗ Due some changes in a dependency, this currently doesn't work anymore.
🔥new: Extracting textures is now easier than ever: just go with step 7 in setup.
The ui supports textured blocks and items. They are just not included here for license reasons. If you want to, you can extract the block textures from your `/minecraft/versions/YOUR_VERSION/x.xx.x.jar` and paste them into `textures/blocks/minecraft/`.
Same goes for items which go into `textures/items/minecraft/`. However normal block icons are not included, you will have to render them yourself from the blocktextures or get them from somewhere else (I used https://www.npmjs.com/package/minecraft-blocks-render).
If you have other mods installed you can also extract the textures in the same way, except that the textures then go into `textures/blocks/yourmodname/` and `textures/items/yourmodname/` respectively.

**Random info**

- you can double click a block and the selected turtle will try to move there with a very simple algorithm
- hovering over a block will show its id in the top right corner along with its coordinates
- you can click a chest to open a window displaying its contents, however interaction is not implemented yet
- you can drag and drop between turtle inventory slots hold `ctrl` for moving a whole stack
- the bar below the turtle inventory is the turtles fuel gauge and shows the number of blocks you can move with the current fuel level
- unfortunately some minecraft block textures are not easily extractable and have to be handled with extra steps (e.g. chest, furnace, leaf blocks that are greyscale)
- the turtles are controlled via a command queue, that means if you spam a button 10 times a second the turtle will not ignore the 9 times it is not able to perform that second but will execute them as fast as it can; the command queue can be cleared with the 'del' key (if you spammed it too much)
- if you don't have a chunkloader you will have to stay in render distance of the turtle, else the currently running program will be stopped and cannot be easily continued (the turtle will restart and reconnect when you come into range again though)
   
**Keyboard bindings**
   
| Key | Action                     |
|-----|----------------------------|
| w   | move forward               |
| s   | move back                  |
| q   | move down                  |
| e   | move up                    |
| a   | turn left                  |
| d   | turn right                 |
| del | stop (clear command queue) |
