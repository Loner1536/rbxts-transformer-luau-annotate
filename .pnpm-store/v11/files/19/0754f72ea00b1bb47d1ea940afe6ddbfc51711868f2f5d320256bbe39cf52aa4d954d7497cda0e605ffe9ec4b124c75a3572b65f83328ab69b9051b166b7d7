-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _react = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useMemo = _react.useMemo
local useRef = _react.useRef
local isStrictEqual = function(a, b)
	return a == b
end
--[[
	*
	 * Returns the most recent value from the previous render. Returns `undefined`
	 * on the first render.
	 *
	 * Takes an optional `predicate` function as the second argument that receives
	 * the previous and current value. If the predicate returns `false`, the values
	 * are not equal, and the previous value is updated.
	 *
	 * @param value The value to return on the next render if it changes.
	 * @param predicate Optional function to determine whether the value changed.
	 * Defaults to a strict equality check (`===`).
	 * @returns The previous value.
	 
]]
local function usePrevious(value, predicate)
	if predicate == nil then
		predicate = isStrictEqual
	end
	local previousRef = useRef()
	local currentRef = useRef()
	useMemo(function()
		if not predicate(currentRef.current, value) then
			previousRef.current = currentRef.current
			currentRef.current = value
		end
	end, { value })
	return previousRef.current
end
return {
	usePrevious = usePrevious,
	isStrictEqual = isStrictEqual,
}
