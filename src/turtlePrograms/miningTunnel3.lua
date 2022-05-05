--- Given a block's data, returns true if it's a treasure
-- @return Boolean of whether it's a treasure
function isTreasure(block)
  return block.name:find('ore')
end

--- Calculate the destination coordinate from current pos, orientation, and desired turn
-- This calculation is RELATIVE and doesn't correspond with Minecraft's F3 coordinates
-- @param Table xyz             Table of coordinates {x,y,z} of the starting point
-- @param String orientation    The cardinal direction you face at the starting point
-- @param String direction      The direction (e.g. left, right, up) you would turn and proceed into
-- @return { {x, y, z}, orientation } of destination
function calcDest(xyz, orientation, direction)
  local dest = {
    x = xyz['x'],
    y = xyz['y'],
    z = xyz['z']
  }
  if direction == 'up' then
    dest['y'] = dest['y'] + 1
  elseif direction == 'down' then
    dest['y'] = dest['y'] - 1
  else
    local cardinals = {
      north = 0,
      west = 1,
      south = 2,
      east = 3
    }
    local cardinalsReverse = {
      [0] = 'north',
      'west',
      'south',
      'east'
    }
    local leftTurns = {
      front = 0,
      left = 1,
      back = 2,
      right = 3
    }
    orientation = cardinalsReverse[(cardinals[orientation] + leftTurns[direction]) % 4]
    if orientation == 'north' then
      dest['z'] = dest['z'] + 1
    elseif orientation == 'south' then
      dest['z'] = dest['z'] - 1
    elseif orientation == 'east' then
      dest['x'] = dest['x'] + 1
    elseif orientation == 'west' then
      dest['x'] = dest['x'] - 1
    end
  end
  return {dest, orientation}
end

--- Test if a table of {x,y,z}s contains a certain {x,y,z}
-- @param Table table   table to search within
-- @param Table xyz     xyz to search for
-- @return Boolean of whether the table has the xyz
function contains(table, xyz)
  for _, v in ipairs(table) do
    if v['x'] == xyz['x'] and v['y'] == xyz['y'] and v['z'] == xyz['z'] then
      return true
    end
  end
  return false
end

--- Master function for mining a vein of treasures as if it were a graph
-- with each block as a node and the directions you can travel from that block as edges
-- When beginning to mine, assumes whatever orientation the turtle is facing as "north"
-- and wherever it started mining as {0, 0, 0} xyz
function mineVein()
  mineVeinHelper({
    x = 0,
    y = 0,
    z = 0
  }, 'north', {})
end

--- Recursive helper function for mining a vein of treasures (blocks)
-- using the graph traversal method
-- @param Table xyz             Current location {x,y,z} of turtle
-- @param String orientation    Current orientation of turtle
-- @param Table traversed       Table of tables {x,y,z} of visited blocks
function mineVeinHelper(xyz, orientation, traversed)
  for _, direction in ipairs({'up', 'down', 'front', 'back', 'left', 'right'}) do
    local destination, newOrientation = table.unpack(calcDest(xyz, orientation, direction))
    if not contains(traversed, destination) then
      if direction ~= 'back' then
        table.insert(traversed, destination)
      end

      if direction == 'up' then
        local success, data = turtle.inspectUp()
        if success and isTreasure(data) then
          tapi.digUpRepeat()
          tapi.up()
          mineVeinHelper(destination, newOrientation, traversed);
          tapi.down()
        end
      elseif direction == 'down' then
        local success, data = turtle.inspectDown()
        if success and isTreasure(data) then
          tapi.digDownRepeat()
          tapi.down()
          mineVeinHelper(destination, newOrientation, traversed);
          tapi.up()
        end
      elseif direction == 'back' then
        local leftOrient = orientation
        for i = 1, 3 do
          local calculated = calcDest(xyz, leftOrient, 'left')
          local leftDest = calculated[1]
          leftOrient = calculated[2]
          tapi.left()
          table.insert(traversed, leftDest)
          local success, data = turtle.inspect()
          if success and isTreasure(data) then
            tapi.digRepeat()
            tapi.forward()
            mineVeinHelper(leftDest, leftOrient, traversed);
            tapi.back()
          end
        end
        tapi.left()
      else
        -- turn in the direction to inspect
        if direction == 'left' then
          tapi.left()
        elseif direction == 'right' then
          tapi.right()
        end
        -- inspect the block
        local success, data = turtle.inspect()
        if success and isTreasure(data) then
          tapi.digRepeat()
          tapi.forward()
          mineVeinHelper(destination, newOrientation, traversed);
          tapi.back()
        end
        -- unturn to face forwards again
        if direction == 'left' then
          tapi.right()
        elseif direction == 'right' then
          tapi.left()
        end
      end
    end
  end
