
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, IterationAdvice } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const CHECKLIST_ITEM_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    label: { type: Type.STRING },
    status: { type: Type.BOOLEAN },
    feedback: { type: Type.STRING },
  },
  required: ["label", "status", "feedback"],
};

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    score: { 
      type: Type.NUMBER,
      description: "A score from 0 to 100 representing how well Lovable will be able to 'vibe-code' this prompt."
    },
    summary: { 
      type: Type.STRING,
      description: "A 1-line assessment of the prompt's 'vibe' and suitability for Lovable."
    },
    strengths: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Specific 'Vibe Wins'—elements that will help Lovable generate the right UI/Logic."
    },
    weaknesses: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Specific 'Vibe Gaps'—areas where Lovable might hallucinate or miss the mark."
    },
    checklist: {
      type: Type.OBJECT,
      properties: {
        context: { type: Type.ARRAY, items: CHECKLIST_ITEM_SCHEMA, description: "Checks for Goal, User, and Platform context." },
        structure: { type: Type.ARRAY, items: CHECKLIST_ITEM_SCHEMA, description: "Checks for Feature lists, Page flows, and Markdown formatting." },
        uxDetails: { type: Type.ARRAY, items: CHECKLIST_ITEM_SCHEMA, description: "Checks for specific UI constraints, Interactions, and Animations." },
      },
      required: ["context", "structure", "uxDetails"],
    },
    prioritizedActions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "2-3 direct, prioritized actions the user should take to improve the prompt immediately."
    },
    refinedPrompt: { 
      type: Type.STRING,
      description: "A high-fidelity structured prompt optimized for Lovable's full-stack capabilities."
    },
    whatsChanged: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Specific technical details or UX constraints added to steer Lovable better."
    },
  },
  required: ["score", "summary", "strengths", "weaknesses", "checklist", "prioritizedActions", "refinedPrompt", "whatsChanged"],
};

const DEBUG_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    misunderstanding: {
      type: Type.STRING,
      description: "Explicitly frame as: 'Lovable interpreted this as [X] because [Y]'.",
    },
    rootCause: {
      type: Type.STRING,
      description: "Explain why the 'vibe' shifted, referencing Lovable's tendency to prioritize certain keywords or patterns.",
    },
    fix: {
      type: Type.STRING,
      description: "The exact sentence or technical constraint to add to the prompt for a successful next iteration.",
    },
  },
  required: ["misunderstanding", "rootCause", "fix"],
};

export const analyzePrompt = async (promptContent: string): Promise<AnalysisResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Evaluate this prompt for Lovable's vibe-coding engine: \n\n"${promptContent}"`,
    config: {
      systemInstruction: `You are a Senior Lovable Vibe-Coding Architect. 
      Your mission is to help users generate high-quality full-stack apps (React/Tailwind/Supabase) by optimizing their prompts.
      
      Evaluate the prompt's 'Vibe Quality' and populate the checklist sections.
      
      'prioritizedActions': Identify the 2-3 most critical missing pieces or vague areas. Use clear, direct language like "Add target user description" or "Clarify data source".
      
      REWRITE INSTRUCTION: 
      The 'refinedPrompt' must be a master-class in Lovable prompting. 
      Use structured Markdown with these exact headers:
      # GOAL
      # USER
      # PLATFORM
      # FEATURES
      # UX REQUIREMENTS
      # CONSTRAINTS
      
      Be specific about UI interactions and data handling to minimize Lovable hallucinations. 
      In 'whatsChanged', highlight the technical steering you added.`,
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_SCHEMA,
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as AnalysisResult;
};

export const getIterationAdvice = async (originalPrompt: string, aiOutput: string): Promise<IterationAdvice> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `User Prompt: "${originalPrompt}"\n\nLovable Generation Result/Error: "${aiOutput}"`,
    config: {
      systemInstruction: `You are a Lovable Debugging Specialist. 
      The user is 'vibe-coding' and just got an unexpected result or a technical error in their Lovable preview.
      
      Analyze the delta between the prompt and the result.
      1. Use the framing: "Lovable interpreted this as..." 
      2. Identify the 'Vibe Shift'—where did the prompt lose its clarity?
      3. Provide the 'Instant Fix'—the exact string to paste into the next iteration to correct course.
      
      Keep feedback fast, punchy, and professional. Avoid generic AI advice. Focus on Lovable's specific behaviors.`,
      responseMimeType: "application/json",
      responseSchema: DEBUG_SCHEMA,
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as IterationAdvice;
};
