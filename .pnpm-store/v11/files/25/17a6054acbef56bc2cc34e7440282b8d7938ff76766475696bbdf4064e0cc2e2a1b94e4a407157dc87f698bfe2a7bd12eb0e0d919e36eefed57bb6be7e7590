-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local RunService = TS.import(script, TS.getModule(script, "@rbxts", "services")).RunService
local createClientMethod = TS.import(script, script.Parent, "createClientMethod").createClientMethod
local createServerMethod = TS.import(script, script.Parent, "createServerMethod").createServerMethod
local createSignalContainer = TS.import(script, script.Parent.Parent, "util", "createSignalContainer").createSignalContainer
local createGenericHandler = TS.import(script, script.Parent, "createGenericHandler").createGenericHandler
local function getDefaultConfiguration(config)
	local _object = {}
	local _left = "middleware"
	local _condition = config.middleware
	if _condition == nil then
		_condition = {}
	end
	_object[_left] = _condition
	local _left_1 = "warnOnInvalidGuards"
	local _condition_1 = config.warnOnInvalidGuards
	if _condition_1 == nil then
		_condition_1 = RunService:IsStudio()
	end
	_object[_left_1] = _condition_1
	local _left_2 = "disableIncomingGuards"
	local _condition_2 = config.disableIncomingGuards
	if _condition_2 == nil then
		_condition_2 = false
	end
	_object[_left_2] = _condition_2
	return _object
end
local function createNetworkingEvent(globalName)
	local signals = createSignalContainer()
	local server
	local client
	return {
		createServer = function(self, config, meta)
			if RunService:IsRunning() and not RunService:IsServer() then
				return nil
			end
			if server == nil then
				server = createGenericHandler(globalName, nil, meta, getDefaultConfiguration(config), signals, createServerMethod)
			end
			return server
		end,
		createClient = function(self, config, meta)
			if RunService:IsRunning() and not RunService:IsClient() then
				return nil
			end
			if client == nil then
				client = createGenericHandler(globalName, nil, meta, getDefaultConfiguration(config), signals, createClientMethod)
			end
			return client
		end,
		registerHandler = function(self, key, callback)
			return signals:connect(key, callback)
		end,
	}
end
return {
	createNetworkingEvent = createNetworkingEvent,
}
