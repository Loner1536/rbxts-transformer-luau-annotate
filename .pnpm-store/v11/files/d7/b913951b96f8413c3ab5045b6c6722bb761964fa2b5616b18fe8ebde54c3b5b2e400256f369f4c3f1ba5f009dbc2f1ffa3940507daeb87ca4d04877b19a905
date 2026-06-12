-- Compiled with roblox-ts v3.0.0
--[[
	*
	 * Creates a new config with the namespace's middleware at the top level.
	 
]]
local function getNamespaceConfig(config, namespaceId)
	local _object = table.clone(config)
	setmetatable(_object, nil)
	_object.middleware = config.middleware[namespaceId] or {}
	return _object
end
return {
	getNamespaceConfig = getNamespaceConfig,
}
