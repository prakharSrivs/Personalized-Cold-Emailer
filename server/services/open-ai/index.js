import OpenAI from "openai";
import dotenv from 'dotenv'
import { imageUrlToBase64 } from "../../utils.js";
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

export async function generateColdEmail(profileSummary) {
    const prompt = `
        Based on the following LinkedIn profile summary, write a personalized cold email promoting a product that automates the recruitment process using voice-based AI agents. The email should be professional, relevant, and personalized to the individual.

        Profile Summary: 
        ${profileSummary}

        The product helps companies streamline recruitment through an AI-driven system that automates initial interviews, saving time and improving hiring accuracy. Focus on the benefits of automating the recruitment process and how this solution can help the individual/company in their specific field or role. Make the email sound engaging but professional.

        The email should have a subject, greeting, body, and closing.
    `;

    const result = await client.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-4-turbo',
    });

    return result?.choices[0]?.message.content;
}