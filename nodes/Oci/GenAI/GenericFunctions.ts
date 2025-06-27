import { IExecuteFunctions } from "n8n-workflow";
import {
	NoRetryConfigurationDetails,
	Region,
	SimpleAuthenticationDetailsProvider,
} from "oci-common";
import {
	GenerativeAiInferenceClient,
	models,
	requests,
	responses,
} from "oci-generativeaiinference";
import { Credentials, GenerationOptions } from "./types/types.nodes";

export async function getClientAndRegion(
	this: IExecuteFunctions,
): Promise<{ client: GenerativeAiInferenceClient; region: string }> {
	const credentials = (await this.getCredentials(
		"ociAPISigningKey",
	)) as any;
	const { userOcid, tenancyOcid, keyFingerprint, region, privateKey } =
		credentials;

	const authProvider = new SimpleAuthenticationDetailsProvider(
		tenancyOcid,
		userOcid,
		keyFingerprint,
		privateKey,
		null,
		Region.fromRegionId(region),
	);

	const client = new GenerativeAiInferenceClient({
		authenticationDetailsProvider: authProvider,
	});
	return { client, region };
}

export async function generateTextCompletion(
	client: GenerativeAiInferenceClient,
	compartmentId: string,
	modelId: string,
	prompt: string,
	apiFormat: "COHERE" | "GENERIC",
	options: GenerationOptions,
): Promise<responses.ChatResponse> {
	let chatRequestPayload: models.CohereChatRequest | models.GenericChatRequest;

	if (apiFormat === "COHERE") {
		chatRequestPayload = {
			apiFormat: "COHERE",
			message: prompt,
		};
	} else {
		chatRequestPayload = {
			apiFormat: "GENERIC",
			messages: [
				{
					role: "USER",
					content: [{ type: "TEXT", text: prompt }] as any,
				},
			],
		};
	}

	const chatDetails: models.ChatDetails = {
		compartmentId,
		servingMode: {
			modelId,
			servingType: "ON_DEMAND",
		},
		chatRequest: {
			...chatRequestPayload,
			...options,
		},
	};

	const chatRequest: requests.ChatRequest = {
		chatDetails,
		retryConfiguration: NoRetryConfigurationDetails,
	};

	const response = client.chat(chatRequest);

	return response as any;
}
