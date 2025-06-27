import { INodeProperties } from "n8n-workflow";

const REGION_PLACEHOLDER = "{{REGION}}";

export const models = [
	{
		name: "cohere.command-a-03-2025 v1.0",
		value: `ocid1.generativeaimodel.oc1.${REGION_PLACEHOLDER}.amaaaaaask7dceyapnibwg42qjhwaxrlqfpreueirtwghiwvv2whsnwmnlva`,
		apiFormat: "COHERE",
	},
	{
		name: "cohere.command-r-08-2024 v1.7",
		value: `ocid1.generativeaimodel.oc1.${REGION_PLACEHOLDER}.amaaaaaask7dceyanrlpnq5ybfu5hnzarg7jomak3q6kyhkzjsl4qj24fyoq`,
		apiFormat: "COHERE",
	},
	{
		name: "cohere.command-r-plus-08-2024 v1.6",
		value: `ocid1.generativeaimodel.oc1.${REGION_PLACEHOLDER}.amaaaaaask7dceyaodm6rdyxmdzlddweh4amobzoo4fatlao2pwnekexmosq`,
		apiFormat: "COHERE",
	},
	{
		name: "meta.llama-3.1-405b-instruct",
		value: `ocid1.generativeaimodel.oc1.${REGION_PLACEHOLDER}.amaaaaaask7dceyarleil5jr7k2rykljkhapnvhrqvzx4cwuvtfedlfxet4q`,
		apiFormat: "GENERIC",
	},
	{
		name: "meta.llama-3.1-70b-instruct",
		value: `ocid1.generativeaimodel.oc1.${REGION_PLACEHOLDER}.amaaaaaask7dceyaiir6nnhmlgwvh37dr2mvragxzszqmz3hok52pcgmpqta`,
		apiFormat: "GENERIC",
	},
	{
		name: "meta.llama-3.2-90b-vision-instruct",
		value: `ocid1.generativeaimodel.oc1.${REGION_PLACEHOLDER}.amaaaaaask7dceya2xrydihzvu5pk6vlvfhtbnfapcvwhhugzo7jez4zcnaa`,
		apiFormat: "GENERIC",
	},
	{
		name: "meta.llama-3.3-70b-instruct",
		value: `ocid1.generativeaimodel.oc1.${REGION_PLACEHOLDER}.amaaaaaask7dceyajqi26fkxly6qje5ysvezzrypapl7ujdnqfjq6hzo2loq`,
		apiFormat: "GENERIC",
	},
	{
		name: "meta.llama-4-maverick-17b-128e-instruct-fp8",
		value: `ocid1.generativeaimodel.oc1.${REGION_PLACEHOLDER}.amaaaaaask7dceyayjawvuonfkw2ua4bob4rlnnlhs522pafbglivtwlfzta`,
		apiFormat: "GENERIC",
	},
	{
		name: "meta.llama-4-scout-17b-16e-instruct",
		value: `ocid1.generativeaimodel.oc1.${REGION_PLACEHOLDER}.amaaaaaask7dceyarojgfh6msa452vziycwfymle5gxdvpwwxzara53topmq`,
		apiFormat: "GENERIC",
	},
	{
		name: "xai.grok-3",
		value: `ocid1.generativeaimodel.oc1.${REGION_PLACEHOLDER}.amaaaaaask7dceya6dvgvvj3ovy4lerdl6fvx525x3yweacnrgn4ryfwwcoq`,
		apiFormat: "GENERIC",
	},
	{
		name: "xai.grok-3-fast",
		value: `ocid1.generativeaimodel.oc1.${REGION_PLACEHOLDER}.amaaaaaask7dceyat326ygnn5hesfplopdmkyrklzcehzxhk5262655bthjq`,
		apiFormat: "GENERIC",
	},
	{
		name: "xai.grok-3-mini",
		value: `ocid1.generativeaimodel.oc1.${REGION_PLACEHOLDER}.amaaaaaask7dceyavwbgai5nlntsd5hngaileroifuoec5qxttmydhq7mykq`,
		apiFormat: "GENERIC",
	},
	{
		name: "xai.grok-3-mini-fast",
		value: `ocid1.generativeaimodel.oc1.${REGION_PLACEHOLDER}.amaaaaaask7dceyaoukpjdotfk5fmhkps63szixxhfiyfamurrzkqea7sjva`,
		apiFormat: "GENERIC",
	},
];

const cohereModelIds = models
	.filter((model) => model.apiFormat === "COHERE")
	.map((model) => model.value);

const additionalFields: INodeProperties[] = [
	{
		displayName: "Temperature",
		name: "temperature",
		type: "number",
		typeOptions: { minValue: 0, maxValue: 2 },
		default: 1.0,
		description:
			"Controls randomness. Lower values make the model more deterministic.",
	},
	{
		displayName: "Max Tokens",
		name: "maxTokens",
		type: "number",
		typeOptions: { minValue: 1 },
		default: 600,
		description: "The maximum number of tokens to generate.",
	},
	{
		displayName: "Top P",
		name: "topP",
		type: "number",
		typeOptions: { minValue: 0, maxValue: 1 },
		default: 0.75,
		description: "Controls diversity via nucleus sampling.",
	},
	{
		displayName: "Top K",
		name: "topK",
		type: "number",
		typeOptions: { minValue: 0 },
		default: 0,
		displayOptions: {
			show: {
				modelId: cohereModelIds,
			},
		},
		description:
			"Filters the vocabulary to the K most likely tokens. Only for Cohere models.",
	},
];

export const generationFields: INodeProperties[] = [
	{
		displayName: "Compartment ID",
		name: "compartmentId",
		type: "string",
		required: true,
		default: "",
		description:
			"The OCID of the compartment where the GenAI model will be used.",
	},
	{
		displayName: "Model",
		name: "modelId",
		type: "options",
		options: models,
		required: true,
		default: models[0].value,
		description: "The model to use for text generation.",
	},
	{
		displayName: "Prompt",
		name: "prompt",
		type: "string",
		required: true,
		typeOptions: {
			rows: 5,
		},
		default: "",
		description: "The text prompt to send to the language model.",
	},
	...additionalFields,
];
