local i = 0
while true do
  tapi.digUp()
  tapi.digDown()
  tapi.down()
  if tapi.selectItem("minecraft:cobblestone") then
    tapi.placeDown()
  end
  tapi.dig()
  tapi.forward()

  -- place torch every 6 blocks
  if i % 6 == 0 then
    tapi.right(2)
    tapi.selectItem("minecraft:torch")
    tapi.place()
    tapi.right(2)
  end
  if tapi.getLoc().y == 13 then break end
  i = i + 1
end