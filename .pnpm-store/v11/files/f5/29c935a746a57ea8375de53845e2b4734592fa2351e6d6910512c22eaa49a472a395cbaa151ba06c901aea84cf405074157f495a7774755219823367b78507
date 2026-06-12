-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _core = TS.import(script, TS.getModule(script, "@flamework", "core").out)
local Controller = _core.Controller
local Flamework = _core.Flamework
local Modding = _core.Modding
local Reflect = _core.Reflect
local Service = _core.Service
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local CollectionService = _services.CollectionService
local ReplicatedStorage = _services.ReplicatedStorage
local RunService = _services.RunService
local ServerStorage = _services.ServerStorage
local StarterGui = _services.StarterGui
local StarterPack = _services.StarterPack
local StarterPlayer = _services.StarterPlayer
local _baseComponent = TS.import(script, script.Parent, "baseComponent")
local BaseComponent = _baseComponent.BaseComponent
local SYMBOL_ATTRIBUTE_HANDLERS = _baseComponent.SYMBOL_ATTRIBUTE_HANDLERS
local ComponentTracker = TS.import(script, script.Parent, "componentTracker").ComponentTracker
local _utility = TS.import(script, script.Parent, "utility")
local getComponentFromSpecifier = _utility.getComponentFromSpecifier
local getIdFromSpecifier = _utility.getIdFromSpecifier
local getParentConstructor = _utility.getParentConstructor
local isConstructor = _utility.isConstructor
local safeCall = _utility.safeCall
local Maid = TS.import(script, TS.getModule(script, "@rbxts", "maid").Maid)
local Signal = TS.import(script, TS.getModule(script, "@rbxts", "signal"))
--[[
	*
	 * This enum dictates how component instance guards interact with StreamingEnabled.
	 
]]
local ComponentStreamingMode
do
	local _inverse = {}
	ComponentStreamingMode = setmetatable({}, {
		__index = _inverse,
	})
	ComponentStreamingMode.Disabled = 0
	_inverse[0] = "Disabled"
	ComponentStreamingMode.Watching = 1
	_inverse[1] = "Watching"
	ComponentStreamingMode.Contextual = 2
	_inverse[2] = "Contextual"
	ComponentStreamingMode.Default = 2
	_inverse[2] = "Default"
