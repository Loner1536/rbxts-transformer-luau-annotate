-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _react = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useEffect = _react.useEffect
local useMemo = _react.useMemo
local useState = _react.useState
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local ContextActionService = _services.ContextActionService
local HttpService = _services.HttpService
local UserInputService = _services.UserInputService
local useEventListener = TS.import(script, script.Parent.Parent, "use-event-listener").useEventListener
--[[
	*
	 * A single key code name.
	 
]]
--[[
	*
	 * A single key code or a combination of key codes.
	 
]]
--[[
	*
	 * Returns whether the passed key or shortcut is pressed. The hook expects one
	 * or more key code, which can be:
	 *
	 * - A single key code `"W"`
	 * - A combination of key codes `"W+Space"`
	 * - An array of key codes `["W", "Space"]`
	 *
	 * Each combination is treated as its own shortcut. If passed more than one
	 * combination, the hook will return `true` if any of the combinations are
	 * pressed.
	 *
	 * @param keyCodeCombos The key code or combination of key codes to listen for.
	 * @returns Whether the key or combination of keys is pressed.
	 
]]
local function useKeyPress(keyCodeCombos, _param)
	if _param == nil then
		_param = {}
	end
	local bindAction = _param.bindAction
	if bindAction == nil then
		bindAction = false
	end
	local actionPriority = _param.actionPriority
	if actionPriority == nil then
		actionPriority = Enum.ContextActionPriority.High.Value
	end
	local actionName = _param.actionName
	if actionName == nil then
		actionName = if bindAction then HttpService:GenerateGUID(false) else ""
	end
	local actionInputTypes = _param.actionInputTypes
	if actionInputTypes == nil then
		actionInputTypes = { Enum.UserInputType.Keyboard, Enum.UserInputType.Gamepad1 }
	end
	local pressed, setPressed = useState(false)
	local keyCombos = useMemo(function()
		-- ▼ ReadonlyArray.map ▼
		local _newValue = table.create(#keyCodeCombos)
		local _callback = function(keyCodes)
			local _keyCodes = keyCodes
			if type(_keyCodes) == "string" then
				return string.split(keyCodes, "+")
			else
				return keyCodes
			end
		end
		for _k, _v in keyCodeCombos do
			_newValue[_k] = _callback(_v, _k - 1, keyCodeCombos)
		end
		-- ▲ ReadonlyArray.map ▲
		return _newValue
	end, keyCodeCombos)
	local keySet = useMemo(function()
		local keySet = {}
		for _, keys in keyCombos do
			for _1, key in keys do
				keySet[key] = true
			end
		end
		return keySet
	end, keyCombos)
	local keysDown = useMemo(function()
		return {}
	end, keyCodeCombos)
	local updatePressed = function()
		-- ▼ ReadonlyArray.some ▼
		local _result = false
		local _callback = function(keys)
			-- ▼ ReadonlyArray.every ▼
			local _result_1 = true
			local _callback_1 = function(key)
				local _key = key
				return keysDown[_key] ~= nil
			end
			for _k, _v in keys do
				if not _callback_1(_v, _k - 1, keys) then
					_result_1 = false
					break
				end
			end
			-- ▲ ReadonlyArray.every ▲
			return _result_1
		end
		for _k, _v in keyCombos do
			if _callback(_v, _k - 1, keyCombos) then
				_result = true
				break
			end
		end
		-- ▲ ReadonlyArray.some ▲
		setPressed(_result)
	end
	useEventListener(UserInputService.InputBegan, function(input, gameProcessed)
		local _condition = not gameProcessed
		if _condition then
			local _name = input.KeyCode.Name
			_condition = keySet[_name] ~= nil
		end
		if _condition then
			local _name = input.KeyCode.Name
			keysDown[_name] = true
			updatePressed()
		end
	end)
	useEventListener(UserInputService.InputEnded, function(input)
		local _name = input.KeyCode.Name
		if keySet[_name] ~= nil then
			local _name_1 = input.KeyCode.Name
			keysDown[_name_1] = nil
			updatePressed()
		end
	end)
	useEffect(function()
		-- Prevents the game from processing the key
		if not bindAction then
			return nil
		end
		ContextActionService:BindActionAtPriority(actionName, function(_, state, input)
			local _name = input.KeyCode.Name
			local valid = keySet[_name] ~= nil
			if not valid then
				return Enum.ContextActionResult.Pass
			end
			if state == Enum.UserInputState.Begin then
				local _name_1 = input.KeyCode.Name
				keysDown[_name_1] = true
			elseif state == Enum.UserInputState.End then
				local _name_1 = input.KeyCode.Name
				keysDown[_name_1] = nil
			end
			updatePressed()
			return Enum.ContextActionResult.Sink
		end, false, actionPriority, unpack(actionInputTypes))
		return function()
			ContextActionService:UnbindAction(actionName)
		end
	end, { bindAction, actionName, actionPriority })
	return pressed
end
return {
	useKeyPress = useKeyPress,
}
