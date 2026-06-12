-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _core = TS.import(script, TS.getModule(script, "@flamework", "core").out)
local Modding = _core.Modding
local Reflect = _core.Reflect
local function isConstructor(obj)
	return obj.constructor ~= nil and obj.new ~= nil
end
local function getParentConstructor(ctor)
	local metatable = getmetatable(ctor)
	if metatable and type(metatable) == "table" then
		local parentConstructor = rawget(metatable, "__index")
		return parentConstructor
	end
end
local function safeCall(message, func, printStack)
	if printStack == nil then
		printStack = true
	end
	task.spawn(function()
		xpcall(func, function(err)
			local _err = err
			local _condition = type(_err) == "string"
			if _condition then
				_condition = printStack
			end
			if _condition then
				local stack = debug.traceback(err, 2)
				warn(unpack(message))
				warn(stack)
			else
				warn(unpack(message))
				warn(err)
				if printStack then
					warn(debug.traceback(nil, 2))
				end
			end
		end)
	end)
end
local function getComponentFromSpecifier(componentSpecifier)
	local _componentSpecifier = componentSpecifier
	return if type(_componentSpecifier) == "string" then (Modding.getObjectFromId(componentSpecifier)) else componentSpecifier
end
local function getIdFromSpecifier(componentSpecifier)
	if componentSpecifier ~= nil then
		local _componentSpecifier = componentSpecifier
		return if type(_componentSpecifier) == "string" then componentSpecifier else Reflect.getMetadata(componentSpecifier, "identifier")
	end
end
return {
	isConstructor = isConstructor,
	getParentConstructor = getParentConstructor,
	safeCall = safeCall,
	getComponentFromSpecifier = getComponentFromSpecifier,
	getIdFromSpecifier = getIdFromSpecifier,
}
