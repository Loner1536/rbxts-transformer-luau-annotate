-- Compiled with roblox-ts v2.1.0
local TS = _G[script]
--[[
	*
	* Calls a function every `interval` seconds until the countdown reaches 0.
	* Returns a promise that resolves when the countdown is over. Canceling the
	* promise will stop the countdown.
	* @param callback The callback to call every second.
	* @param countdown The countdown in seconds.
	* @param interval The interval in seconds.
	* @returns A promise that resolves when the countdown reaches 0.
]]
local function setCountdown(callback, countdown, interval)
	if interval == nil then
		interval = 1
	end
	-- Note that 'index' here is 1-based
	return TS.Promise.each(table.create(countdown, 0), function(_, index)
		callback(countdown - (index - 1))
		return TS.Promise.delay(interval)
	end)
end
return {
	setCountdown = setCountdown,
}
