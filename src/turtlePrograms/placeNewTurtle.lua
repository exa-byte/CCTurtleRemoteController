local valid_turtle_ids = {
  "computercraft:turtle_normal",
  "computercraft:turtle_advanced"
}

local found = false
for _,id in pairs(valid_turtle_ids) do
  if tapi.selectItem(id) then found = true; break end
end
if not found then return false end

if not tapi.placeUp() then return false end

local p = peripheral.wrap("top")
if not p then return false end
p.turnOn()

-- TODO: use disk drive to automatically configure other turtle