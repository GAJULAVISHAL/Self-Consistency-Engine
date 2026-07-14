
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { systemInstruction } from "./gemini-2.js";

const client = new GoogleGenAI({});

export async function geminiResponse(input) {
  try {
    const interaction = await client.interactions.create({
      model: "gemini-2.5-flash-lite",
      input: input,
      system_instruction: systemInstruction
    })
    console.log(interaction.output_text)
    return interaction.output_text;
  } catch (error) {
    console.log(error)
    return error;
  }
}