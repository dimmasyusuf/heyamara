export default class ChatPrompt {
  create(message: string): string {
    return `JSON ONLY. No text, no formatting, no explanations.

Input: "${message}"

Output format (replace with actual values):
{"title":"Title here","description":"Detailed description here - provide a comprehensive explanation of what this chat is about, including context, purpose, and any relevant details. Make it informative and descriptive."}

Rules:
- Return ONLY the JSON object
- No text before or after
- No markdown
- No quotes around JSON
- No code blocks
- Just: {"title":"...","description":"..."}
- Make description comprehensive and detailed (100-300 characters)`;
  }
}
