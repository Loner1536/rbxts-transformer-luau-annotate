-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local NetworkingFunctionError = TS.import(script, script.Parent.Parent, "function", "errors").NetworkingFunctionError
local timeoutPromise = TS.import(script, script.Parent.Parent, "util", "timeoutPromise").timeoutPromise
local function createClientMethod(config, receiver, sender)
	local method = {
		invoke = function(self, ...)
			local args = { ... }
			return self:invokeWithTimeout(config.defaultTimeout, unpack(args))
		end,
		invokeWithTimeout = function(self, timeout, ...)
			local args = { ... }
			local _sender = sender
			assert(_sender, "This is not a sender remote.")
			return TS.Promise.race({ timeoutPromise(timeout, NetworkingFunctionError.Timeout), sender:invokeServer(unpack(args)) })
		end,
		setCallback = function(self, callback)
			local _receiver = receiver
			assert(_receiver, "This is not a receiver remote.")
			receiver:setClientCallback(callback)
		end,
		predict = function(self, ...)
			local args = { ... }
			local _receiver = receiver
			assert(_receiver, "This is not a receiver remote.")
			return receiver:invoke(nil, unpack(args))
		end,
	}
	setmetatable(method, {
		__call = function(method, ...)
			local args = { ... }
			return method:invoke(unpack(args))
		end,
	})
	return method
end
return {
	createClientMethod = createClientMethod,
}
