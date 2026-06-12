-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local Signal = TS.import(script, TS.getModule(script, "@rbxts", "signal"))
local function createSignalContainer()
	local signals = {}
	return {
		fire = function(self, name, ...)
			local args = { ... }
			local _name = name
			local signal = signals[_name]
			if signal then
				signal:Fire(unpack(args))
			end
		end,
		connect = function(self, name, callback)
			local _name = name
			local signal = signals[_name]
			if not signal then
				local _exp = name
				signal = Signal.new()
				local _signal = signal
				signals[_exp] = _signal
			end
			return signal:Connect(callback)
		end,
	}
end
return {
	createSignalContainer = createSignalContainer,
}
