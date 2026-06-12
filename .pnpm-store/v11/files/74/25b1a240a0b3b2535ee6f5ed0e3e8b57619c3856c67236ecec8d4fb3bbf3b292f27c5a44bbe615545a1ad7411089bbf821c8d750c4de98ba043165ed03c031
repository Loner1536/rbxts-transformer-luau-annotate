-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local useEffect = TS.import(script, TS.getModule(script, "@rbxts", "react")).useEffect
--[[
	*
	 * Runs an async effect and cancels the promise when unmounting the effect.
	 * Note that effects paused by `await` still run while cancelled, so prefer
	 * to use promise chaining instead.
	 * @param effect The async effect to run.
	 * @param deps The dependencies to run the effect on.
	 
]]
local function useAsyncEffect(effect, deps)
	useEffect(function()
		local promise = effect()
		return function()
			promise:cancel()
		end
	end, deps)
end
return {
	useAsyncEffect = useAsyncEffect,
}
