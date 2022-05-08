# CCTurtleRemoteController
A node server with user interface for remote controlling your computercraft turtles in your browser via the http api.
<img width="960" alt="image" src="https://user-images.githubusercontent.com/14824895/166954166-ecf32647-2f5f-4cff-bf16-a79f6dba9573.png">

**Setup**

1. Clone this repo
2. Install Node.js including npm (https://nodejs.org/en/)
3. Run `npm install` in the root directory of the repo
4. Now you have 2 options, pick one of them:
    * setup port forwarding and replace every localhost with your public ip address
    * allow http calls to localhost in your <mcsavegame>/serverconfig/computercraft-server.toml
6. Build the frontend using `npm run build`
7. Run the server: `npm run server`
8. You can now reach the ui from http://localhost/ or your public ip address if you chose the second option in step 4
9. Add any amount of turtles by running `wget run https://raw.githubusercontent.com/exa-byte/CCTurtleRemoteController/main/turtle/startup` in the turtles command line and following the displayed instructions
10. You can now select a turtle id in the top left corner of the ui and press the `toggle follow` button to move the camera to it
11. The selected turtle can be controlled by the buttons on the interface or some basic keyboard shortcuts (wasdqe)
12. You can also directly input code to be executed on the turtle, however if you use the native move functions of the turtle, you will desync the turtle location - use the `tapi` library equivalents instead
  
**Block and item textures**

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
  
**Known bugs**
  
* when using the transaction-only state update method, there is a bug in the transaction code which desyncs the ui block world state from the servers' - a page reload fixes this temporarily; for now the default is fetching the complete state every second, but this is not very performant for larger states
  
