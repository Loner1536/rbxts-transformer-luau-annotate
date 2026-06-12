-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
--/ <reference types="@rbxts/testez/globals" />
local Lighting = TS.import(script, TS.getModule(script, "@rbxts", "services")).Lighting
local renderHook = TS.import(script, script.Parent.Parent, "utils", "testez").renderHook
local useTagged = TS.import(script, script.Parent, "use-tagged").useTagged
local TEST_TAG = "TEST_TAG"
return function()
	local testInstances = {}
	local function addTaggedInstance(instanceType, tag)
		local newInstance = Instance.new(instanceType)
		newInstance:AddTag(tag)
		newInstance.Parent = Lighting
		table.insert(testInstances, newInstance)
		task.wait()
		return newInstance
	end
	afterEach(function()
		for _, instance in testInstances do
			instance:Destroy()
		end
	end)
	it("should include existing instances", function()
		local addedInstance = addTaggedInstance("Model", TEST_TAG)
		local _binding = renderHook(function()
			return useTagged(TEST_TAG)
		end)
		local result = _binding.result
		local unmount = _binding.unmount
		expect(#result.current).to.equal(1)
		expect(result.current[1]).to.equal(addedInstance)
		unmount()
	end)
	it("should add new instances", function()
		local _binding = renderHook(function()
			return useTagged(TEST_TAG)
		end)
		local result = _binding.result
		local unmount = _binding.unmount
		local addedInstance = addTaggedInstance("Model", TEST_TAG)
		expect(#result.current).to.equal(1)
		expect(result.current[1]).to.equal(addedInstance)
		unmount()
	end)
	it("should delete removed instances", function()
		local _binding = renderHook(function()
			return useTagged(TEST_TAG)
		end)
		local result = _binding.result
		local unmount = _binding.unmount
		local addedInstance = addTaggedInstance("Model", TEST_TAG)
		expect(#result.current).to.equal(1)
		expect(result.current[1]).to.equal(addedInstance)
		addedInstance:Destroy()
		task.wait()
		expect(#result.current).to.equal(0)
		unmount()
	end)
	it("should ONLY include instances of the provided tag", function()
		local _binding = renderHook(function()
			return useTagged(TEST_TAG)
		end)
		local result = _binding.result
		local unmount = _binding.unmount
		local addedInstance = addTaggedInstance("Model", TEST_TAG)
		addTaggedInstance("Model", `NOT_{TEST_TAG}`)
		expect(#result.current).to.equal(1)
		expect(result.current[1]).to.equal(addedInstance)
		unmount()
	end)
	it("should not duplicate instances", function()
		local addedInstance = addTaggedInstance("Model", TEST_TAG)
		local _binding = renderHook(function()
			return useTagged(TEST_TAG)
		end)
		local result = _binding.result
		local unmount = _binding.unmount
		expect(#result.current).to.equal(1)
		expect(result.current[1]).to.equal(addedInstance)
		unmount()
	end)
end
