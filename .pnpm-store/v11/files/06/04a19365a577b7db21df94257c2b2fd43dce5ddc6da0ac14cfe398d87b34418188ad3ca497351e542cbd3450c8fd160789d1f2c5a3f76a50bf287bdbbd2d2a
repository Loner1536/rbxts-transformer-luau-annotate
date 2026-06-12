-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local RunService = TS.import(script, TS.getModule(script, "@rbxts", "services")).RunService
local createSignalContainer = TS.import(script, script.Parent.Parent, "util", "createSignalContainer").createSignalContainer
local createGenericHandler = TS.import(script, script.Parent, "createGenericHandler").createGenericHandler
local createServerMethod = TS.import(script, script.Parent, "createServerMethod").createServerMethod
local createClientMethod = TS.import(script, script.Parent, "createClientMethod").createClientMethod
local SERVER_PREFIX = "$"
local CLIENT_PREFIX = "@"
local function getDefaultConfiguration(config)
	local _object = {}
	local _left = "middleware"
	local _condition = config.middleware
	if _condition == nil then
		_condition = {}
	end
	_object[_left] = _condition
	local _left_1 = "defaultTimeout"
	local _condition_1 = config.defaultTimeout
	if _condition_1 == nil then
		_condition_1 = (if RunService:IsClient() then 30 else 10)
	end
	_object[_left_1] = _condition_1
	local _left_2 = "warnOnInvalidGuards"
	local _condition_2 = config.warnOnInvalidGuards
	if _condition_2 == nil then
		_condition_2 = RunService:IsStudio()
	end
	_object[_left_2] = _condition_2
	local _left_3 = "disableIncomingGuards"
	local _condition_3 = config.disableIncomingGuards
	if _condition_3 == nil then
		_condition_3 = false
	end
	_object[_left_3] = _condition_3
	return _object
end
local function createNetworkingFunction(globalName)
	local signals = createSignalContainer()
	local server
	local client
	return {
		createServer = function(self, config, meta)
			if RunService:IsRunning() and not RunService:IsServer() then
				return nil
			end
			if server == nil then
				server = createGenericHandler(globalName, nil, SERVER_PREFIX, CLIENT_PREFIX, meta, getDefaultConfiguration(config), signals, createServerMethod)
			end
			return server
		end,
		createClient = function(self, config, meta)
			if RunService:IsRunning() and not RunService:IsClient() then
				return nil
			end
			if client == nil then
				client = createGenericHandler(globalName, nil, CLIENT_PREFIX, SERVER_PREFIX, meta, getDefaultConfiguration(config), signals, createClientMethod)
			end
			return client
		end,
		registerHandler = function(self, key, callback)
			return signals:connect(key, callback)
		end,
	}
end
return {
	createNetworkingFunction = createNetworkingFunction,
}
