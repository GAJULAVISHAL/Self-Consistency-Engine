import OpenAI from "openai";
const client = new OpenAI()

export async function judgeResponses(question, responses) {
    const formattedResponses = responses
        .map(({ model, response }) => `- ${model}: ${response ?? "[No response / Error]"}`)
        .join("\n");

    const judgementInstruction = `
    -Responces
${formattedResponses}
        You are given with the responces of all the models you have to just give the correct responce
        Dont generate a new responce just send the correct responce of the above responce
        You act as a judge to the input i am providing you with the responces of given to me by some models mentioned below 
        Among the all the responces you have to respond with the correct answer for the input based on the majority of correct answers
        Make sure you are not generating a new responce but returning a responce from above
    `
    console.log(judgementInstruction)
    try {
        const judgment = await client.responses.create({
            model: "gpt-4o",
            input: question,
            instructions: judgementInstruction
        })
        return judgment.output_text;
    } catch (err) {
        return null;
    }
}