-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local Players = TS.import(script, TS.getModule(script, "@rbxts", "services")).Players
local function createServerMethod(receiver, sender)
	local method = {
		fire = function(self, players, ...)
			local args = { ... }
			local _players = players
			if typeof(_players) == "Instance" then
				sender:fireClient(players, unpack(args))
			else
				for _, player in players do
					sender:fireClient(player, unpack(args))
				end
			end
		end,
		broadcast = function(self, ...)
			local args = { ... }
			sender:fireAllClients(unpack(args))
		end,
		except = function(self, players, ...)
			local args = { ... }
			local _players = players
			if typeof(_players) == "Instance" then
				players = { players }
			end
			for _, player in Players:GetPlayers() do
				if not (table.find(players, player) ~= nil) then
					self:fire(player, unpack(args))
				end
			end
		end,
		connect = function(self, callback)
			return receiver:connectServer(callback)
		end,
		predict = function(self, player, ...)
			local args = { ... }
			receiver.invoke(player, unpack(args))
		end,
	}
	setmetatable(method, {
		__call = function(method, player, ...)
			local args = { ... }
			method:fire(player, unpack(args))
		end,
	})
	return method
end
return {
	createServerMethod = createServerMethod,
}
