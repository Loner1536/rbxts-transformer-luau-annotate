-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local useEffect = TS.import(script, TS.getModule(script, "@rbxts", "react")).useEffect
local useAsyncCallback = TS.import(script, script.Parent.Parent, "use-async-callback").useAsyncCallback
--[[
	*
	 * Returns a tuple containing the result and status of a promise. When the
	 * dependencies change, pending promises will be cancelled, and a new promise
	 * will be started.
	 * @param callback The async callback.
	 * @param deps The dependencies to watch. Defaults to an empty array.
	 * @returns The result and status of the promise.
	 
]]
local function useAsync(callback, deps)
	if deps == nil then
		deps = {}
	end
	local state, asyncCallback = useAsyncCallback(callback)
	useEffect(function()
		asyncCallback()
	end, deps)
	return state.value, state.status, state.message
end
return {
	useAsync = useAsync,
}
