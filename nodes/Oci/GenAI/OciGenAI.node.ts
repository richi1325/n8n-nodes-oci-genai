import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
} from "n8n-workflow";
import * as genericFunctions from "./GenericFunctions";
import { generationFields, models } from "./descriptions/GenAI";
import { Credentials, GenerationOptions } from "./types/types.nodes";

export class OciGenAI implements INodeType {
	description: INodeTypeDescription = {
		displayName: "OCI GenAI",
		name: "ociGenAI",
		icon: "file:GenAI.svg",
		group: ["ai"],
		version: 1,
		subtitle: "Generate Text",
		description:
			"Interact with Oracle Cloud Infrastructure Generative AI service",
		defaults: {
			name: "OCI GenAI",
		},
		inputs: ["main"],
		outputs: ["main"],
		credentials: [
			{
				name: "ociAPISigningKey",
				required: true,
			},
		],
		properties: [...generationFields],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const { client, region } = await genericFunctions.getClientAndRegion.call(
			this,
		);
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const compartmentId = this.getNodeParameter(
					"compartmentId",
					i,
				) as string;
				const modelId = this.getNodeParameter("modelId", i) as string;
				const prompt = this.getNodeParameter("prompt", i) as string;
				const temperature = this.getNodeParameter("temperature", i) as number;
				const maxTokens = this.getNodeParameter("maxTokens", i) as number;
				const topP = this.getNodeParameter("topP", i) as number;

				const dynamicModelId = modelId.replace("{{REGION}}", region);

				const selectedModel = models.find((m) => m.value === modelId);
				if (!selectedModel) {
					throw new Error(
						`Model with ID ${modelId} not found in the defined list.`,
					);
				}

				const options: { [key: string]: any } = {
					temperature,
					maxTokens,
					topP,
				};

				if (selectedModel.apiFormat === "COHERE") {
					options.topK = this.getNodeParameter("topK", i) as number;
				}

				const response = await genericFunctions.generateTextCompletion(
					client,
					compartmentId,
					dynamicModelId,
					prompt,
					selectedModel.apiFormat as "COHERE" | "GENERIC",
					options as GenerationOptions,
				);

				const newItem: INodeExecutionData = {
					json: { ...items[i].json, ...response.chatResult },
					pairedItem: { item: i },
				};
				returnData.push(newItem);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error.message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}
		return this.prepareOutputData(returnData);
	}
}