end

local function miningOp(i)
  tapi.digRepeat()
  tapi.forward()
  mineVein()
  tapi.digUpRepeat()
  if tapi.selectItem("minecraft:cobblestone") or tapi.selectItem("quark:cobbled_deepslate") then
    tapi.placeDown()
    tapi.select(1)
  end
  if (i % 12 + 11) == 0 then
    tapi.right(2)
    tapi.selectItem("minecraft:torch")
    tapi.place()
    tapi.right(2)
    tapi.select(1)
  end
end

local function isInventoryEmpty()
  for i=1,16 do
    if turtle.getItemCount > 0 then return false end
  end
  return true
end

local function getChestFreeSlotCount(side)
  side = side or "front"
  local p = peripheral.wrap(side)
  if not p then return false end
  local slots = p.list()
  if not slots then return 0 end
  local freeSlots = 0
  for i,stack in pairs(slots) do
    if not stack then freeSlots = freeSlots + 1 end
  end
  return freeSlots
end

local function dropOresIntoChest()
  for i=1,16 do
    while getChestFreeSlotCount("front") == 0 do tapi.up() end
    local stack = turtle.getItemDetail(i)
    if stack and stack.name ~= "minecraft:torch" then
      tapi.select(i)
      tapi.drop()
    end
  end
end

local function dropCrapIntoChest()
  while not isInventoryEmpty() do
    for i=1,16 do
      while getChestFreeSlotCount("front") == 0 do tapi.up() end
      local stack = turtle.getItemDetail(i)
      print(stack and stack.name)
      if stack and (
        stack.name:match("minecraft:cobblestone") or
        stack.name:match("projectred-exploration:marble") or
        stack.name:match("minecraft:gravel") or
        stack.name:match("minecraft:dirt") or
        stack.name:match("quark:smooth_basalt") or
        stack.name:match("quark:cobbled_deepslate")
      ) then
        tapi.select(i)
        tapi.drop()
      end
    end
  end
end

local function dropOffItems(i)
  local k = 0
  print("dropping off items")
  local old_pos = tapi.loc_internal
  local old_heading = tapi.loc_internal.h
  print(old_pos:tostring())
  tapi.up(1, true)
  tapi.left(2)
  tapi.forward(i, true)
  tapi.right()
  local _, block
  repeat
    tapi.f(1, true)
    k = k + 1
    _, block = turtle.inspect()
  until block and block.name == "minecraft:cobblestone"
  tapi.left()
  tapi.down(1, true)
  tapi.forward(1, true)
  dropCrapIntoChest()
  tapi.right()
  tapi.forward(1, true)
  repeat tapi.down() until turtle.detectDown()
  tapi.right()
  tapi.forward(2, true)
  tapi.right()
  tapi.forward(1, true)
  tapi.left()
  dropOresIntoChest()
  tapi.right(2)
  tapi.forward(1, true)
  repeat tapi.down() until turtle.detectDown()
  tapi.left()
  tapi.forward(k, true)
  tapi.turnTo(old_heading)
  tapi.up(1, true)
  tapi.forward(i, true)
  tapi.down(1, true)
end

local function unloadIsNeeded()
  for i=1,16 do
    if turtle.getItemCount(i) == 0 then return false end
  end
  return true
end

local function unloadIfNeeded(i)
  if unloadIsNeeded() then dropOffItems(i) end
end

local start_pos = tapi.loc_internal;
print("startPos="..start_pos:tostring())
local length = 250
for i = 1, length do
  miningOp(i)
  unloadIfNeeded(i)
end
tapi.right(2)
tapi.up(1, true)
tapi.forward(length, true)
tapi.down(1, true)
tapi.right(2)
dropOffItems(0)