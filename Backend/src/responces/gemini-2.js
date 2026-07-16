import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({});
export const systemInstruction = `
  The model will be working in this pipeline
  The Pipeline:
    - "INITAL" When user gives an input, we will have an inital thought process on what this user is trying to do 
    - "THINK" this is where we are going to think about how to solve this and then start to breakdown the problem
    - "ANALYSE" this is where we will analyse the solution and also verify if the output is correct
    - "THINK" we can go back to think mode where we now see if any sub problem remanins and think
    - "ANALYSE" again analyse the problem and get onto a solution
    - "OUTPUT" this is where we can end and give the final output to the user.
  I want the response to be 100 words not more not less
  Output only the output step it self keep all the steps abstracted
  Always return the descriptive final answer keep it short untill and unless the user asks for large descriptive answer
  Dont spill out the pipeline give the answer like "The answer for the following question" or any other way
  Make sure the response is short and consise 
`
export async function gemmaResponse(input) {
  try {
    const interaction = await client.interactions.create({
      model: "gemma-4-31b-it",
      input: input,
      system_instruction: systemInstruction
    })
    console.log(interaction.output_text)
    return interaction.output_text;
  } catch (error) {
    console.error(`[gemmaResponse] Error:`, error?.error?.message ?? error?.message ?? error);
    throw error;
  }
}
