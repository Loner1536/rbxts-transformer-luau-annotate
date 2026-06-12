-- Compiled with roblox-ts v3.0.0
--[[
	*
	 * Linearly interpolates between two numbers.
	 * @param a The first number.
	 * @param b The second number.
	 * @param alpha The alpha value to use.
	 * @returns The interpolated number.
	 
]]
local function lerp(a, b, alpha)
	return a + (b - a) * alpha
end
--[[
	*
	 * Maps a value from one range to another.
	 * @param value The value to map.
	 * @param fromMin The minimum of the input range.
	 * @param fromMax The maximum of the input range.
	 * @param toMin The minimum of the output range.
	 * @param toMax The maximum of the output range.
	 * @returns The mapped value.
	 
]]
local function map(value, fromMin, fromMax, toMin, toMax)
	return ((value - fromMin) * (toMax - toMin)) / (fromMax - fromMin) + toMin
end
--[[
	*
	 * Multiplies transparency values together. Normally, multiplying transparency
	 * values requires inverting them (to get opacity), multiplying them, and then
	 * inverting them again. This function does that for you.
	 * @param transparencies The transparencies to multiply.
	 * @returns The multiplied transparency.
	 
]]
local function blend(...)
	local transparencies = { ... }
	local result = 1
	for _, transparency in transparencies do
		result *= 1 - transparency
	end
	return 1 - result
end
return {
	lerp = lerp,
	map = map,
	blend = blend,
}
