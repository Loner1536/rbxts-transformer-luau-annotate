-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local useEffect = TS.import(script, TS.getModule(script, "@rbxts", "react")).useEffect
local useLatest = TS.import(script, script.Parent.Parent, "use-latest").useLatest
local connect = function(event, callback)
	local _event = event
	if typeof(_event) == "RBXScriptSignal" then
		-- With deferred events, a "hard disconnect" is necessary to avoid causing
		-- state updates after a component unmounts. Use 'Connected' to check if
		-- the connection is still valid before invoking the callback.
		-- https://devforum.roblox.com/t/deferred-engine-events/2276564/99
		local connection
		connection = event:Connect(function(...)
			local args = { ... }
			if connection.Connected then
				return callback(unpack(args))
			end
		end)
		return connection
	elseif event.Connect ~= nil then
		return event:Connect(callback)
	elseif event.connect ~= nil then
		return event:connect(callback)
	elseif event.subscribe ~= nil then
		return event:subscribe(callback)
	else
		error("Event-like object does not have a supported connect method.")
	end
end
local disconnect = function(connection)
	local _connection = connection
	if type(_connection) == "function" then
		connection()
	else
		local _connection_1 = connection
		local _condition = typeof(_connection_1) == "RBXScriptConnection"
		if not _condition then
			_condition = connection.Disconnect ~= nil
		end
		if _condition then
			connection:Disconnect()
		elseif connection.disconnect ~= nil then
			connection:disconnect()
		else
			error("Connection-like object does not have a supported disconnect method.")
		end
	end
end
--[[
	*
	 * Subscribes to an event-like object. The subscription is automatically
	 * disconnected when the component unmounts.
	 *
	 * If the event or listener is `undefined`, the event will not be subscribed to,
	 * and the subscription will be disconnected if it was previously connected.
	 *
	 * The listener is memoized, so it is safe to pass a callback that is recreated
	 * on every render.
	 *
	 * @param event The event-like object to subscribe to.
	 * @param listener The listener to subscribe with.
	 * @param options Options for the subscription.
	 
]]
local function useEventListener(event, listener, options)
	if options == nil then
		options = {}
	end
	local _binding = options
	local once = _binding.once
	if once == nil then
		once = false
	end
	local connected = _binding.connected
	if connected == nil then
		connected = true
	end
	local listenerRef = useLatest(listener)
	useEffect(function()
		if not event or not listener or not connected then
			return nil
		end
		local canDisconnect = true
		local connection
		connection = connect(event, function(...)
			local args = { ... }
			if once then
				disconnect(connection)
				canDisconnect = false
			end
			local _result = listenerRef.current
			if _result ~= nil then
				_result(unpack(args))
			end
		end)
		return function()
			if canDisconnect then
				disconnect(connection)
			end
		end
	end, { event, connected, listener ~= nil })
end
return {
	useEventListener = useEventListener,
}
