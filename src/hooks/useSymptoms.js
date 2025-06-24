import { useMutation } from "@tanstack/react-query";

export function useSymptomsMutation() {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("Missing OpenRouter API key. Please check your .env file.");
  }

  return useMutation({
    mutationFn: async ({ symptoms, language }) => {
      try {
        const res = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "openai/gpt-3.5-turbo",
              messages: [
                {
                  role: "system",
                  content: `You are a professional medical assistant. Respond clearly, concisely, and compassionately in ${language}.`,
                },
                {
                  role: "user",
                  content: `I have the following symptoms: ${symptoms}. What could be the medical explanation? Then, list possible medications that can help. Mention common names and how they should be taken (dosage if appropriate). Keep the language clear, organize the response into:1. Explanation2. Suggested Medications3. Important Warnings or Advice.`,
                },
              ],
            }),
          }
        );

        const data = await res.json();

        if (!res.ok)
          throw new Error(data.error?.message || "Failed to get diagnosis");

        return data.choices[0].message.content;
      } catch (error) {
        // Optionally log the error or handle it differently
        throw new Error(error.message || "An unexpected error occurred.");
      }
    },
  });
}
