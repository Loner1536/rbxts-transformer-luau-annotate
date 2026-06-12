-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local useMemo = TS.import(script, TS.getModule(script, "@rbxts", "react")).useMemo
local useLatestCallback = TS.import(script, script.Parent.Parent, "use-latest-callback").useLatestCallback
--[[
	*
	 * Composes multiple ref functions into a single ref function and memoizes
	 * the result.
	 *
	 * To prevent excess ref calls, the composed ref is only created once on mount.
	 * However, it will call the latest refs passed, so it is safe to pass in refs
	 * that might change.
	 *
	 * @param refs The ref functions to compose.
	 * @returns A ref function that calls all of the ref functions passed in.
	 
]]
local composeRefs
local function useComposedRef(...)
	local refs = { ... }
	local composedRef = useMemo(function()
		return composeRefs(unpack(refs))
	end, refs)
	-- Make sure the function returned never changes when dependencies change.
	-- Otherwise, the ref will be called again, and might cause other problems.
	return useLatestCallback(composedRef)
end
--[[
	*
	 * Composes multiple ref functions into a single ref function.
	 * @param refs The ref functions to compose.
	 * @returns A ref function that calls all of the ref functions passed in.
	 
]]
function composeRefs(...)
	local refs = { ... }
	-- ▼ ReadonlyArray.filterUndefined ▼
	local _length = 0
	for _i in refs do
		if _i > _length then
			_length = _i
		end
	end
	local _result = {}
	local _resultLength = 0
	for _i = 1, _length do
		local _v = refs[_i]
		if _v ~= nil then
			_resultLength += 1
			_result[_resultLength] = _v
		end
	end
	-- ▲ ReadonlyArray.filterUndefined ▲
	local refsDefined = _result
	return function(rbx)
		for _, ref in refsDefined do
			ref(rbx)
		end
	end
end
return {
	useComposedRef = useComposedRef,
	composeRefs = composeRefs,
}
