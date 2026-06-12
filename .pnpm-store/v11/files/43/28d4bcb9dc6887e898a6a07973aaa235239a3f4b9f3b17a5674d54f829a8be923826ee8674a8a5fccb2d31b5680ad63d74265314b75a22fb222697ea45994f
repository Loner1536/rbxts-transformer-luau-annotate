-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
--/ <reference types="@rbxts/testez/globals" />
local renderHook = TS.import(script, script.Parent.Parent, "utils", "testez").renderHook
local usePrevious = TS.import(script, script.Parent, "use-previous").usePrevious
return function()
	it("should return undefined on the first render", function()
		local _binding = renderHook(function()
			return usePrevious(0)
		end)
		local result = _binding.result
		expect(result.current).to.equal(nil)
	end)
	it("should return the previous value on rerender", function()
		local _binding = renderHook(function(_param)
			local state = _param.state
			return usePrevious(state)
		end, {
			initialProps = {
				state = 0,
			},
		})
		local result = _binding.result
		local rerender = _binding.rerender
		expect(result.current).to.equal(nil)
		rerender({
			state = 1,
		})
		expect(result.current).to.equal(0)
		rerender({
			state = 2,
		})
		expect(result.current).to.equal(1)
		rerender({
			state = 3,
		})
		expect(result.current).to.equal(2)
	end)
	it("should return the correct value despite being undefined", function()
		local _binding = renderHook(function(_param)
			local state = _param.state
			return usePrevious(state)
		end, {
			initialProps = {
				state = nil,
			},
		})
		local result = _binding.result
		local rerender = _binding.rerender
		expect(result.current).to.equal(nil)
		rerender({
			state = nil,
		})
		expect(result.current).to.equal(nil)
		rerender({
			state = 0,
		})
		expect(result.current).to.equal(nil)
		rerender({
			state = nil,
		})
		expect(result.current).to.equal(0)
	end)
	it("should not return passed value after unrelated rerender", function()
		local _binding = renderHook(function(_param)
			local state = _param.state
			return usePrevious(state)
		end, {
			initialProps = {
				state = 0,
			},
		})
		local result = _binding.result
		local rerender = _binding.rerender
		expect(result.current).to.equal(nil)
		rerender()
		expect(result.current).never.to.equal(0)
		expect(result.current).to.equal(nil)
	end)
	it("should receive a function that determines whether the value should be updated", function()
		local value0 = {
			value = 0,
		}
		local value1 = {
			value = 1,
		}
		local value2 = {
			value = 2,
		}
		local _binding = renderHook(function(_param)
			local state = _param.state
			return usePrevious(state, function(a, b)
				local _result = a
				if _result ~= nil then
					_result = _result.value
				end
				return _result == b.value
			end)
		end, {
			initialProps = {
				state = value0,
			},
		})
		local result = _binding.result
		local rerender = _binding.rerender
		expect(result.current).to.equal(nil)
		local _object = {}
		local _left = "state"
		local _object_1 = table.clone(value0)
		setmetatable(_object_1, nil)
		_object[_left] = _object_1
		rerender(_object)
		expect(result.current).to.equal(nil)
		rerender({
			state = value1,
		})
		expect(result.current).to.equal(value0)
		rerender({
			state = value2,
		})
		expect(result.current).to.equal(value1)
		rerender({
			state = value1,
		})
		expect(result.current).to.equal(value2)
	end)
end
