-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
--/ <reference types="@rbxts/testez/globals" />
local useEffect = TS.import(script, TS.getModule(script, "@rbxts", "react")).useEffect
local renderHook = TS.import(script, script.Parent.Parent, "utils", "testez").renderHook
local useUpdate = TS.import(script, script.Parent, "use-update").useUpdate
return function()
	it("should cause a rerender", function()
		local renders = 0
		renderHook(function()
			local rerender = useUpdate()
			useEffect(function()
				rerender()
			end, {})
			renders += 1
		end)
		expect(renders).to.equal(2)
	end)
	it("should return a new function on each update", function()
		local rerender = function() end
		local previousRerender = function() end
		renderHook(function()
			previousRerender = rerender
			rerender = useUpdate()
		end)
		expect(rerender).never.to.equal(previousRerender)
		rerender()
		expect(rerender).never.to.equal(previousRerender)
	end)
end
