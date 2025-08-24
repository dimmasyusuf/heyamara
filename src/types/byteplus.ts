export interface BytePlusTool {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: {
      type: "object";
      properties: {
        [key: string]: {
          type: "string" | "number" | "boolean" | "array" | "object";
          description: string;
        };
      };
      required: string[];
    };
  };
}

export interface BytePlusMessageContent {
  type: "text" | "image_url" | "video_url";
  text?: string;
  image_url?: string;
  video_url?: string;
}

export interface BytePlusMessage {
  role: "user" | "system" | "assistant" | "tool";
  content: string | BytePlusMessageContent;
}

export interface BytePlusProps {
  model: string;
  messages: BytePlusMessage[];
  stream?: boolean;
}

export interface BytePlusConfig {
  apiUrl: string;
  apiKey: string;
}

export interface BytePlusChoices {
  finish_reason: string;
  index: number;
  logprobs: string | null;
  message: {
    finish_reason: string;
    index: number;
    logprobs: string | null;
    content: string;
    reasoning_content: string;
    role: string;
  };
}

export interface BytePlusUsage {
  completion_tokens: number;
  prompt_tokens: number;
  total_tokens: number;
  prompt_tokens_details: { cached_tokens: number };
  completion_tokens_details: { reasoning_tokens: number };
}

export interface BytePlusChat {
  choices: BytePlusChoices[];
  created: number;
  id: string;
  model: string;
  service_tier: string;
  object: string;
  usage: BytePlusUsage;
}
