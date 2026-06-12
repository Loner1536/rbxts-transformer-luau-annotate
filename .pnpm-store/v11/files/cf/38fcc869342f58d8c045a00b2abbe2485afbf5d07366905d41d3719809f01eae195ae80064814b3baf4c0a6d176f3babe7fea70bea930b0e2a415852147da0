-- Compiled with roblox-ts v3.0.0
local Skip = {
	__index = function()
		return nil
	end,
	__newindex = function()
		return nil
	end,
	__tostring = function()
		return `Networking.Skip`
	end,
}
setmetatable(Skip, Skip)
-- This is a special skip type used to instruct Flamework to reject with a value of "BadRequest"
-- This does affect equality, though, so it can only be returned from the very first middleware
-- to avoid other middleware from being able to inspect it.
local SkipBadRequest = {}
setmetatable(SkipBadRequest, Skip)
return {
	Skip = Skip,
	SkipBadRequest = SkipBadRequest,
}
