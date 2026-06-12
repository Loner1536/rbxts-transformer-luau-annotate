-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _react = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local React = _react
local useRef = _react.useRef
local _react_roblox = TS.import(script, TS.getModule(script, "@rbxts", "react-roblox"))
local act = _react_roblox.act
local createLegacyRoot = _react_roblox.createLegacyRoot
--[[
	*
	 * Allows you to render a hook within a test React component without having to
	 * create that component yourself.
	 * @see https://github.com/testing-library/react-testing-library
	 
]]
local function renderHook(render, options)
	if options == nil then
		options = {}
	end
	local result = {
		current = nil,
	}
	local function TestComponent(_param)
		local initialProps = _param.initialProps
		local previousProps = useRef(initialProps)
		local _fn = render
		local _condition = initialProps
		if _condition == nil then
			_condition = previousProps.current
			if _condition == nil then
				_condition = ({})
			end
		end
		local pendingResult = _fn(_condition)
		previousProps.current = initialProps
		result.current = pendingResult
		return nil
	end
	local root = createLegacyRoot(options.container or Instance.new("Folder"))
	act(function()
		root:render(React.createElement(TestComponent, {
			initialProps = options.initialProps,
		}))
	end)
	local rerender = function(props)
		act(function()
			root:render(React.createElement(TestComponent, {
				initialProps = props,
			}))
		end)
	end
	local unmount = function()
		act(function()
			return root:unmount()
		end)
	end
	return {
		rerender = rerender,
		result = result,
		unmount = unmount,
	}
end
return {
	renderHook = renderHook,
}
