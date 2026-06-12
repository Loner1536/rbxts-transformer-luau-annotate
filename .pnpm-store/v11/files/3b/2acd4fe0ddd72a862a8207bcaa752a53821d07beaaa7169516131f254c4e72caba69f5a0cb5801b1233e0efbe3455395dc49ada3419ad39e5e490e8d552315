-- Compiled with roblox-ts v2.1.0
local TS = _G[script]
-- / <reference types="@rbxts/testez/globals" />
local debounce = TS.import(script, script.Parent, "debounce").debounce
return function()
	it("should debounce a function", function()
		local callCount = 0
		local debounced = debounce(function(value)
			callCount += 1
			return value
		end, 0.03)
		local resultsA = { debounced("a"), debounced("b"), debounced("c") }
		expect(resultsA[1]).to.equal(nil)
		expect(resultsA[2]).to.equal(nil)
		expect(resultsA[3]).to.equal(nil)
		expect(callCount).to.equal(0)
		task.wait(0.05)
		expect(callCount).to.equal(1)
		local resultsB = { debounced("d"), debounced("e"), debounced("f") }
		expect(resultsB[1]).to.equal("c")
		expect(resultsB[2]).to.equal("c")
		expect(resultsB[3]).to.equal("c")
		expect(callCount).to.equal(1)
		task.wait(0.05)
		expect(callCount).to.equal(2)
	end)
	it("subsequent debounced calls return the last `func` result", function()
		local debounced = debounce(function(x)
			return x
		end, 0.03)
		debounced(1)
		task.wait(0.05)
		expect(debounced(2)).to.equal(1)
		task.wait(0.05)
		expect(debounced(3)).to.equal(2)
	end)
	it("should not immediately call `func` when `wait` is `0`", function()
		local callCount = 0
		local debounced = debounce(function()
			local _original = callCount
			callCount += 1
			return _original
		end, 0)
		debounced()
		debounced()
		debounced()
		expect(callCount).to.equal(0)
		task.wait()
		expect(callCount).to.equal(1)
	end)
	it("should apply default options", function()
		local callCount = 0
		local debounced = debounce(function()
			local _original = callCount
			callCount += 1
			return _original
		end, 0.03, {})
		debounced()
		expect(callCount).to.equal(0)
		task.wait(0.05)
		expect(callCount).to.equal(1)
	end)
	it("should support a `leading` option", function()
		local callCounts = { 0, 0 }
		local withLeading = debounce(function()
			local _original = callCounts[1]
			callCounts[1] += 1
			return _original
		end, 0.03, {
			leading = true,
			trailing = false,
		})
		local withLeadingAndTrailing = debounce(function()
			local _original = callCounts[2]
			callCounts[2] += 1
			return _original
		end, 0.03, {
			leading = true,
		})
		withLeading()
		expect(callCounts[1]).to.equal(1)
		withLeadingAndTrailing()
		withLeadingAndTrailing()
		expect(callCounts[2]).to.equal(1)
		task.wait(0.05)
		expect(callCounts[1]).to.equal(1)
		expect(callCounts[2]).to.equal(2)
		withLeading()
		expect(callCounts[1]).to.equal(2)
	end)
	it("subsequent leading debounced calls return the last `func` result", function()
		local debounced = debounce(function(x)
			return x
		end, 0.03, {
			leading = true,
			trailing = false,
		})
		local resultsA = { debounced(1), debounced(2) }
		expect(resultsA[1]).to.equal(1)
		expect(resultsA[2]).to.equal(1)
		task.wait(0.05)
		local resultsB = { debounced(3), debounced(4) }
		expect(resultsB[1]).to.equal(3)
		expect(resultsB[2]).to.equal(3)
	end)
	it("should support a `trailing` option", function()
		local withCount = 0
		local withoutCount = 0
		local withTrailing = debounce(function()
			local _original = withCount
			withCount += 1
			return _original
		end, 0.03, {
			trailing = true,
		})
		local withoutTrailing = debounce(function()
			local _original = withoutCount
			withoutCount += 1
			return _original
		end, 0.03, {
			trailing = false,
		})
		withTrailing()
		expect(withCount).to.equal(0)
		withoutTrailing()
		expect(withoutCount).to.equal(0)
		task.wait(0.05)
		expect(withCount).to.equal(1)
		expect(withoutCount).to.equal(0)
	end)
	it("should support a `maxWait` option", function()
		local callCount = 0
		local debounced = debounce(function()
			local _original = callCount
			callCount += 1
			return _original
		end, 0.03, {
			maxWait = 0.06,
		})
		debounced()
		debounced()
		expect(callCount).to.equal(0)
		task.wait(0.14)
		expect(callCount).to.equal(1)
		debounced()
		debounced()
		expect(callCount).to.equal(1)
		task.wait(0.14)
		expect(callCount).to.equal(2)
	end)
	it("should support `maxWait` in a tight loop", function()
		local limit = 0.2
		local withCount = 0
		local withoutCount = 0
		local withMaxWait = debounce(function()
			local _original = withCount
			withCount += 1
			return _original
		end, 0.03, {
			maxWait = 0.06,
		})
		local withoutMaxWait = debounce(function()
			local _original = withoutCount
			withoutCount += 1
			return _original
		end, 0.03)
		local start = os.clock()
		while os.clock() - start < limit do
			withMaxWait()
			withoutMaxWait()
			task.wait()
		end
		expect(withoutCount).to.equal(0)
		expect(withCount > 1).to.equal(true)
	end)
	it("should queue a trailing call for subsequent debounced calls after `maxWait`", function()
		local callCount = 0
		local debounced = debounce(function()
			local _original = callCount
			callCount += 1
			return _original
		end, 0.03, {
			maxWait = 0.03,
		})
		debounced()
		task.wait(0.03 - 0.01)
		debounced()
		task.wait(0.01)
		debounced()
		task.wait(0.01)
		debounced()
		task.wait(0.05)
		expect(callCount).to.equal(2)
	end)
	it("should cancel `maxDelayed` when `delayed` is invoked", function()
		local callCount = 0
		local debounced = debounce(function()
			local _original = callCount
			callCount += 1
			return _original
		end, 0.03, {
			maxWait = 0.06,
		})
		debounced()
		task.wait(0.13)
		debounced()
		expect(callCount).to.equal(1)
		task.wait(0.05)
		expect(callCount).to.equal(2)
	end)
end
