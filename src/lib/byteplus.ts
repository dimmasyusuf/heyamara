import { BytePlusConfig, BytePlusProps, BytePlusChat } from "@/types/byteplus";

export default class BytePlus {
  private config: BytePlusConfig;

  constructor() {
    const apiUrl = process.env.BYTEPLUS_API_URL;
    const apiKey = process.env.BYTEPLUS_API_KEY;

    if (!apiUrl || !apiKey) {
      throw new Error("BYTEPLUS_API_URL and BYTEPLUS_API_KEY must be set");
    }

    this.config = {
      apiUrl,
      apiKey,
    };
  }

  async chat({
    model = "seed-1-6-250615",
    messages,
  }: BytePlusProps): Promise<BytePlusChat> {
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
      }),
    };

    try {
      const response = await fetch(this.config.apiUrl, options);
      const data = await response.json();
      console.log("BytePlus response:", data);

      // Return the response data so it can be used
      return data;
    } catch (error) {
      console.error("BytePlus error:", error);
      throw error;
    }
  }

  async stream({ model = "seed-1-6-250615", messages }: BytePlusProps) {
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
      }),
    };

    const response = await fetch(this.config.apiUrl, options);

    const reader = response.body?.getReader();

    if (!reader) {
      throw new Error("Response body is not readable");
    }

    const decoder = new TextDecoder();

    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        while (true) {
          const lineEnd = buffer.indexOf("\n");
          if (lineEnd === -1) break;
          const line = buffer.slice(0, lineEnd).trim();
          buffer = buffer.slice(lineEnd + 1);
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0].delta.content;
              if (content) {
                console.log(content);
              }
            } catch (e) {
              console.error(e);
            }
          }
        }
      }
    } finally {
      reader.cancel();
    }
  }
}
