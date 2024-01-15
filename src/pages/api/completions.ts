import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type CompletionsResponse = {
  messages: ChatCompletionMessageParam[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CompletionsResponse>,
) {
  if (req.method !== 'POST') return res.status(405).end();

  const messages = req.body.messages as ChatCompletionMessageParam[];

  const response = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: '너는 IT 프로그래머로 IT 관련된 질문에만 대답을 해줘',
      },
      ...messages,
    ],
    model: 'gpt-4-0613',
  });

  messages.push(response.choices[0].message);

  res.status(200).json({ messages });
}
