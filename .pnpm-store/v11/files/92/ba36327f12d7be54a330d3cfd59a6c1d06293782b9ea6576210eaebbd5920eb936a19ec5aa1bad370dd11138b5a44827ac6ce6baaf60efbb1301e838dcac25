-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local RunService = TS.import(script, TS.getModule(script, "@rbxts", "services")).RunService
local createEvent = TS.import(script, script.Parent.Parent, "event", "createEvent").createEvent
local NetworkingFunctionError = TS.import(script, script.Parent, "errors").NetworkingFunctionError
local createMiddlewareProcessor = TS.import(script, script.Parent.Parent, "middleware", "createMiddlewareProcessor").createMiddlewareProcessor
local _skip = TS.import(script, script.Parent.Parent, "middleware", "skip")
local Skip = _skip.Skip
local SkipBadRequest = _skip.SkipBadRequest
local getProcessResult
local function createFunctionReceiver(options)
	local event = createEvent({
		namespace = options.namespace,
		debugName = options.debugName,
		id = options.id,
		networkInfo = options.networkInfo,
	})
	local callback
	local setCallback = function(newCallback)
		callback = createMiddlewareProcessor(options.incomingMiddleware, options.networkInfo, function(player, ...)
			local args = { ... }
			if RunService:IsServer() then
				return newCallback(player, unpack(args))
			else
				return newCallback(unpack(args))
			end
		end)
	end
	local processRequest = function(player, id, ...)
		local args = { ... }
		if not callback then
			return event:fireEither(player, id, NetworkingFunctionError.Unprocessed)
		end
		callback(player, unpack(args)):andThen(function(value)
			return event:fireEither(player, id, getProcessResult(value), value)
		end):catch(function(reason)
			warn(`Failed to process request to '{options.debugName}'`)
			warn(reason)
			event:fireEither(player, id, false)
		end)
	end
	if RunService:IsServer() then
		event:connectServer(function(player, id, ...)
			local args = { ... }
			return processRequest(player, id, unpack(args))
		end)
	else
		event:connectClient(function(id, ...)
			local args = { ... }
			return processRequest(nil, id, unpack(args))
		end)
	end
	return {
		setServerCallback = function(self, callback)
			setCallback(callback)
		end,
		setClientCallback = function(self, callback)
			setCallback(callback)
		end,
		invoke = function(self, player, ...)
			local args = { ... }
			if not callback then
				return TS.Promise.reject(NetworkingFunctionError.Unprocessed)
			end
			return callback(player, unpack(args)):andThen(function(value)
				local processResult = getProcessResult(value)
				return if processResult == true then value else TS.Promise.reject(processResult)
			end)
		end,
	}
end
function getProcessResult(value)
	return if value == Skip then NetworkingFunctionError.Cancelled elseif value == SkipBadRequest then NetworkingFunctionError.BadRequest else true
end
return {
	createFunctionReceiver = createFunctionReceiver,
}
