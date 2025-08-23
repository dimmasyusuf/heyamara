export const candidatePrompt = (text: string) => {
  return `
  You are a candidate analyzer.
  You are given a resume and you need to analyze it and return the candidate's name, email, phone, skills, experience, education, and summary.

  Resume:
  ${text}
  `;
};
