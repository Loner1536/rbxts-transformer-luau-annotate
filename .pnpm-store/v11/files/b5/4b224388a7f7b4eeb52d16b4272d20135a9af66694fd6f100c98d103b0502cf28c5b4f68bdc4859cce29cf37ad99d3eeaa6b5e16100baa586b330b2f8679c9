-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local Players = _services.Players
local RunService = _services.RunService
local createEvent = TS.import(script, script.Parent.Parent, "event", "createEvent").createEvent
local _errors = TS.import(script, script.Parent, "errors")
local NetworkingFunctionError = _errors.NetworkingFunctionError
local getFunctionError = _errors.getFunctionError
local t = TS.import(script, TS.getModule(script, "@rbxts", "t").lib.ts).t
local createRequestInfo
local function createFunctionSender(options)
	local event = createEvent({
		namespace = options.namespace,
		debugName = options.debugName,
		id = options.id,
		networkInfo = options.networkInfo,
	})
	local processResponse = function(requestInfo, id, processResult, result)
		if not t.number(id) then
			return nil
		end
		local _requests = requestInfo.requests
		local _id = id
		local request = _requests[_id]
		local _requests_1 = requestInfo.requests
		local _id_1 = id
		_requests_1[_id_1] = nil
		if request then
			request(result, getFunctionError(processResult))
		end
	end
	-- We don't need to defer here because we only accept responses to our explicit invocations.
	local requestInfoServer = {}
	local requestInfoClient = createRequestInfo()
	if RunService:IsServer() then
		event:connectServer(function(player, id, processResult, result)
			local _player = player
			local requestInfo = requestInfoServer[_player]
			if not requestInfo then
				return nil
			end
			processResponse(requestInfo, id, processResult, result)
		end)
		Players.PlayerRemoving:Connect(function(player)
			local _player = player
			local requestInfo = requestInfoServer[_player]
			local _player_1 = player
			requestInfoServer[_player_1] = nil
			if requestInfo then
				-- Cancel all existing requests from this player.
				for _, request in requestInfo.requests do
					request(nil, NetworkingFunctionError.Cancelled)
				end
			end
		end)
	else
		event:connectClient(function(id, processResult, result)
			processResponse(requestInfoClient, id, processResult, result)
		end)
	end
	local createInvocation = function(player, id, requestInfo)
		return TS.Promise.new(function(resolve, reject, onCancel)
			local _requests = requestInfo.requests
			local _id = id
			_requests[_id] = function(value, rejection)
				if rejection then
					return reject(rejection)
				end
				if options.responseMiddleware then
					options.responseMiddleware(player, value, resolve, reject)
				else
					resolve(value)
				end
			end
			onCancel(function()
				local _requests_1 = requestInfo.requests
				local _id_1 = id
				_requests_1[_id_1] = nil
			end)
		end)
	end
	return {
		invokeServer = function(self, ...)
			local args = { ... }
			local _original = requestInfoClient.nextId
			requestInfoClient.nextId += 1
			local id = _original
			event:fireServer(id, unpack(args))
			return createInvocation(nil, id, requestInfoClient)
		end,
		invokeClient = function(self, player, ...)
			local args = { ... }
			local _player = player
			local requestInfo = requestInfoServer[_player]
			if not requestInfo then
				local _exp = player
				requestInfo = createRequestInfo()
				local _requestInfo = requestInfo
				requestInfoServer[_exp] = _requestInfo
			end
			local _original = requestInfoClient.nextId
			requestInfoClient.nextId += 1
			local id = _original
			event:fireClient(player, id, unpack(args))
			return createInvocation(player, id, requestInfo)
		end,
	}
end
function createRequestInfo()
	return {
		nextId = 0,
		requests = {},
	}
end
return {
	createFunctionSender = createFunctionSender,
}
