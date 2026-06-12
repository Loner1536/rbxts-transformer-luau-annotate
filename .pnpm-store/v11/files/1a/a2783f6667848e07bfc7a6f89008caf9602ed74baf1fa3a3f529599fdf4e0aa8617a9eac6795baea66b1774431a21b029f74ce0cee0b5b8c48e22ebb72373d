-- Compiled with roblox-ts v2.1.0
local TS = _G[script]
local RunService = TS.import(script, TS.getModule(script, "@rbxts", "services")).RunService
--[[
	*
	* Schedule a callback to be called every `interval` seconds. Returns a
	* function that can be called to stop the timer.
	* @param callback The callback to call every `interval` seconds.
	* @param interval The interval in seconds.
	* @returns A cleanup function.
]]
local function setInterval(callback, interval)
	local timer = 0
	local connection = RunService.Heartbeat:Connect(function(delta)
		timer += delta
		if timer >= interval then
			timer = 0
			callback()
		end
	end)
	return function()
		return connection:Disconnect()
	end
end
return {
	setInterval = setInterval,
}
