-- Compiled with roblox-ts v2.1.0
local TS = _G[script]
local setTimeout = TS.import(script, script.Parent, "set-timeout").setTimeout
--[[
	*
	* Creates a debounced function that delays invoking `callback` until after `wait`
	* seconds have elapsed since the last time the debounced function was invoked.
	* The debounced function comes with a `cancel` method to cancel delayed
	* `callback` invocations and a `flush` method to immediately invoke them.
	*
	* Provide `options` to indicate whether `callback` should be invoked on the
	* leading and/or trailing edge of the `wait` timeout. The `callback` is invoked
	* with the last arguments provided to the debounced function. Subsequent calls
	* to the debounced function return the result of the last `callback` invocation.
	*
	* **Note:** If `leading` and `trailing` options are `true`, `callback` is
	* invoked on the trailing edge of the timeout only if the debounced function
	* is invoked more than once during the `wait` timeout.
	*
	* If `wait` is `0` and `leading` is `false`, `callback` invocation is deferred
	* until the next tick, similar to `setTimeout` with a timeout of `0`.
	*
	* See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
	* for details over the differences between `debounce` and `throttle`.
	*
	* @param callback The function to debounce.
	* @param wait The number of seconds to delay. Defaults to `0`.
	* @param options The options object.
	* @returns The new debounced function.
	* @see https://github.com/lodash/lodash/blob/master/debounce.js/
	* @see https://css-tricks.com/debouncing-throttling-explained-examples/
]]
local function debounce(callback, wait, options)
	if wait == nil then
		wait = 0
	end
	if options == nil then
		options = {}
	end
	local _binding = options
	local leading = _binding.leading
	if leading == nil then
		leading = false
	end
	local trailing = _binding.trailing
	if trailing == nil then
		trailing = true
	end
	local maxWait = _binding.maxWait
	local maxing = maxWait ~= nil
	local lastCallTime = 0
	local lastInvokeTime = 0
	local lastArgs
	local result
	local cancelTimeout
	local invoke = function(time)
		local args = lastArgs
		lastArgs = nil
		lastInvokeTime = time
		result = callback(unpack(args))
		return result
	end
	local timerExpired
	local leadingEdge = function(time)
		-- Reset any `maxWait` timer.
		lastInvokeTime = time
		-- Start the timer for the trailing edge.
		cancelTimeout = setTimeout(timerExpired, wait)
		-- Invoke the leading edge.
		return if leading then invoke(time) else result
	end
	local remainingWait = function(time)
		local timeSinceLastCall = time - lastCallTime
		local timeSinceLastInvoke = time - lastInvokeTime
		local timeWaiting = wait - timeSinceLastCall
		return if maxing then math.min(timeWaiting, maxWait - timeSinceLastInvoke) else timeWaiting
	end
	local shouldInvoke = function(time)
		local timeSinceLastCall = time - lastCallTime
		local timeSinceLastInvoke = time - lastInvokeTime
		-- Either this is the first call, activity has stopped and we're at the
		-- trailing edge, the system time has gone backwards and we're treating
		-- it as the trailing edge, or we've hit the `maxWait` limit.
		return lastCallTime == nil or (timeSinceLastCall >= wait or (timeSinceLastCall < 0 or (maxing and timeSinceLastInvoke >= maxWait)))
	end
	local trailingEdge
	timerExpired = function()
		local time = os.clock()
		if shouldInvoke(time) then
			return trailingEdge(time)
		end
		-- Restart the timer.
		cancelTimeout = setTimeout(timerExpired, remainingWait(time))
	end
	trailingEdge = function(time)
		cancelTimeout = nil
		-- Only invoke if we have `lastArgs` which means `invoke` was
		-- debounced at least once.
		if trailing and lastArgs then
			return invoke(time)
		end
		lastArgs = nil
		return result
	end
	local cancel = function()
		local _result = cancelTimeout
		if _result ~= nil then
			_result()
		end
		cancelTimeout = nil
		lastInvokeTime = 0
		lastArgs = nil
		lastCallTime = 0
	end
	local flush = function()
		return if cancelTimeout == nil then result else trailingEdge(os.clock())
	end
	local pending = function()
		return cancelTimeout ~= nil
	end
	local debounced = function(...)
		local args = { ... }
		local time = os.clock()
		local isInvoking = shouldInvoke(time)
		lastArgs = args
		lastCallTime = time
		if isInvoking then
			if cancelTimeout == nil then
				return leadingEdge(lastCallTime)
			end
			if maxing then
				-- Handle invocations in a tight loop.
				cancelTimeout = setTimeout(timerExpired, wait)
				return invoke(lastCallTime)
			end
		end
		if cancelTimeout == nil then
			cancelTimeout = setTimeout(timerExpired, wait)
		end
		return result
	end
	return setmetatable({
		cancel = cancel,
		flush = flush,
		pending = pending,
	}, {
		__call = function(_, ...)
			local args = { ... }
			return debounced(unpack(args))
		end,
	})
end
return {
	debounce = debounce,
}
