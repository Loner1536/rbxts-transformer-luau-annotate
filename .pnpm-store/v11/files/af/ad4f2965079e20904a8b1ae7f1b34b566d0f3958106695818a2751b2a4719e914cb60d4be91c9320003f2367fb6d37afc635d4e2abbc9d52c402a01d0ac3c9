-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
--/ <reference types="@rbxts/testez/globals" />
local shallowEqual = TS.import(script, script.Parent.Parent, "utils", "shallow-equal").shallowEqual
local renderHook = TS.import(script, script.Parent.Parent, "utils", "testez").renderHook
local useComposedRef = TS.import(script, script.Parent, "use-composed-ref").useComposedRef
return function()
	it("should call all refs passed in", function()
		local results = {}
		local _binding = renderHook(function()
			local ref = useComposedRef(function(value)
				if value == nil then
					value = ""
				end
				results[1] = value
				return results[1]
			end, function(value)
				if value == nil then
					value = ""
				end
				results[2] = value
				return results[2]
			end, function(value)
				if value == nil then
					value = ""
				end
				results[3] = value
				return results[3]
			end)
			return ref
		end)
		local rerender = _binding.rerender
		local result = _binding.result
		expect(shallowEqual(results, {})).to.equal(true)
		rerender()
		expect(shallowEqual(results, {})).to.equal(true)
		result.current("foo")
		expect(shallowEqual(results, { "foo", "foo", "foo" })).to.equal(true)
	end)
	it("should skip refs that are undefined", function()
		local results = {}
		local _binding = renderHook(function()
			return useComposedRef(function(value)
				results[1] = value
				return results[1]
			end, nil, function(value)
				results[2] = value
				return results[2]
			end, nil, function(value)
				results[3] = value
				return results[3]
			end)
		end)
		local rerender = _binding.rerender
		local result = _binding.result
		expect(shallowEqual(results, {})).to.equal(true)
		rerender()
		expect(shallowEqual(results, {})).to.equal(true)
		result.current("foo")
		expect(shallowEqual(results, { "foo", "foo", "foo" })).to.equal(true)
	end)
	it("should call the latest refs", function()
		local calls = {
			a = 0,
			b = 0,
		}
		local _binding = renderHook(function(refs)
			return useComposedRef(unpack(refs))
		end, {
			initialProps = {},
		})
		local rerender = _binding.rerender
		local result = _binding.result
		rerender({ function(key)
			if key == nil then
				key = "a"
			end
			local _original = calls[key]
			calls[key] += 1
			return _original
		end, function(key)
			if key == nil then
				key = "a"
			end
			local _original = calls[key]
			calls[key] += 1
			return _original
		end })
		result.current("a")
		expect(calls.a).to.equal(2)
		expect(calls.b).to.equal(0)
		rerender({ function(key)
			if key == nil then
				key = "b"
			end
			local _original = calls[key]
			calls[key] += 1
			return _original
		end, function(key)
			if key == nil then
				key = "b"
			end
			local _original = calls[key]
			calls[key] += 1
			return _original
		end })
		result.current("b")
		expect(calls.a).to.equal(2)
		expect(calls.b).to.equal(2)
	end)
end
