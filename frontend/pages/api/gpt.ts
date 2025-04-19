import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // const userPrompt = req.body.prompt;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `Create a completely different full React component for a junior developer's portfolio.
          Use a unique layout, new sections or navigation style, and a fresh look compared to previous ones.
          Apply Tailwind CSS and modern design ideas. Output only the final code without any extra explanation.
          Don't use and comments`,
        },
        {
          role: "user",
          content: `Generate a beautiful portfolio design for a developer. Sophisticated and modern design`,
        },
      ],
      temperature: 0.8,
      max_tokens: 3000,
    });

    console.log("Prompt tokens:", completion.usage?.prompt_tokens);
    console.log("Completion tokens:", completion.usage?.completion_tokens);
    console.log("Total tokens:", completion.usage?.total_tokens);
    res.status(200).json({
      result: completion.choices[0].message.content,
      outTk: completion.usage?.completion_tokens,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate response" });
  }
};

export default handler;
