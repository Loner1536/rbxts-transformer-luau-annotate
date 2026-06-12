-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local ReplicatedStorage = _services.ReplicatedStorage
local RunService = _services.RunService
local function findByAttribute(parent, id)
	for _, child in parent:GetChildren() do
		if child:GetAttribute("id") == id then
			return child
		end
	end
end
local function waitByAttribute(parent, id)
	local instance = findByAttribute(parent, id)
	local watcherThread = task.delay(5, function()
		warn(`Flamework is waiting on '{id}' for`, parent)
	end)
	if not instance then
		local thread = coroutine.running()
		local connection
		connection = parent.ChildAdded:Connect(function(instance)
			if instance:GetAttribute("id") == id then
				connection:Disconnect()
				task.spawn(thread, instance)
			end
		end)
		instance = (coroutine.yield())
	end
	task.cancel(watcherThread)
	return instance
end
local function createRemoteInstance(remoteType, namespace, debugName, id)
	if not RunService:IsRunning() then
		return Instance.new(remoteType)
	end
	local namespaceFolder = if RunService:IsServer() then findByAttribute(ReplicatedStorage, namespace) else waitByAttribute(ReplicatedStorage, namespace)
	if not namespaceFolder then
		namespaceFolder = Instance.new("Folder")
		namespaceFolder.Name = namespace
		namespaceFolder:SetAttribute("id", namespace)
		namespaceFolder.Parent = ReplicatedStorage
	end
	local existingInstance = if RunService:IsServer() then findByAttribute(namespaceFolder, id) else waitByAttribute(namespaceFolder, id)
	if not existingInstance then
		existingInstance = Instance.new(remoteType)
		existingInstance.Name = debugName
		existingInstance:SetAttribute("id", id)
		existingInstance.Parent = namespaceFolder
	end
	local _arg0 = existingInstance:IsA(remoteType)
	assert(_arg0)
	return existingInstance
end
return {
	createRemoteInstance = createRemoteInstance,
}
