import OpenAI from "openai";
import dotenv from 'dotenv'
dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPEN_AI_API
})

export async function processingImageText(imageUrl) {
    const base64EncodedBuffer = await imageUrlToBase64(imageUrl);
    const prompt = `I building a system to create summary of linkedin profile that is personalized. Can you extract a summary based on Screenshot image of the Linkedin Profile picture attached with this message
    `
    const result = await client.chat.completions.create({
        messages: [{ role: 'user', content: [{
                type: "text", text: prompt
            }, {
                type: "image_url", image_url: { "url": `${base64EncodedBuffer}` }
            }]}],
        model: 'gpt-4-turbo'
    })
    return result?.choices[0]?.message;
}

export async function creatingColdEmail(summary) {
    
}