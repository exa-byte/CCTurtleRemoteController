-- skynet expander

-- check for enough materials
if not (tapi.contains_items("computercraft:turtle_normal", 1) or tapi.contains_items("computercraft:turtle_normal", 1)) then
  return "need at least one turtle in inventory" end
if not tapi.contains_items("computercraft:disk") then
  return "need at least one computercraft:disk in inventory" end
if not tapi.contains_items("computercraft:disk_drive") then
  return "need at least one computercraft:disk_drive in inventory" end
  
-- check space
if not tapi.u(2) then return "need at least two free spaces above start position" end
if not tapi.d(1) then return "something blocked the space below, try again" end

-- place disk drive
tapi.selectItem("computercraft:disk_drive")
if not tapi.placeDown() then return "could not place down disk drive" end
tapi.selectItem("computercraft:disk")
if not tapi.dropDown() then return "could not drop down disk into disk drive" end

-- copy relevant files onto floppy
fs.delete("disk/_startup")
fs.delete("disk/loc.sav")
fs.delete("disk/startup")
fs.copy("backup/startup", "disk/_startup")
fs.copy("loc.sav", "disk/loc.sav")
fs.copy("diskboot", "disk/startup")

-- move up and place turtle
if not tapi.u(1) then return "something blocked the space above, try again" end
tapi.select(tapi.findItemFuzzy("turtle"))
if not tapi.placeDown() then return "could not place down turtle" end

-- turn turtle on
local p
while not p do p = peripheral.wrap("bottom") end
p.turnOn()

return true