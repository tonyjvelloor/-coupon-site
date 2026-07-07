export interface LLMGenerationSettings {
  temperature?: number;
  maxTokens?: number;
}

export interface LLMResponse<T> {
  data: T;
  model: string;
  settings: LLMGenerationSettings;
  promptVersion: string;
}

export interface LLMProvider {
  name: string;
  generate<T>(
    promptVersion: string,
    prompt: string,
    schema: any,
    settings?: LLMGenerationSettings
  ): Promise<LLMResponse<T>>;
}
