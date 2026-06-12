-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _react = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useMemo = _react.useMemo
local useRef = _react.useRef
local isStrictEqual = TS.import(script, script.Parent.Parent, "use-previous").isStrictEqual
--[[
	*
	 * Returns a mutable ref that points to the latest value of the input.
	 *
	 * Takes an optional `predicate` function as the second argument that receives
	 * the previous and current value. If the predicate returns `false`, the values
	 * are not equal, and the previous value is updated.
	 *
	 * @param value The value to track.
	 * @returns A mutable reference to the value.
	 
]]
local function useLatest(value, predicate)
	if predicate == nil then
		predicate = isStrictEqual
	end
	local ref = useRef(value)
	useMemo(function()
		if not predicate(ref.current, value) then
			ref.current = value
		end
	end, { value })
	return ref
end
return {
	useLatest = useLatest,
}
