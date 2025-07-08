import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import dashscope from '@/lib/dashscope/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = body;
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('dashscope_session_id')?.value;

    const response = await dashscope.sendMessage(prompt, sessionId);

    // Create a TransformStream to handle SSE
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    // Process the stream
    response.data.on('data', async (chunk: Buffer) => {
      const text = chunk.toString();
      const lines = text.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data:')) {
          try {
            const jsonData = JSON.parse(line.slice(5).trim());
            if (jsonData.output?.text) {
              await writer.write(encoder.encode(`data: ${JSON.stringify({ text: jsonData.output.text })}\n\n`));
            }
            if (jsonData.output?.session_id) {
              // Set session cookie
              cookieStore.set('dashscope_session_id', jsonData.output.session_id, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/'
              });
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e);
          }
        }
      }
    });

    response.data.on('end', async () => {
      await writer.close();
    });

    response.data.on('error', async (error: Error) => {
      console.error('Stream error:', error);
      await writer.abort(error);
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 