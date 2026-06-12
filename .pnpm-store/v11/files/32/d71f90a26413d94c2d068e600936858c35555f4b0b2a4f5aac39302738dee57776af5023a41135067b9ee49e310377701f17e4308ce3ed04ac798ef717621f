-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local function createMiddlewareProcessor(middlewareFactories, networkInfo, finalize)
	local middleware = {}
	if not middlewareFactories or #middlewareFactories == 0 then
		middleware[1] = finalize
	else
		for i = #middlewareFactories - 1, 0, -1 do
			local factory = middlewareFactories[i + 1]
			local processNext = middleware[i + 2] or finalize
			middleware[i + 1] = factory(TS.async(function(player, ...)
				local args = { ... }
				return processNext(player, unpack(args))
			end), networkInfo)
		end
	end
	return TS.async(function(player, ...)
		local args = { ... }
		return middleware[1](player, unpack(args))
	end)
end
return {
	createMiddlewareProcessor = createMiddlewareProcessor,
}
