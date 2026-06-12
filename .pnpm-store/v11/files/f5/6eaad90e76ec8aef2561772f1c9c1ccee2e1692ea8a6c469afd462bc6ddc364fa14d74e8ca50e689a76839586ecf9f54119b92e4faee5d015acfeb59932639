-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
--/ <reference types="@rbxts/testez/globals" />
local createBinding = TS.import(script, TS.getModule(script, "@rbxts", "react")).createBinding
local renderHook = TS.import(script, script.Parent.Parent, "utils", "testez").renderHook
local useBindingState = TS.import(script, script.Parent, "use-binding-state").useBindingState
return function()
	it("should return the current value", function()
		local binding = createBinding(0)
		local _binding = renderHook(function()
			return useBindingState(binding)
		end)
		local result = _binding.result
		expect(result.current).to.equal(0)
	end)
	it("should update the value when the binding updates", function()
		local binding, setBinding = createBinding(0)
		local _binding = renderHook(function()
			return useBindingState(binding)
		end)
		local result = _binding.result
		expect(result.current).to.equal(0)
		setBinding(1)
		expect(result.current).to.equal(1)
	end)
	it("should not update the value after unrelated rerender", function()
		local binding = createBinding(0)
		local _binding = renderHook(function()
			return useBindingState(binding)
		end)
		local result = _binding.result
		local rerender = _binding.rerender
		expect(result.current).to.equal(0)
		rerender()
		expect(result.current).to.equal(0)
	end)
	it("should update the value if the binding changes", function()
		local binding = createBinding(0)
		local _binding = renderHook(function(_param)
			local binding = _param.binding
			return useBindingState(binding)
		end, {
			initialProps = {
				binding = binding,
			},
		})
		local result = _binding.result
		local rerender = _binding.rerender
		expect(result.current).to.equal(0)
		rerender({
			binding = (createBinding(1)),
		})
		expect(result.current).to.equal(1)
	end)
end
