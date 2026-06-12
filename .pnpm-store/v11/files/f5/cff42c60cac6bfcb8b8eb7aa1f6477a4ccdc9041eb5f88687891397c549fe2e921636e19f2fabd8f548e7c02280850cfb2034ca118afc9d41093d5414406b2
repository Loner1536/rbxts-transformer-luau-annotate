local safeFlags = {
	ReactCatchYieldingInDEV = true,
	ReactCleanQueueOnUpdateBailout = true,
	ReactDevtoolsUseHttpWebStream = true,
	ReactEnableSchedulingProfiler = true,
	ReactFilterInternalStackFrames = true,
	ReactInlineMergeLanes = true,
	ReactInstanceMapDisableErrorChecking = true,
	ReactIsolatedGlobalsEnabled = true,
	ReactIsProtectedTypeOf = true,
	ReactPreventAssigningKeyToChildren = true,
	ReactSchedulerEnableDeferredWork = nil,
	ReactSchedulerLookbackUseRingBuffer = nil,
	ReactSchedulerSetFrameMarkerOnHeartbeatEnd = nil,
	ReactSchedulerSetTargetMsByHeartbeatDelta = nil,
	ReactTelemetryEnabled = nil,
}

local safeInts = {
	ReactSchedulerDesiredFrameRate = nil,
	ReactSchedulerMinFrameRate = nil,
	ReactSchedulerNumberOfLookbackFrames = nil,
	ReactSchedulerYieldInterval2 = nil,
}

local function createGetFFlag(name: string): () -> boolean
	return function()
		return safeFlags[name] or false
	end
end

local function createGetFInt(name: string, default: number): () -> number
	return function()
		return safeInts[name] or default
	end
end

return {
	createGetFFlag = createGetFFlag,
	createGetFInt = createGetFInt,
}
