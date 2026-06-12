-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _react = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local createBinding = _react.createBinding
local joinBindings = _react.joinBindings
local lerp = TS.import(script, script.Parent, "math").lerp
--[[
	*
	 * Returns whether the given value is a binding.
	 * @param value The value to check.
	 * @returns Whether the value is a binding.
	 
]]
local function isBinding(value)
	local _value = value
	local _condition = type(_value) == "table"
	if _condition then
		_condition = value.getValue ~= nil and value.map ~= nil
	end
	return _condition
end
--[[
	*
	 * Converts a value to a binding. If the given value is already a binding, it
	 * will be returned as-is.
	 * @param value The value to convert.
	 * @returns The converted binding.
	 
]]
local function toBinding(value)
	if isBinding(value) then
		return value
	else
		local result = createBinding(value)
		return result
	end
end
--[[
	*
	 * Returns the value of a binding. If the given value is not a binding, it will
	 * be returned as-is.
	 * @param binding The binding to get the value of.
	 * @returns The value of the binding.
	 
]]
local function getBindingValue(binding)
	if isBinding(binding) then
		return binding:getValue()
	else
		return binding
	end
end
--[[
	*
	 * Maps a binding to a new binding. If the given value is not a binding, it will
	 * be passed to the mapper function and returned as a new binding.
	 * @param binding The binding to map.
	 * @param callback The mapper function.
	 * @returns The mapped binding.
	 
]]
local function mapBinding(binding, callback)
	if isBinding(binding) then
		return binding:map(callback)
	else
		local result = createBinding(callback(binding))
		return result
	end
end
--[[
	*
	 * Joins a map of bindings into a single binding. If any of the given values
	 * are not bindings, they will be wrapped in a new binding.
	 * @param bindings The bindings to join.
	 * @returns The joined binding.
	 
]]
local function joinAnyBindings(bindings)
	local bindingsToMap = {}
	for k, v in pairs(bindings) do
		bindingsToMap[k] = toBinding(v)
	end
	return joinBindings(bindingsToMap)
end
--[[
	*
	 * Gets the internal API of a binding. This is a hacky way to get access to the
	 * `BindingInternalApi` object of a binding, which is not exposed by React.
	 * @param binding The binding to get the internal API of.
	 * @returns The binding's API.
	 
]]
local function getBindingApi(binding)
	for key, value in pairs(binding) do
		local name = tostring(key)
		if name == "Symbol(BindingImpl)" or string.sub(name, 1, 12) == "RoactBinding" then
			return value
		end
	end
end
--[[
	*
	 * Returns a binding that lerps between two values using the given binding as
	 * the alpha.
	 * @param binding The binding to use as the alpha.
	 * @param from The value to lerp from.
	 * @param to The value to lerp to.
	 * @returns A binding that lerps between two values.
	 
]]
local function lerpBinding(binding, from, to)
	return mapBinding(binding, function(alpha)
		local _from = from
		if type(_from) == "number" then
			return lerp(from, to, alpha)
		else
			return from:Lerp(to, alpha)
		end
	end)
end
--[[
	*
	 * Composes multiple bindings or values together into a single binding.
	 * Calls the combiner function with the values of the bindings when any
	 * of the bindings change.
	 * @param ...bindings A list of bindings or values.
	 * @param combiner The function that maps the bindings to a new value.
	 * @returns A binding that returns the result of the combiner.
	 
]]
local function composeBindings(...)
	local values = { ... }
	-- ▼ Array.pop ▼
	local _length = #values
	local _result = values[_length]
	values[_length] = nil
	-- ▲ Array.pop ▲
	local combiner = _result
	-- ▼ ReadonlyArray.map ▼
	local _newValue = table.create(#values)
	for _k, _v in values do
		_newValue[_k] = toBinding(_v, _k - 1, values)
	end
	-- ▲ ReadonlyArray.map ▲
	local bindings = _newValue
	return joinBindings(bindings):map(function(bindings)
		return combiner(unpack(bindings))
	end)
end
return {
	isBinding = isBinding,
	toBinding = toBinding,
	getBindingValue = getBindingValue,
	mapBinding = mapBinding,
	joinAnyBindings = joinAnyBindings,
	getBindingApi = getBindingApi,
	lerpBinding = lerpBinding,
	composeBindings = composeBindings,
}
