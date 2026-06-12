-- Compiled with roblox-ts v2.1.0
local TS = _G[script]
-- / <reference types="@rbxts/testez/globals" />
local setInterval = TS.import(script, script.Parent, "set-interval").setInterval
return function()
	it("should call the callback every interval", function()
		local count = 0
		setInterval(function()
			count += 1
		end, 0.03)
		expect(count).to.equal(0)
		task.wait(0.03 * 3 + 0.01)
		expect(count).to.equal(3)
	end)
	it("should not call the callback if the timer is stopped", function()
		local count = 0
		local stop = setInterval(function()
			count += 1
		end, 0.03)
		expect(count).to.equal(0)
		stop()
		task.wait(0.03 * 3 + 0.01)
		expect(count).to.equal(0)
	end)
end
