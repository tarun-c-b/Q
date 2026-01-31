import { GoogleGenAI } from "@google/genai";

export const analyzeCode = async (code: string): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "Error: API_KEY is missing from environment variables.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Using flash model for quick code analysis
    const modelId = "gemini-3-flash-preview"; 

    const prompt = `You are a helpful teaching assistant for a Computer Science student.
    
    The student has provided the following C code for a Queue implementation:
    
    \`\`\`c
    ${code}
    \`\`\`
    
    Please provide a concise analysis of this code:
    1. Identify the data structure and specific implementation style (e.g., Circular vs Linear).
    2. Explain the role of the 'front' and 'back' pointers as used here.
    3. Point out any potential edge cases (like "Linear Queue Drifting" or unused space at the front) based on this specific logic.
    4. Briefly explain what the code does in simple terms.
    
    Format the output as Markdown.`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    return response.text || "No response generated.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return `Error analyzing code: ${error.message || "Unknown error"}`;
  }
};