end
local DEFAULT_ANCESTOR_BLACKLIST = { ServerStorage, ReplicatedStorage, StarterPack, StarterGui, StarterPlayer }
--[[
	*
	 * Register a class as a Component.
	 *
	 * @metadata flamework:implements flamework:parameters injectable intrinsic-component-decorator
	 
]]
local Component = Modding.createMetaDecorator("Class")
--[[
	*
	 * This class is responsible for loading and managing
	 * all components in the game.
	 
]]
local Components
do
	Components = setmetatable({}, {
		__tostring = function()
			return "Components"
		end,
	})
	Components.__index = Components
	function Components.new(...)
		local self = setmetatable({}, Components)
		return self:constructor(...) or self
	end
	function Components:constructor()
		self.components = {}
		self.classParentCache = {}
		self.activeComponents = {}
		self.activeInheritedComponents = {}
		self.reverseComponentsMapping = {}
		self.componentConstructing = {}
		self.trackers = {}
		self.componentWaiters = {}
		self.componentCleanup = {}
		self.componentAddedListeners = {}
		self.componentRemovedListeners = {}
	end
	function Components:onInit()
		local components = {}
		local componentConstructors = Modding.getDecorators("$c:components@Component")
		for _, _binding in componentConstructors do
			local ctor = _binding.constructor
			local args = _binding.arguments
			if ctor == nil then
				continue
			end
			local identifier = Reflect.getMetadata(ctor, "identifier")
			local componentDependencies = {}
			local parameters = Reflect.getMetadata(ctor, "flamework:parameters")
			if parameters then
				for _1, dependency in parameters do
					local object = Modding.getObjectFromId(dependency)
					if not object or not isConstructor(object) then
						continue
					end
					if not Modding.getDecorator(object, nil, "$c:components@Component") then
						continue
					end
					table.insert(componentDependencies, object)
				end
			end
			local _arg1 = {
				ctor = ctor,
				config = args[1] or {},
				polymorphicIds = self:getPolymorphicIds(ctor),
				componentDependencies = componentDependencies,
				identifier = identifier,
			}
			components[ctor] = _arg1
		end
		self.components = components
	end
	function Components:onStart()
		for _, _binding in self.components do
			local config = _binding.config
			local ctor = _binding.ctor
			local ancestorBlacklist = config.ancestorBlacklist or DEFAULT_ANCESTOR_BLACKLIST
			local ancestorWhitelist = config.ancestorWhitelist
			if config.tag ~= nil then
				local tracker = self:getComponentTracker(ctor)
				local predicate = self:getConfigValue(ctor, "predicate")
				local listener = function(isQualified, instance)
					if isQualified then
						self:addComponent(instance, ctor, true)
					else
						self:removeComponent(instance, ctor)
					end
				end
				local instanceAdded = function(instance)
					if predicate ~= nil and not predicate(instance) then
						return nil
					end
					local _isWhitelisted = ancestorWhitelist
					if _isWhitelisted ~= nil then
						-- ▼ ReadonlyArray.some ▼
						local _result = false
						local _callback = function(ancestor)
							return instance:IsDescendantOf(ancestor)
						end
						for _k, _v in _isWhitelisted do
							if _callback(_v, _k - 1, _isWhitelisted) then
								_result = true
								break
							end
						end
						-- ▲ ReadonlyArray.some ▲
						_isWhitelisted = _result
					end
					local isWhitelisted = _isWhitelisted
					if isWhitelisted == false then
						return nil
					end
					-- ▼ ReadonlyArray.some ▼
					local _result = false
					local _callback = function(ancestor)
						return instance:IsDescendantOf(ancestor)
					end
					for _k, _v in ancestorBlacklist do
						if _callback(_v, _k - 1, ancestorBlacklist) then
							_result = true
							break
						end
					end
					-- ▲ ReadonlyArray.some ▲
					local isBlacklisted = _result
					if isBlacklisted and isWhitelisted == nil then
						return nil
					end
					tracker:trackInstance(instance, listener)
					tracker:setHasTag(instance, true)
				end
				CollectionService:GetInstanceAddedSignal(config.tag):Connect(instanceAdded)
				CollectionService:GetInstanceRemovedSignal(config.tag):Connect(function(instance)
					tracker:untrackInstance(instance, listener)
					tracker:setHasTag(instance, false)
					self:removeComponent(instance, ctor)
				end)
				for _1, instance in CollectionService:GetTagged(config.tag) do
					safeCall({ `[Flamework] Failed to instantiate '{ctor}' for`, instance, `[{instance:GetFullName()}]` }, function()
						return instanceAdded(instance)
					end, false)
				end
			end
		end
	end
	function Components:getComponentTracker(component)
		local _trackers = self.trackers
		local _component = component
		local existingTracker = _trackers[_component]
		if existingTracker then
			return existingTracker
		end
		local _components = self.components
		local _component_1 = component
		local componentInfo = _components[_component_1]
		assert(componentInfo, "Provided component does not exist")
		local instanceGuard = self:getConfigValue(component, "instanceGuard")
		local dependencies = {}
		for _, dependency in componentInfo.componentDependencies do
			local _arg0 = self:getComponentTracker(dependency)
			table.insert(dependencies, _arg0)
		end
		local _condition = componentInfo.config.streamingMode
		if _condition == nil then
			_condition = ComponentStreamingMode.Default
		end
		local streamingMode = _condition
		local tracker = ComponentTracker.new(componentInfo.identifier, {
			tag = componentInfo.config.tag,
			typeGuard = instanceGuard,
			typeGuardPoll = (streamingMode == ComponentStreamingMode.Contextual and RunService:IsClient()) or streamingMode == ComponentStreamingMode.Watching,
			typeGuardPollAtomic = streamingMode ~= ComponentStreamingMode.Contextual,
			warningTimeout = componentInfo.config.warningTimeout,
			dependencies = dependencies,
		})
		local _trackers_1 = self.trackers
		local _component_2 = component
		_trackers_1[_component_2] = tracker
		return tracker
	end
	function Components:getOrderedParents(ctor, omitBaseComponent)
		if omitBaseComponent == nil then
			omitBaseComponent = true
		end
		local _classParentCache = self.classParentCache
		local _ctor = ctor
		local cache = _classParentCache[_ctor]
		if cache then
			return cache
		end
		local classes = { ctor }
		local nextParent = ctor
		while true do
			nextParent = getParentConstructor(nextParent)
			if not (nextParent ~= nil) then
				break
			end
			if not omitBaseComponent or nextParent ~= BaseComponent then
				local _nextParent = nextParent
				table.insert(classes, _nextParent)
			end
		end
		local _classParentCache_1 = self.classParentCache
		local _ctor_1 = ctor
		_classParentCache_1[_ctor_1] = classes
		return classes
	end
	function Components:getAttributeGuards(ctor)
		local attributes = {}
		local _components = self.components
		local _ctor = ctor
		local metadata = _components[_ctor]
		if metadata then
			if metadata.config.attributes ~= nil then
				for attribute, guard in pairs(metadata.config.attributes) do
					attributes[attribute] = guard
				end
			end
			local parentCtor = getmetatable(ctor)
			if parentCtor.__index ~= nil then
				for attribute, guard in self:getAttributeGuards(parentCtor.__index) do
					if not (attributes[attribute] ~= nil) then
						attributes[attribute] = guard
					end
				end
			end
		end
		return attributes
	end
	function Components:getAttributes(instance, componentInfo, guards)
		local attributes = instance:GetAttributes()
		local newAttributes = {}
		local defaults = self:getConfigValue(componentInfo.ctor, "defaults")
		for key, guard in pairs(guards) do
			local attribute = attributes[key]
			if not guard(attribute) then
				local _result = defaults
				if _result ~= nil then
					_result = _result[key]
				end
				if _result ~= nil then
					local _arg1 = defaults[key]
					newAttributes[key] = _arg1
					instance:SetAttribute(key, defaults[key])
				else
					error(`{instance:GetFullName()} has invalid attribute '{key}' for '{componentInfo.identifier}'`)
				end
			else
				newAttributes[key] = attribute
			end
		end
		return newAttributes
	end
	function Components:getConfigValue(ctor, key)
		local _components = self.components
		local _ctor = ctor
		local metadata = _components[_ctor]
		if metadata then
			if metadata.config[key] ~= nil then
				return metadata.config[key]
			end
			local parentCtor = getmetatable(ctor)
			if parentCtor.__index ~= nil then
				return self:getConfigValue(parentCtor.__index, key)
			end
		end
	end
	function Components:setupComponent(instance, attributes, component, construct, _param)
		local ctor = _param.ctor
		BaseComponent:setInstance(component, instance, attributes)
		construct()
		if Flamework._implements(component, "$:flamework@OnStart") then
			safeCall({ `[Flamework] Component '{ctor}' failed to start for`, instance, `[{instance:GetFullName()}]` }, function()
				return component:onStart()
			end)
		end
		Modding.addListener(component)
		local maid = Maid.new()
		local _componentCleanup = self.componentCleanup
		local _component = component
		_componentCleanup[_component] = maid
		maid:GiveTask(function()
			return Modding.removeListener(component)
		end)
		local refreshAttributes = self:getConfigValue(ctor, "refreshAttributes")
		if refreshAttributes == nil or refreshAttributes then
			local attributeCache = table.clone(attributes)
			local attributeGuards = self:getAttributeGuards(ctor)
			for attribute, guard in pairs(attributeGuards) do
				if type(attribute) == "string" then
					maid:GiveTask(instance:GetAttributeChangedSignal(attribute):Connect(function()
						local signal = component[SYMBOL_ATTRIBUTE_HANDLERS][attribute]
						local value = instance:GetAttribute(attribute)
						local attributes = component.attributes
						if guard(value) then
							attributes[attribute] = value
							local _result = signal
							if _result ~= nil then
								_result:Fire(value, attributeCache[attribute])
							end
							attributeCache[attribute] = value
						end
					end))
				end
			end
		end
		local _componentWaiters = self.componentWaiters
		local _instance = instance
		local instanceWaiters = _componentWaiters[_instance]
		local _componentWaiters_1 = instanceWaiters
		if _componentWaiters_1 ~= nil then
			_componentWaiters_1 = _componentWaiters_1[ctor]
		end
		local componentWaiters = _componentWaiters_1
		if componentWaiters then
			instanceWaiters[ctor] = nil
			-- ▼ ReadonlyMap.size ▼
			local _size = 0
			for _ in instanceWaiters do
				_size += 1
			end
			-- ▲ ReadonlyMap.size ▲
			if _size == 0 then
				local _componentWaiters_2 = self.componentWaiters
				local _instance_1 = instance
				_componentWaiters_2[_instance_1] = nil
			end
			for waiter in componentWaiters do
				waiter(component)
			end
		end
	end
	function Components:addIdMapping(value, id, inheritedComponents)
		local _inheritedComponents = inheritedComponents
		local _id = id
		local instances = _inheritedComponents[_id]
		if not instances then
			local _inheritedComponents_1 = inheritedComponents
			local _exp = id
			instances = {}
			local _instances = instances
			_inheritedComponents_1[_exp] = _instances
		end
		local _reverseComponentsMapping = self.reverseComponentsMapping
		local _id_1 = id
		local inheritedLookup = _reverseComponentsMapping[_id_1]
		if not inheritedLookup then
			local _reverseComponentsMapping_1 = self.reverseComponentsMapping
			local _exp = id
			inheritedLookup = {}
			local _inheritedLookup = inheritedLookup
			_reverseComponentsMapping_1[_exp] = _inheritedLookup
		end
		local _instances = instances
		local _value = value
		_instances[_value] = true
		local _inheritedLookup = inheritedLookup
		local _value_1 = value
		_inheritedLookup[_value_1] = true
	end
	function Components:removeIdMapping(instance, value, id)
		local _activeInheritedComponents = self.activeInheritedComponents
		local _instance = instance
		local inheritedComponents = _activeInheritedComponents[_instance]
		if not inheritedComponents then
			return nil
		end
		local _id = id
		local instances = inheritedComponents[_id]
		if not instances then
			return nil
		end
		local _reverseComponentsMapping = self.reverseComponentsMapping
		local _id_1 = id
		local inheritedLookup = _reverseComponentsMapping[_id_1]
		if not inheritedLookup then
			return nil
		end
		local _value = value
		instances[_value] = nil
		local _value_1 = value
		inheritedLookup[_value_1] = nil
		-- ▼ ReadonlySet.size ▼
		local _size = 0
		for _ in inheritedLookup do
			_size += 1
		end
		-- ▲ ReadonlySet.size ▲
		if _size == 0 then
			local _reverseComponentsMapping_1 = self.reverseComponentsMapping
			local _id_2 = id
			_reverseComponentsMapping_1[_id_2] = nil
		end
		-- ▼ ReadonlySet.size ▼
		local _size_1 = 0
		for _ in instances do
			_size_1 += 1
		end
		-- ▲ ReadonlySet.size ▲
		if _size_1 == 0 then
			local _id_2 = id
			inheritedComponents[_id_2] = nil
		end
		-- ▼ ReadonlyMap.size ▼
		local _size_2 = 0
		for _ in inheritedComponents do
			_size_2 += 1
		end
		-- ▲ ReadonlyMap.size ▲
		if _size_2 == 0 then
			local _activeInheritedComponents_1 = self.activeInheritedComponents
			local _instance_1 = instance
			_activeInheritedComponents_1[_instance_1] = nil
		end
	end
	function Components:canCreateComponentEager(instance, component)
		local _components = self.components
		local _component = component
		local componentInfo = _components[_component]
		if not componentInfo then
			return false
		end
		if componentInfo.config.predicate and not componentInfo.config.predicate(instance) then
			return false
		end
		local tag = componentInfo.config.tag
		if tag ~= nil and instance.Parent and CollectionService:HasTag(instance, tag) then
			local tracker = self:getComponentTracker(component)
			return tracker:checkInstance(instance)
		end
	end
	function Components:getDependencyResolutionOptions(componentInfo, instance)
		if #componentInfo.componentDependencies == 0 then
			return nil
		end
		return {
			handle = function(id)
				local ctor = Modding.getObjectFromId(id)
				if ctor and isConstructor(ctor) and Modding.getDecorator(ctor, nil, "$c:components@Component") then
					local component = self:getComponent(instance, ctor)
					if component == nil then
						local name = instance:GetFullName()
						error(`Could not resolve component '{id}' while constructing '{componentInfo.identifier}' ({name})`)
					end
					return component
				end
			end,
		}
	end
	function Components:getPolymorphicIds(component)
		local ids = {}
		for _, parentClass in self:getOrderedParents(component) do
			local parentId = Reflect.getOwnMetadata(parentClass, "identifier")
			if parentId == nil then
				continue
			end
			table.insert(ids, parentId)
		end
		local implementedList = Reflect.getMetadatas(component, "flamework:implements")
		for _, implemented in implementedList do
			for _1, id in implemented do
				table.insert(ids, id)
			end
		end
		return ids
	end
	function Components:getComponent(instance, componentSpecifier)
		local component = getComponentFromSpecifier(componentSpecifier)
		local _arg1 = `Could not find component from specifier: {componentSpecifier}`
		assert(component, _arg1)
		local _activeComponents = self.activeComponents
		local _instance = instance
		local activeComponents = _activeComponents[_instance]
		if activeComponents then
			local activeComponent = activeComponents[component]
			if activeComponent then
				-- The component is still being constructed.
				if self.componentConstructing[activeComponent] ~= nil then
					return nil
				end
				return activeComponent
			end
		end
		if self:canCreateComponentEager(instance, component) then
			return self:addComponent(instance, component, true)
		end
	end
	function Components:getComponents(instance, componentSpecifier)
		local componentIdentifier = getIdFromSpecifier(componentSpecifier)
		if componentIdentifier == nil then
			return {}
		end
		local _activeInheritedComponents = self.activeInheritedComponents
		local _instance = instance
		local activeComponents = _activeInheritedComponents[_instance]
		if not activeComponents then
			return {}
		end
		local componentsSet = activeComponents[componentIdentifier]
		if not componentsSet then
			return {}
		end
		local _array = {}
		local _length = #_array
		for _v in componentsSet do
			_length += 1
			_array[_length] = _v
		end
		return _array
	end
	function Components:addComponent(instance, componentSpecifier, skipInstanceCheck)
		local component = getComponentFromSpecifier(componentSpecifier)
		local _arg1 = `Could not find component from specifier: {componentSpecifier}`
		assert(component, _arg1)
		local componentInfo = self.components[component]
		assert(componentInfo, "Provided componentSpecifier does not exist")
		local attributeGuards = self:getAttributeGuards(component)
		local attributes = self:getAttributes(instance, componentInfo, attributeGuards)
		if skipInstanceCheck ~= true then
			local instanceGuard = self:getConfigValue(component, "instanceGuard")
			if instanceGuard ~= nil then
				local _arg0 = instanceGuard(instance)
				local _arg1_1 = `{instance:GetFullName()} did not pass instance guard check for '{componentInfo.identifier}'`
				assert(_arg0, _arg1_1)
			end
		end
		local _activeComponents = self.activeComponents
		local _instance = instance
		local activeComponents = _activeComponents[_instance]
		if not activeComponents then
			local _activeComponents_1 = self.activeComponents
			local _exp = instance
			activeComponents = {}
			local _activeComponents_2 = activeComponents
			_activeComponents_1[_exp] = _activeComponents_2
		end
		local _activeInheritedComponents = self.activeInheritedComponents
		local _instance_1 = instance
		local inheritedComponents = _activeInheritedComponents[_instance_1]
		if not inheritedComponents then
			local _activeInheritedComponents_1 = self.activeInheritedComponents
			local _exp = instance
			inheritedComponents = {}
			local _inheritedComponents = inheritedComponents
			_activeInheritedComponents_1[_exp] = _inheritedComponents
		end
		local existingComponent = activeComponents[component]
		if existingComponent ~= nil then
			-- The component has already been added, but is still being constructed.
			if self.componentConstructing[existingComponent] ~= nil then
				error("component is cyclic, attempted to construct component while it is already being constructed.")
			end
			return existingComponent
		end
		local resolutionOptions = self:getDependencyResolutionOptions(componentInfo, instance)
		local _binding = Modding.createDeferredDependency(component, resolutionOptions)
		local componentInstance = _binding[1]
		local construct = _binding[2]
		self.componentConstructing[componentInstance] = true
		activeComponents[component] = componentInstance
		self:setupComponent(instance, attributes, componentInstance, construct, componentInfo)
		self.componentConstructing[componentInstance] = nil
		for _, id in componentInfo.polymorphicIds do
			self:addIdMapping(componentInstance, id, inheritedComponents)
			local signal = self.componentAddedListeners[id]
			if signal then
				signal:Fire(componentInstance, instance)
			end
		end
		return componentInstance
	end
	function Components:removeComponent(instance, componentSpecifier)
		local component = getComponentFromSpecifier(componentSpecifier)
		local _arg1 = `Could not find component from specifier: {componentSpecifier}`
		assert(component, _arg1)
		local componentInfo = self.components[component]
		assert(componentInfo, "Provided componentSpecifier does not exist")
		local _activeComponents = self.activeComponents
		local _instance = instance
		local activeComponents = _activeComponents[_instance]
		if not activeComponents then
			return nil
		end
		local existingComponent = activeComponents[component]
		if not existingComponent then
			return nil
		end
		for _, id in componentInfo.polymorphicIds do
			local signal = self.componentRemovedListeners[id]
			if signal then
				signal:Fire(existingComponent, instance)
			end
		end
		existingComponent:destroy()
		activeComponents[component] = nil
		for _, id in componentInfo.polymorphicIds do
			self:removeIdMapping(instance, existingComponent, id)
		end
		-- ▼ ReadonlyMap.size ▼
		local _size = 0
		for _ in activeComponents do
			_size += 1
		end
		-- ▲ ReadonlyMap.size ▲
		if _size == 0 then
			local _activeComponents_1 = self.activeComponents
			local _instance_1 = instance
			_activeComponents_1[_instance_1] = nil
		end
		local maid = self.componentCleanup[existingComponent]
		self.componentCleanup[existingComponent] = nil
		if maid ~= nil then
			maid:Destroy()
		end
	end
	function Components:getAllComponents(componentSpecifier)
		local componentIdentifier = getIdFromSpecifier(componentSpecifier)
		if componentIdentifier == nil then
			return {}
		end
		local reverseMapping = self.reverseComponentsMapping[componentIdentifier]
		if not reverseMapping then
			return {}
		end
		local _array = {}
		local _length = #_array
		for _v in reverseMapping do
			_length += 1
			_array[_length] = _v
		end
		return _array
	end
	function Components:waitForComponent(instance, componentSpecifier)
		local component = getComponentFromSpecifier(componentSpecifier)
		local _arg1 = `Could not find component from specifier: {componentSpecifier}`
		assert(component, _arg1)
		return TS.Promise.new(function(resolve, _, onCancel)
			local existingComponent = self:getComponent(instance, componentSpecifier)
			if existingComponent ~= nil then
				return resolve(existingComponent)
			end
			local _componentWaiters = self.componentWaiters
			local _instance = instance
			local instanceWaiters = _componentWaiters[_instance]
			if not instanceWaiters then
				local _componentWaiters_1 = self.componentWaiters
				local _exp = instance
				instanceWaiters = {}
				local _instanceWaiters = instanceWaiters
				_componentWaiters_1[_exp] = _instanceWaiters
			end
			local componentWaiters = instanceWaiters[component]
			if not componentWaiters then
				local _instanceWaiters = instanceWaiters
				componentWaiters = {}
				local _componentWaiters_1 = componentWaiters
				_instanceWaiters[component] = _componentWaiters_1
			end
			onCancel(function()
				local _componentWaiters_1 = componentWaiters
				local _resolve = resolve
				_componentWaiters_1[_resolve] = nil
				-- ▼ ReadonlySet.size ▼
				local _size = 0
				for _1 in componentWaiters do
					_size += 1
				end
				-- ▲ ReadonlySet.size ▲
				if _size == 0 then
					instanceWaiters[component] = nil
				end
				-- ▼ ReadonlyMap.size ▼
				local _size_1 = 0
				for _1 in instanceWaiters do
					_size_1 += 1
				end
				-- ▲ ReadonlyMap.size ▲
				if _size_1 == 0 then
					local _componentWaiters_2 = self.componentWaiters
					local _instance_1 = instance
					_componentWaiters_2[_instance_1] = nil
				end
			end)
			local _componentWaiters_1 = componentWaiters
			local _resolve = resolve
			_componentWaiters_1[_resolve] = true
		end)
	end
	function Components:onComponentAdded(callback, componentSpecifier)
		local componentId = getIdFromSpecifier(componentSpecifier)
		local _arg0 = componentId ~= nil
		assert(_arg0)
		local signal = self.componentAddedListeners[componentId]
		if not signal then
			local _componentAddedListeners = self.componentAddedListeners
			signal = Signal.new()
			local _signal = signal
			_componentAddedListeners[componentId] = _signal
		end
		return signal:Connect(callback)
	end
	function Components:onComponentRemoved(callback, componentSpecifier)
		local componentId = getIdFromSpecifier(componentSpecifier)
		local _arg0 = componentId ~= nil
		assert(_arg0)
		local signal = self.componentRemovedListeners[componentId]
		if not signal then
			local _componentRemovedListeners = self.componentRemovedListeners
			signal = Signal.new()
			local _signal = signal
			_componentRemovedListeners[componentId] = _signal
		end
		return signal:Connect(callback)
	end
	do
		-- (Flamework) Components metadata
		Reflect.defineMetadata(Components, "identifier", "$c:components@Components")
		Reflect.defineMetadata(Components, "flamework:implements", { "$:flamework@OnInit", "$:flamework@OnStart" })
	end
end
-- (Flamework) Components decorators
Reflect.decorate(Components, "$:flamework@Controller", Controller, { {
	loadOrder = 0,
} })
Reflect.decorate(Components, "$:flamework@Service", Service, { {
	loadOrder = 0,
} })
return {
	ComponentStreamingMode = ComponentStreamingMode,
	Component = Component,
	Components = Components,
}
