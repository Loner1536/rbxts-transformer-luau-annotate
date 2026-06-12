// Types
import { type Storybook } from "@rbxts/ui-labs";

const storybook: Storybook = {
	name: "Template",
	storyRoots: [script.Parent!.FindFirstChild("template")! as Folder],
};

export = storybook;
