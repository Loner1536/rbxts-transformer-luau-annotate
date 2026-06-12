-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
--/ <reference types="@rbxts/testez/globals" />
local renderHook = TS.import(script, script.Parent.Parent, "utils", "testez").renderHook
local useEventListener = TS.import(script, script.Parent, "use-event-listener").useEventListener
local function createSignal()
	local listeners = {}
	return {
		listeners = function(self)
			return listeners
		end,
		connect = function(self, listener)
			local _listener = listener
			listeners[_listener] = true
			return function()
				local _listener_1 = listener
				-- ▼ Set.delete ▼
				local _valueExisted = listeners[_listener_1] ~= nil
				listeners[_listener_1] = nil
				-- ▲ Set.delete ▲
				return _valueExisted
			end
		end,
		fire = function(self, ...)
			local args = { ... }
			for listener in listeners do
				listener(unpack(args))
			end
		end,
	}
end
return function()
	it("should connect on mount", function()
		local signal = createSignal()
		local _binding = renderHook(function()
			return useEventListener(signal, function() end)
		end)
		local unmount = _binding.unmount
		-- ▼ ReadonlySet.size ▼
		local _size = 0
		for _ in signal:listeners() do
			_size += 1
		end
		-- ▲ ReadonlySet.size ▲
		expect(_size).to.equal(1)
		unmount()
	end)
	it("should disconnect on unmount", function()
		local signal = createSignal()
		local _binding = renderHook(function()
			return useEventListener(signal, function() end)
		end)
		local unmount = _binding.unmount
		unmount()
		-- ▼ ReadonlySet.size ▼
		local _size = 0
		for _ in signal:listeners() do
			_size += 1
		end
		-- ▲ ReadonlySet.size ▲
		expect(_size).to.equal(0)
	end)
	it("should clean up old connections", function()
		local signalA = createSignal()
		local signalB = createSignal()
		local _binding = renderHook(function(_param)
			local signal = _param.signal
			return useEventListener(signal, function() end)
		end, {
			initialProps = {
				signal = signalA,
			},
		})
		local rerender = _binding.rerender
		local unmount = _binding.unmount
		rerender({
			signal = signalB,
		})
		-- ▼ ReadonlySet.size ▼
		local _size = 0
		for _ in signalA:listeners() do
			_size += 1
		end
		-- ▲ ReadonlySet.size ▲
		expect(_size).to.equal(0)
		-- ▼ ReadonlySet.size ▼
		local _size_1 = 0
		for _ in signalB:listeners() do
			_size_1 += 1
		end
		-- ▲ ReadonlySet.size ▲
		expect(_size_1).to.equal(1)
		rerender({
			signal = signalA,
		})
		-- ▼ ReadonlySet.size ▼
		local _size_2 = 0
		for _ in signalA:listeners() do
			_size_2 += 1
		end
		-- ▲ ReadonlySet.size ▲
		expect(_size_2).to.equal(1)
		-- ▼ ReadonlySet.size ▼
		local _size_3 = 0
		for _ in signalB:listeners() do
			_size_3 += 1
		end
		-- ▲ ReadonlySet.size ▲
		expect(_size_3).to.equal(0)
		unmount()
		-- ▼ ReadonlySet.size ▼
		local _size_4 = 0
		for _ in signalA:listeners() do
			_size_4 += 1
		end
		-- ▲ ReadonlySet.size ▲
		expect(_size_4).to.equal(0)
		-- ▼ ReadonlySet.size ▼
		local _size_5 = 0
		for _ in signalB:listeners() do
			_size_5 += 1
		end
		-- ▲ ReadonlySet.size ▲
		expect(_size_5).to.equal(0)
	end)
	it("should call listener on event", function()
		local signal = createSignal()
		local result
		local _binding = renderHook(function()
			return useEventListener(signal, function(value)
				result = value
				return result
			end)
		end)
		local unmount = _binding.unmount
		signal:fire(0)
		expect(result).to.equal(0)
		signal:fire(1)
		expect(result).to.equal(1)
		unmount()
	end)
	it("should receive a 'once' option", function()
		local signal = createSignal()
		local calls = 0
		local _binding = renderHook(function()
			return useEventListener(signal, function()
				local _original = calls
				calls += 1
				return _original
			end, {
				once = true,
			})
		end)
		local rerender = _binding.rerender
		local unmount = _binding.unmount
		signal:fire()
		rerender()
		signal:fire()
		rerender()
		signal:fire()
		expect(calls).to.equal(1)
		unmount()
	end)
	it("should receive a 'connected' option", function()
		local signal = createSignal()
		local calls = 0
		local _binding = renderHook(function(_param)
			local connected = _param.connected
			return useEventListener(signal, function()
				local _original = calls
				calls += 1
				return _original
			end, {
				connected = connected,
			})
		end, {
			initialProps = {
				connected = true,
			},
		})
		local rerender = _binding.rerender
		local unmount = _binding.unmount
		signal:fire()
		rerender({
			connected = false,
		})
		signal:fire()
		rerender({
			connected = true,
		})
		signal:fire()
		expect(calls).to.equal(2)
		unmount()
	end)
end
