
# Change Log

## [1.0.2]

### Added

- Included instructions how to use the vite dev server
- Updated readme accordingly

## [1.0.1]

### Changed

- Easier config for hosting on localhost & public ip
- Updated readme accordingly

## [1.0.0]

### Changed

- This version is released under AGPL
 
### Added

- Link to github, displayed below the discord widget.

## [0.9.1]

### Fixed

- Crash when starting server.
 
## [0.9.0]
 
### Added

- Cute new favicon.
- Discord widget in bottom right.
- Keyboard shortcuts are now displayed in the buttons that have shortcuts.
- Button with program to automatically place and install new turtle.
- Simple server side user management.
- Simple server cmd line interface. Currently supports
  - users : list all users sorted by recent activity
  - deleteTurtle <id> : delete turtle from current state - use that to remove a turtle from the ui that is gone for good.
- Better logging, now also to a log file.
- Hijack the important turtle move functions. So turtle.up() can be used in the lua terminal in the ui without causing a position desync.
 
### Changed
  
- This version is no longer released under AGPL.
- Added "Turtle" prefix to turtle selector & added some padding.
- Most of the UI now got a dark theme.
- Because the stop buttom sometimes causes desyncs in now only clears the cmd queue to prevent that.
- Commented out some of the buttons to control the turtle, as they contained old / unrelated programs.
- The turtle texture was modified to show a little more emotion =).

## [0.8.0]
 
### Added

- The turtle selector in the UI will now also display the turtle label.
- Added a loading message for display while loading the state.
- Added support for animated textures.
- Added support for cross block model (e.g. in flowers).
- Replace native turtle move methods with tapi equivalents to not lose track of turtles when accidentally using native methods.
- Replace os.shutdown with empty function.
 
### Changed
  
- After clicking one of the movement buttons, the return value will now be displayed at the bottom of the UI.