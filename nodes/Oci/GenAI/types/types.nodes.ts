export interface Credentials {
	userOcid: string;
	tenancyOcid: string;
	keyFingerprint: string;
	region: string;
	privateKey: string;
}

export interface GenerationOptions {
	temperature: number;
	maxTokens: number;
	topP: number;
	topK?: number;
}
