-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
--/ <reference types="@rbxts/testez/globals" />
local renderHook = TS.import(script, script.Parent.Parent, "utils", "testez").renderHook
local useKeyPress = TS.import(script, script.Parent, "use-key-press").useKeyPress
return function()
	it("should return a boolean", function()
		local _binding = renderHook(function()
			return useKeyPress({ "W", "B" })
		end)
		local result = _binding.result
		local unmount = _binding.unmount
		expect(result.current).to.be.a("boolean")
		expect(result.current).to.equal(false)
		unmount()
	end)
	-- itFOCUS("should return true when pressed", () => {
	-- 	let value = false;
	-- 	const { result, unmount } = renderHook(() => {
	-- 		value = useKeyPress(["W", "LeftShift+B"]) || value;
	-- 	});
	-- 	task.wait(2);
	-- 	unmount();
	-- 	expect(value).to.be.a("boolean");
	-- 	expect(value).to.equal(true);
	-- });
end
