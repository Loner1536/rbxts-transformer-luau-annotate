-- Compiled with roblox-ts v3.0.0
local function createClientMethod(receiver, sender)
	local method = {
		fire = function(self, ...)
			local args = { ... }
			sender:fireServer(unpack(args))
		end,
		connect = function(self, callback)
			return receiver:connectClient(callback)
		end,
		predict = function(self, ...)
			local args = { ... }
			return receiver.invoke(nil, unpack(args))
		end,
	}
	setmetatable(method, {
		__call = function(method, ...)
			local args = { ... }
			method:fire(unpack(args))
		end,
	})
	return method
end
return {
	createClientMethod = createClientMethod,
}
