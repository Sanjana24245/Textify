
export const dynamic = 'force-dynamic';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import { fetchRedis } from '@/helpers/redis';
import { messageValidator } from '@/lib/validations/message';
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
  try {
    const { text, chatId }: { text: string; chatId: string } = await req.json();

    // ✅ Do NOT pass req here — App Router handles cookies internally
    const session = await getServerSession(authOptions);

    if (!session) return new Response('Unauthorized', { status: 401 });

    const [userId1, userId2] = chatId.split('--');
    if (session.user.id !== userId1 && session.user.id !== userId2) {
      return new Response('Unauthorized', { status: 401 });
    }

    const friendId = session.user.id === userId1 ? userId2 : userId1;

    const friendList = (await fetchRedis(
      'smembers',
      `user:${session.user.id}:friends`
    )) as string[];
    const isFriend = friendList.includes(friendId);
    if (!isFriend) return new Response('Unauthorized', { status: 401 });

    const rawSender = (await fetchRedis('get', `user:${session.user.id}`)) as string;
    const sender = JSON.parse(rawSender);

    const timestamp = Date.now();

    const messageData = {
      id: nanoid(),
      senderId: session.user.id,
      text,
      timestamp,
    };

    const message = messageValidator.parse(messageData);

    await pusherServer.trigger(toPusherKey(`chat:${chatId}`), 'incoming-message', message);

    await pusherServer.trigger(toPusherKey(`user:${friendId}:chats`), 'new_message', {
      ...message,
      senderImg: sender.image,
      senderName: sender.name,
    });

    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    });

    return new Response('OK');
  } catch (err) {
    console.error(err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
