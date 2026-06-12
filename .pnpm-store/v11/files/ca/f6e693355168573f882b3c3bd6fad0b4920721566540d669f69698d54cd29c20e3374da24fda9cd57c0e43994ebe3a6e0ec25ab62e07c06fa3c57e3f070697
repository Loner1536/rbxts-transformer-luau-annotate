-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local NetworkingFunctionError = TS.import(script, script.Parent.Parent, "function", "errors").NetworkingFunctionError
local timeoutPromise = TS.import(script, script.Parent.Parent, "util", "timeoutPromise").timeoutPromise
local function createServerMethod(config, receiver, sender)
	local method = {
		invoke = function(self, player, ...)
			local args = { ... }
			return self:invokeWithTimeout(player, config.defaultTimeout, unpack(args))
		end,
		invokeWithTimeout = function(self, player, timeout, ...)
			local args = { ... }
			local _sender = sender
			assert(_sender, "This is not a sender remote.")
			return TS.Promise.race({ timeoutPromise(timeout, NetworkingFunctionError.Timeout), sender:invokeClient(player, unpack(args)) })
		end,
		setCallback = function(self, callback)
			local _receiver = receiver
			assert(_receiver, "This is not a receiver remote.")
			receiver:setServerCallback(callback)
		end,
		predict = function(self, player, ...)
			local args = { ... }
			local _receiver = receiver
			assert(_receiver, "This is not a receiver remote.")
			return receiver:invoke(player, unpack(args))
		end,
	}
	setmetatable(method, {
		__call = function(method, player, ...)
			local args = { ... }
			return method:invoke(player, unpack(args))
		end,
	})
	return method
end
return {
	createServerMethod = createServerMethod,
}
