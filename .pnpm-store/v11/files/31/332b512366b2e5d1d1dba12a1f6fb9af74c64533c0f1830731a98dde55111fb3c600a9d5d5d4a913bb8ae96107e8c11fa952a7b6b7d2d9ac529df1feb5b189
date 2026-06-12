-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
--/ <reference types="@rbxts/testez/globals" />
local createBinding = TS.import(script, TS.getModule(script, "@rbxts", "react")).createBinding
local renderHook = TS.import(script, script.Parent.Parent, "utils", "testez").renderHook
local useBindingListener = TS.import(script, script.Parent, "use-binding-listener").useBindingListener
return function()
	it("should call listener on mount", function()
		local binding = createBinding(0)
		local result
		renderHook(function(_param)
			local listener = _param.listener
			return useBindingListener(binding, listener)
		end, {
			initialProps = {
				listener = function(value)
					result = value
					return result
				end,
			},
		})
		expect(result).to.equal(0)
	end)
	it("should call listener when the binding updates", function()
		local binding, setBinding = createBinding(0)
		local result
		local _binding = renderHook(function(_param)
			local listener = _param.listener
			return useBindingListener(binding, listener)
		end, {
			initialProps = {
				listener = function(value)
					result = value
					return result
				end,
			},
		})
		local rerender = _binding.rerender
		expect(result).to.equal(0)
		setBinding(1)
		rerender()
		expect(result).to.equal(1)
	end)
	it("should not call listener after unrelated rerender", function()
		local binding = createBinding(0)
		local _binding = renderHook(function(_param)
			local listener = _param.listener
			return useBindingListener(binding, listener)
		end, {
			initialProps = {
				listener = function() end,
			},
		})
		local rerender = _binding.rerender
		rerender({
			listener = function()
				error("listener was called when the binding did not update")
			end,
		})
		rerender()
	end)
	it("should not call listener if the listener changes", function()
		local binding = createBinding(0)
		local _binding = renderHook(function(_param)
			local listener = _param.listener
			return useBindingListener(binding, listener)
		end, {
			initialProps = {
				listener = function() end,
			},
		})
		local rerender = _binding.rerender
		rerender({
			listener = function()
				error("listener was called when the listener changed")
			end,
		})
		rerender()
	end)
	it("should call listener if the passed binding changes", function()
		local bindingA = createBinding(0)
		local bindingB = createBinding(1)
		local result
		local _binding = renderHook(function(_param)
			local binding = _param.binding
			return useBindingListener(binding, function(value)
				result = value
				return result
			end)
		end, {
			initialProps = {
				binding = bindingA,
			},
		})
		local rerender = _binding.rerender
		expect(result).to.equal(0)
		rerender({
			binding = bindingB,
		})
		expect(result).to.equal(1)
	end)
	it("should call listener if passed value changes", function()
		local result
		local _binding = renderHook(function(_param)
			local value = _param.value
			return useBindingListener(value, function(value)
				result = value
				return result
			end)
		end, {
			initialProps = {
				value = 0,
			},
		})
		local rerender = _binding.rerender
		expect(result).to.equal(0)
		rerender({
			value = 1,
		})
		expect(result).to.equal(1)
	end)
end
