-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local NetworkingSkip = TS.import(script, script, "middleware", "skip").Skip
local NetworkingFunctionError = TS.import(script, script, "function", "errors").NetworkingFunctionError
local createNetworkingEvent = TS.import(script, script, "events", "createNetworkingEvent").createNetworkingEvent
local createNetworkingFunction = TS.import(script, script, "functions", "createNetworkingFunction").createNetworkingFunction
local Networking = {}
do
	local _container = Networking
	--[[
		*
		     * Creates a new event based off the supplied types.
		     * @param serverMiddleware Middleware for server events
		     * @param clientMiddleware Middleware for client events
		     * @metadata macro
		     
	]]
	local function createEvent(name)
		return createNetworkingEvent(name)
	end
	_container.createEvent = createEvent
	--[[
		*
		     * Creates a new function event based off the supplied types.
		     * @param serverMiddleware Middleware for server events
		     * @param clientMiddleware Middleware for client events
		     * @metadata macro
		     
	]]
	local function createFunction(name)
		return createNetworkingFunction(name)
	end
	_container.createFunction = createFunction
	--[[
		*
		     * Stops networking function middleware.
		     
	]]
	local Skip = NetworkingSkip
	_container.Skip = Skip
	--[[
		*
		     * Specifies that this event is unreliable.
		     *
		     * This will only work on remote events.
		     
	]]
	--[[
		*
		     * A function that generates an event middleware.
		     
	]]
	--[[
		*
		     * A function that generates an event middleware.
		     
	]]
end
return {
	Networking = Networking,
	NetworkingFunctionError = NetworkingFunctionError,
}
