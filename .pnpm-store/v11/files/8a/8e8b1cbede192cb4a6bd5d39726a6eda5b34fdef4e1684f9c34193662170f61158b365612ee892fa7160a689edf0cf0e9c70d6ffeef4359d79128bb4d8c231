-- Compiled with roblox-ts v3.0.0
--* @hidden 
local isAbstractConstructor
local function isConstructor(obj)
	return isAbstractConstructor(obj) and obj.new ~= nil
end
function isAbstractConstructor(obj)
	return obj.constructor ~= nil
end
return {
	isConstructor = isConstructor,
	isAbstractConstructor = isAbstractConstructor,
}
