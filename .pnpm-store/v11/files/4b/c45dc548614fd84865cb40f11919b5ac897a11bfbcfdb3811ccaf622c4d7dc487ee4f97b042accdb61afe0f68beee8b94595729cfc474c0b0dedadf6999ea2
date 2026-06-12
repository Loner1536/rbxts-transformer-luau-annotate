-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local createGuardMiddleware = TS.import(script, script.Parent.Parent, "middleware", "createGuardMiddleware").createGuardMiddleware
local createEvent = TS.import(script, script.Parent.Parent, "event", "createEvent").createEvent
local getNamespaceConfig = TS.import(script, script.Parent.Parent, "util", "getNamespaceConfig").getNamespaceConfig
local function createGenericHandler(globalName, namespaceName, metadata, config, signals, method)
	local handler = {}
	local _set = {}
	for _, _v in metadata.incomingIds do
		_set[_v] = true
	end
	local receiverNameSet = _set
	local _set_1 = {}
	for _, _v in metadata.outgoingIds do
		_set_1[_v] = true
	end
	local senderNameSet = _set_1
	local _set_2 = {}
	local _array = {}
	local _length = #_array
	local _array_1 = metadata.incomingIds
	local _Length = #_array_1
	table.move(_array_1, 1, _Length, _length + 1, _array)
	_length += _Length
	local _array_2 = metadata.outgoingIds
	table.move(_array_2, 1, #_array_2, _length + 1, _array)
	for _, _v in _array do
		_set_2[_v] = true
	end
	for name in _set_2 do
		local isIncoming = receiverNameSet[name] ~= nil
		local isOutgoing = senderNameSet[name] ~= nil
		-- If there is no incoming/outgoing event, use the same reliability as the other.
		local incomingChannel = if isIncoming then metadata.incomingUnreliable else metadata.outgoingUnreliable
		local outgoingChannel = if isOutgoing then metadata.outgoingUnreliable else metadata.incomingUnreliable
		local isIncomingUnreliable = incomingChannel[name] == true
		local isOutgoingUnreliable = outgoingChannel[name] == true
		local configMiddleware = config.middleware[name]
		local incomingMiddleware = if configMiddleware ~= nil then table.clone(configMiddleware) else {}
		local effectiveName = if namespaceName ~= nil then `{namespaceName}/{name}` else name
		local networkInfo = {
			eventType = "Event",
			name = effectiveName,
			globalName = globalName,
		}
		if not config.disableIncomingGuards and isIncoming then
			local guards = metadata.incoming[name]
			assert(guards)
			local _arg0 = createGuardMiddleware(name, guards[1], guards[2], networkInfo, config.warnOnInvalidGuards, signals)
			table.insert(incomingMiddleware, 1, _arg0)
		end
		local create = function(unreliable)
			return createEvent({
				reliability = if unreliable then "unreliable" else "reliable",
				namespace = globalName,
				id = if unreliable then `unreliable:{effectiveName}` else effectiveName,
				debugName = name,
				networkInfo = networkInfo,
				incomingMiddleware = incomingMiddleware,
			})
		end
		local receiver = create(isIncomingUnreliable)
		local sender = if isOutgoingUnreliable == isIncomingUnreliable then receiver else create(isOutgoingUnreliable)
		handler[name] = method(receiver, sender)
	end
	for _, namespaceId in metadata.namespaceIds do
		local namespace = metadata.namespaces[namespaceId]
		handler[namespaceId] = createGenericHandler(globalName, if namespaceName ~= nil then `{namespaceName}/{namespaceId}` else namespaceId, namespace, getNamespaceConfig(config, namespaceId), signals, method)
	end
	return handler
end
return {
	createGenericHandler = createGenericHandler,
}
