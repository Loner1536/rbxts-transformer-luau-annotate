-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local t = TS.import(script, TS.getModule(script, "@flamework", "core").out.prelude).t
local Flamework = TS.import(script, TS.getModule(script, "@flamework", "core").out).Flamework
local isNetworkingFunctionError = Flamework.createGuard(t.literalList({ "Timeout", "Cancelled", "BadRequest", "Unprocessed", "InvalidResult" }))
local NetworkingFunctionError = {
	Timeout = "Timeout",
	Cancelled = "Cancelled",
	BadRequest = "BadRequest",
	Unprocessed = "Unprocessed",
	InvalidResult = "InvalidResult",
}
local function getFunctionError(value)
	local _value = value
	if type(_value) == "boolean" then
		return if value == false then NetworkingFunctionError.Unprocessed else nil
	elseif isNetworkingFunctionError(value) then
		return value
	end
end
return {
	getFunctionError = getFunctionError,
	NetworkingFunctionError = NetworkingFunctionError,
}
