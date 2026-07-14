import "dotenv/config";
import OpenAI from "openai";
import { systemInstruction } from "./gemini-2.js";

const client = new OpenAI();

export async function openaiResponse(input = "") {
  try {
    const response = await client.responses.create({
      model: "o3-mini",
      input: input,
      instructions: systemInstruction
    });
    console.log(response.output_text)
    return response.output_text;
  } catch (error) {
    return null;
  }
}