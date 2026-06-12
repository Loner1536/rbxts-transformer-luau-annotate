-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local Players = TS.import(script, TS.getModule(script, "@rbxts", "services")).Players
local function createGuardMiddleware(name, fixedParameters, restParameter, networkInfo, warnOnInvalid, signals, failureValue)
	return function(processNext)
		return function(player, ...)
			local args = { ... }
			do
				local i = 0
				local _shouldIncrement = false
				while true do
					if _shouldIncrement then
						i += 1
					else
						_shouldIncrement = true
					end
					if not (i < math.max(#fixedParameters, #args)) then
						break
					end
					local guard = fixedParameters[i + 1] or restParameter
					if guard and not guard(args[i + 1]) then
						if warnOnInvalid then
							if player then
								warn(`'{player}' sent invalid arguments for event '{name}' (arg #{i}):`, args[i + 1])
							else
								warn(`Server sent invalid arguments for event '{name}' (arg #{i}):`, args[i + 1])
							end
						end
						signals:fire("onBadRequest", player or Players.LocalPlayer, {
							networkInfo = networkInfo,
							argIndex = i,
							argValue = args[i + 1],
						})
						return failureValue
					end
				end
			end
			return processNext(player, unpack(args))
		end
	end
end
return {
	createGuardMiddleware = createGuardMiddleware,
}
