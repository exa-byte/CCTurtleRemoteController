# CCTurtleRemoteController
A node server with user interface for remote controlling your computercraft turtles via the http api.

**Setup**

1. Clone this repo
2. Install Node.js including npm (https://nodejs.org/en/)
3. Run `npm install` in the root directory of the repo
4. Now you have 2 options, pick one of them:
    * setup port forwarding and replace every localhost with your public ip address
    * allow http calls to localhost in your <mcsavegame>/serverconfig/computercraft-server.toml
6. Build the frontend using `npm run build`
7. Run the server: `npm run server`
8. You can now reach the ui from http://localhost/
9. Add any amount of turtles by running `wget run https://raw.githubusercontent.com/exa-byte/CCTurtleRemoteController/main/turtle/startup` in the turtles command line and following the displayed instructions
10. You can now select a turtle id in the top left corner of the ui and press the `toggle follow` button to move the camera to it
11. The selected turtle can be controlled by the buttons on the interface or some basic keyboard shortcuts (wasdqe)
12. You can also directly input code to be executed on the turtle, however if you use the native move functions of the turtle, you will desync the turtle location - use the `tapi` library equivalents instead
  
**Block and item textures**

The ui supports textured blocks and items. They are just not included here for license reasons. If you want to, you can extract the block textures from your `/minecraft/versions/YOUR_VERSION/x.xx.x.jar` and paste them into `textures/blocks/minecraft/`.
Same goes for items which go into `textures/items/minecraft/`. However normal block icons are not included, you will have to render them yourself from the blocktextures or get them from somewhere else (I used https://www.npmjs.com/package/minecraft-blocks-render).
If you have other mods installed you can also extract the textures in the same way, except that the textures then go into `textures/blocks/yourmodname/` and `textures/items/yourmodname/` respectively.
  
**Known Bugs**
  
* there is a bug in the transaction code which desyncs the ui block world state from the servers' - a page reload fixes this temporarily
  
