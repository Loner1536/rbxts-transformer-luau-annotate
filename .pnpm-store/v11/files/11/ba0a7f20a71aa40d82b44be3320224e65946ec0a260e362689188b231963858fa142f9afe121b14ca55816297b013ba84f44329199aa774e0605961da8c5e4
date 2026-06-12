-- Compiled with roblox-ts v2.1.0
local TS = _G[script]
-- / <reference types="@rbxts/testez/globals" />
local throttle = TS.import(script, script.Parent, "throttle").throttle
return function()
	it("should throttle a function", function()
		local callCount = 0
		local throttled = throttle(function()
			local _original = callCount
			callCount += 1
			return _original
		end, 0.03)
		throttled()
		throttled()
		throttled()
		local lastCount = callCount
		expect(callCount).to.equal(1)
		task.wait(0.04)
		expect(callCount > lastCount).to.equal(true)
	end)
	it("subsequent calls should return the result of the first call", function()
		local throttled = throttle(function(x)
			return x
		end, 0.03)
		local results = { throttled("a"), throttled("b") }
		expect(results[1]).to.equal("a")
		expect(results[2]).to.equal("a")
		task.wait(0.04)
		local results2 = { throttled("c"), throttled("d") }
		expect(results2[1]).to.equal("c")
		expect(results2[2]).to.equal("c")
	end)
	it("should not trigger a trailing call when invoked once", function()
		local callCount = 0
		local throttled = throttle(function()
			local _original = callCount
			callCount += 1
			return _original
		end, 0.03)
		throttled()
		expect(callCount).to.equal(1)
		task.wait(0.04)
		expect(callCount).to.equal(1)
	end)
	for index = 0, 1 do
		it("should trigger a call when invoked repeatedly" .. (if index == 1 then " and `leading` is `false`" else ""), function()
			local callCount = 0
			local limit = 0.1
			local options = if index == 1 then {
				leading = false,
			} else {}
			local throttled = throttle(function()
				local _original = callCount
				callCount += 1
				return _original
			end, 0.03, options)
			local start = os.clock()
			while os.clock() - start < limit do
				throttled()
				task.wait()
			end
			expect(callCount > 1).to.equal(true)
		end)
	end
	it("should trigger a second throttled call as soon as possible", function()
		local callCount = 0
		local throttled = throttle(function()
			local _original = callCount
			callCount += 1
			return _original
		end, 0.05, {
			leading = false,
		})
		throttled()
		task.wait(0.07)
		expect(callCount).to.equal(1)
		throttled()
		task.wait(0.03)
		expect(callCount).to.equal(1)
		task.wait(0.05)
		expect(callCount).to.equal(2)
	end)
	it("should apply default options", function()
		local callCount = 0
		local throttled = throttle(function()
			local _original = callCount
			callCount += 1
			return _original
		end, 0.03, {})
		throttled()
		throttled()
		expect(callCount).to.equal(1)
		task.wait(0.04)
		expect(callCount).to.equal(2)
	end)
	it("should support a `leading` option", function()
		local withLeading = throttle(function(x)
			return x
		end, 0.03, {
			leading = true,
		})
		expect(withLeading("a")).to.equal("a")
		local withoutLeading = throttle(function(x)
			return x
		end, 0.03, {
			leading = false,
		})
		expect(withoutLeading("a")).to.equal(nil)
	end)
	it("should support a `trailing` option", function()
		local withCount = 0
		local withoutCount = 0
		local withTrailing = throttle(function(value)
			withCount += 1
			return value
		end, 0.03, {
			trailing = true,
		})
		local withoutTrailing = throttle(function(value)
			withoutCount += 1
			return value
		end, 0.03, {
			trailing = false,
		})
		expect(withTrailing("a")).to.equal("a")
		expect(withTrailing("b")).to.equal("a")
		expect(withoutTrailing("a")).to.equal("a")
		expect(withoutTrailing("b")).to.equal("a")
		task.wait(0.04)
		expect(withCount).to.equal(2)
		expect(withoutCount).to.equal(1)
	end)
	it("should not update `lastCalled`, at the end of the timeout, when `trailing` is `false`", function()
		local callCount = 0
		local throttled = throttle(function()
			local _original = callCount
			callCount += 1
			return _original
		end, 0.03, {
			trailing = false,
		})
		throttled()
		throttled()
		task.wait(0.05)
		throttled()
		throttled()
		task.wait(0.1)
		expect(callCount > 1).to.equal(true)
	end)
end
