-- turtle.suck(25);
-- turtle.refuel();
while true do
	while not tapi.down() do
		dir = math.random(1, 5)
		print(dir)
		if dir == 1 then tapi.forward() end
		if dir == 2 then tapi.left() end
		if dir == 3 then tapi.right() end
		if dir == 4 then
			while tapi.forward() do end
			tapi.up();
		end
		if dir == 5 then
			while not tapi.forward() do
				local succ = tapi.up();
        if not succ then break end
			end
		end
	end
end