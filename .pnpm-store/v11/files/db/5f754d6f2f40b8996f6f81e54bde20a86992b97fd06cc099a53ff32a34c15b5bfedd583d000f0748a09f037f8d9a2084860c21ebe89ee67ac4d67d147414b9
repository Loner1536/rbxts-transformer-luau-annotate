-- Compiled with roblox-ts v2.1.0
local TS = _G[script]
-- / <reference types="@rbxts/testez/globals" />
local setCountdown = TS.import(script, script.Parent, "set-countdown").setCountdown
return function()
	it("should call the callback every second", function()
		local count = 3
		local promise = setCountdown(function(countdown)
			count -= 1
			expect(countdown).to.equal(count)
		end, 2, 0.1)
		promise:expect()
		expect(promise:getStatus()).to.equal(TS.Promise.Status.Resolved)
		expect(count).to.equal(1)
	end)
	it("should stop the countdown when the promise is cancelled", function()
		local count = -1
		local promise = setCountdown(function(countdown)
			count = countdown
			return count
		end, 2, 0.1)
		task.wait(0.15)
		promise:cancel()
		expect(promise:getStatus()).to.equal(TS.Promise.Status.Cancelled)
		task.wait(0.15)
		expect(count).to.equal(1)
	end)
end
