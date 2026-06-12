-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local function timeoutPromise(timeout, rejectValue)
	return TS.Promise.delay(timeout):andThen(function()
		return TS.Promise.reject(rejectValue)
	end)
end
return {
	timeoutPromise = timeoutPromise,
}
