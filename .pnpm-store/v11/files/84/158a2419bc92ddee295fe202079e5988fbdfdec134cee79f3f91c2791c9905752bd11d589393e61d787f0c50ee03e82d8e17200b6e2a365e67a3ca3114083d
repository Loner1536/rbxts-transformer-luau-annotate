-- Compiled with roblox-ts v2.1.0
local TS = _G[script]
-- / <reference types="@rbxts/testez/globals" />
local setTimeout = TS.import(script, script.Parent, "set-timeout").setTimeout
return function()
	it("should call the callback after the timeout", function()
		local count = 0
		setTimeout(function()
			count += 1
		end, 0.03)
		expect(count).to.equal(0)
		task.wait(0.04)
		expect(count).to.equal(1)
	end)
	it("should not call the callback if the timer is stopped", function()
		local count = 0
		local stop = setTimeout(function()
			count += 1
		end, 0.03)
		expect(count).to.equal(0)
		stop()
		task.wait(0.09)
		expect(count).to.equal(0)
	end)
end
