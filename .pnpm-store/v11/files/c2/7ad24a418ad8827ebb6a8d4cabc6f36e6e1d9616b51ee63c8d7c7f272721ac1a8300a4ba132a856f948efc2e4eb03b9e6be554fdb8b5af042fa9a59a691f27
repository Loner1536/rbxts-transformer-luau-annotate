-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local RunService = TS.import(script, TS.getModule(script, "@rbxts", "services")).RunService
local createRemoteInstance = TS.import(script, script.Parent, "createRemoteInstance").createRemoteInstance
local createMiddlewareProcessor = TS.import(script, script.Parent.Parent, "middleware", "createMiddlewareProcessor").createMiddlewareProcessor
local function createEvent(options)
	local remote = createRemoteInstance(if options.reliability == "unreliable" then "UnreliableRemoteEvent" else "RemoteEvent", options.namespace, options.debugName, options.id)
	local bindable
	local invoke = createMiddlewareProcessor(options.incomingMiddleware, options.networkInfo, function(player, ...)
		local args = { ... }
		if RunService:IsServer() then
			bindable:Fire(player, unpack(args))
		else
			bindable:Fire(unpack(args))
		end
	end)
	local createConnection = function(callback)
		if bindable then
			return bindable.Event:Connect(callback)
		end
		bindable = Instance.new("BindableEvent")
		-- We defer to allow any other immediate connections to take place before unloading Roblox's queue.
		task.defer(function()
			if RunService:IsServer() then
				remote.OnServerEvent:Connect(function(player, ...)
					local args = { ... }
					invoke(player, unpack(args))
				end)
			else
				remote.OnClientEvent:Connect(function(...)
					local args = { ... }
					invoke(nil, unpack(args))
				end)
			end
		end)
		return bindable.Event:Connect(callback)
	end
	return {
		fireEither = function(self, player, ...)
			local args = { ... }
			if player then
				self:fireClient(player, unpack(args))
			else
				self:fireServer(unpack(args))
			end
		end,
		fireServer = function(self, ...)
			local args = { ... }
			remote:FireServer(unpack(args))
		end,
		fireClient = function(self, player, ...)
			local args = { ... }
			remote:FireClient(player, unpack(args))
		end,
		fireAllClients = function(self, ...)
			local args = { ... }
			remote:FireAllClients(unpack(args))
		end,
		connectServer = function(self, callback)
			local _arg0 = RunService:IsServer()
			assert(_arg0)
			return createConnection(callback)
		end,
		connectClient = function(self, callback)
			local _arg0 = RunService:IsClient()
			assert(_arg0)
			return createConnection(callback)
		end,
		invoke = invoke,
	}
end
return {
	createEvent = createEvent,
}
