-- Compiled with roblox-ts v2.1.0
local TS = _G[script]
local RunService = TS.import(script, TS.getModule(script, "@rbxts", "services")).RunService
--[[
	*
	* Schedule a callback to be called once after `timeout` seconds. Returns a
	* function that can be called to stop the timer.
	* @param callback The callback to call after `timeout` seconds.
	* @param timeout The timeout in seconds.
	* @returns A cleanup function.
]]
local function setTimeout(callback, timeout)
	local timer = 0
	local connection
	connection = RunService.Heartbeat:Connect(function(delta)
		timer += delta
		if timer >= timeout then
			connection:Disconnect()
			callback()
		end
	end)
	return function()
		return connection:Disconnect()
	end
end
return {
	setTimeout = setTimeout,
}
