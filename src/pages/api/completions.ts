import { createClient } from '@/utils/supabase/server';
import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import type {
  ChatCompletionMessageParam,
  ChatCompletionSystemMessageParam,
} from 'openai/resources/index.mjs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getFirstMessage = async (
  supabase: ReturnType<typeof createClient>,
): Promise<ChatCompletionSystemMessageParam> => {
  const { data: postMetadataList } = await supabase
    .from('Post')
    .select('id, title, category, tags');

  return {
    role: 'system',
    content: `너는 개발 전문 챗봇이야. 블로그 글을 참고하여 상대방의 질문에 답변해줘야 해.
너가 잘 모르는 질문이라면, 다음 블로그 글들을 참고하여 답변해줘.

[블로그 글 목록]
${JSON.stringify(postMetadataList ?? [])}

너는 retrieve 함수를 사용하여 블로그 글을 가져올 수 있어. 참고하고 싶은 블로그 글이 있다면, retrieve 함수를 사용하여 블로그 글을 가져와서 답변해줘.`,
  };
};

const getBlogContent = async (
  id: string,
  supabase: ReturnType<typeof createClient>,
) => {
  const { data } = await supabase.from('Post').select('*').eq('id', id);

  if (!data) return {};
  return data[0];
};

type CompletionsResponse = {
  messages: ChatCompletionMessageParam[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CompletionsResponse>,
) {
  if (req.method !== 'POST') return res.status(405).end();

  const messages = req.body.messages as ChatCompletionMessageParam[];

  const supabase = await createClient(req.cookies);

  if (messages.length === 1) {
    messages.unshift(await getFirstMessage(supabase));
  }

  while (messages.at(-1)?.role !== 'assistant') {
    const response = await openai.chat.completions.create({
      messages,
      model: 'gpt-4-1106-preview',
      function_call: 'auto',
      functions: [
        {
          name: 'retrieve',
          parameters: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description: '가져올 블로그 글의 id',
              },
            },
          },
          description: '특정 id를 가진 블로그 글의 전체 내용을 가져옵니다.',
        },
      ],
    });

    const responseMessage = response.choices[0].message;

    if (responseMessage.function_call) {
      const { id } = JSON.parse(responseMessage.function_call.arguments);

      const functionResult = await getBlogContent(id, supabase);

      messages.push({
        role: 'function',
        content: JSON.stringify(functionResult),
        name: responseMessage.function_call.name,
      });
    } else {
      messages.push(responseMessage);
    }
  }

  res.status(200).json({ messages });
}
