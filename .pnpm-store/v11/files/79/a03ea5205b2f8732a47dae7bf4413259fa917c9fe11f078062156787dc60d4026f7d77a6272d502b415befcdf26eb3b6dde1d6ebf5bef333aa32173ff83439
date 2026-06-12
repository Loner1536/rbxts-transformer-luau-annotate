-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local NetworkingFunctionError = TS.import(script, script.Parent.Parent, "function", "errors").NetworkingFunctionError
local SkipBadRequest = TS.import(script, script.Parent.Parent, "middleware", "skip").SkipBadRequest
local createFunctionReceiver = TS.import(script, script.Parent.Parent, "function", "createFunctionReceiver").createFunctionReceiver
local createFunctionSender = TS.import(script, script.Parent.Parent, "function", "createFunctionSender").createFunctionSender
local createGuardMiddleware = TS.import(script, script.Parent.Parent, "middleware", "createGuardMiddleware").createGuardMiddleware
local Players = TS.import(script, TS.getModule(script, "@rbxts", "services")).Players
local getNamespaceConfig = TS.import(script, script.Parent.Parent, "util", "getNamespaceConfig").getNamespaceConfig
local function createGenericHandler(globalName, namespaceName, receiverPrefix, senderPrefix, metadata, config, signals, createMethod)
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
		local configMiddleware = config.middleware[name]
		local incomingMiddleware = if configMiddleware ~= nil then table.clone(configMiddleware) else {}
		local isReceiver = receiverNameSet[name] ~= nil
		local isSender = senderNameSet[name] ~= nil
		local effectiveName = if namespaceName ~= nil then `{namespaceName}/{name}` else name
		local networkInfo = {
			eventType = "Function",
			name = effectiveName,
			globalName = globalName,
		}
		if not config.disableIncomingGuards and isReceiver then
			local guards = metadata.incoming[name]
			assert(guards)
			local _arg0 = createGuardMiddleware(name, guards[1], guards[2], networkInfo, config.warnOnInvalidGuards, signals, SkipBadRequest)
			table.insert(incomingMiddleware, 1, _arg0)
		end
		local receiver = if isReceiver then createFunctionReceiver({
			namespace = globalName,
			debugName = name,
			id = if isSender then `{receiverPrefix}{effectiveName}` else effectiveName,
			networkInfo = networkInfo,
			incomingMiddleware = incomingMiddleware,
		}) else nil
		local sender = if isSender then createFunctionSender({
			namespace = globalName,
			debugName = name,
			id = if isReceiver then `{senderPrefix}{effectiveName}` else effectiveName,
			networkInfo = networkInfo,
			responseMiddleware = if config.disableIncomingGuards then nil else function(player, value, resolve, reject)
				local returnGuard = metadata.outgoing[name]
				if returnGuard and not returnGuard(value) then
					reject(NetworkingFunctionError.InvalidResult)
					signals:fire("onBadResponse", player or Players.LocalPlayer, {
						networkInfo = networkInfo,
						value = value,
					})
				else
					resolve(value)
				end
			end,
		}) else nil
		handler[name] = createMethod(config, receiver, sender)
	end
	for _, namespaceId in metadata.namespaceIds do
		local namespace = metadata.namespaces[namespaceId]
		handler[namespaceId] = createGenericHandler(globalName, if namespaceName ~= nil then `{namespaceName}/{namespaceId}` else namespaceId, receiverPrefix, senderPrefix, namespace, getNamespaceConfig(config, namespaceId), signals, createMethod)
	end
	return handler
end
return {
	createGenericHandler = createGenericHandler,
}
