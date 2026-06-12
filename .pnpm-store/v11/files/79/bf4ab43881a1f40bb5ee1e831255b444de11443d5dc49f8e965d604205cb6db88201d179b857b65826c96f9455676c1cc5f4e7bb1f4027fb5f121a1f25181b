-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local useState = TS.import(script, TS.getModule(script, "@rbxts", "react")).useState
local useEventListener = TS.import(script, script.Parent.Parent, "use-event-listener").useEventListener
local CollectionService = TS.import(script, TS.getModule(script, "@rbxts", "services")).CollectionService
--[[
	*
	 * Wrapper around `CollectionService` that provides a list of `Instance` under the given `tag`.
	 *
	 * This list is updated as `Instance` are added and removed. You can also cast the `Instance` to the expected type.
	 *
	 * ```ts
	 * const zombies = useTagged<ZombieModel>("zombie");
	 * ```
	 *
	 * @param tag The `CollectionService` tag name to filter against.
	 * @returns A stateful list of `Instance` matching the provided `tag`.
	 * @template T An optional subtype of `Instance` to cast the tagged children to.
	 
]]
local function useTagged(tag)
	local instances, setInstances = useState(function()
		return CollectionService:GetTagged(tag)
	end)
	useEventListener(CollectionService:GetInstanceAddedSignal(tag), function(instance)
		setInstances(function(instances)
			local nextInstances = table.clone(instances)
			local _instance = instance
			table.insert(nextInstances, _instance)
			return nextInstances
		end)
	end)
	useEventListener(CollectionService:GetInstanceRemovedSignal(tag), function(instance)
		setInstances(function(instances)
			local nextInstances = table.clone(instances)
			local _instance = instance
			local index = (table.find(nextInstances, _instance) or 0) - 1
			table.remove(nextInstances, index + 1)
			return nextInstances
		end)
	end)
	return instances
end
return {
	useTagged = useTagged,
}
