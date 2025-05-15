import { NextAuthOptions } from 'next-auth'
import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter'
import { db } from './db'
import GoogleProvider from 'next-auth/providers/google'
import { fetchRedis } from '@/helpers/redis'

function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID || '';
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';

  // If Google credentials are missing, return null
  if (!clientId || !clientSecret) {
    console.warn('Google credentials are missing, Google login will not be available');
    return null; // Return null if credentials are missing
  }

  return { clientId, clientSecret };
}


export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    // Only add GoogleProvider if credentials exist
    ...(getGoogleCredentials() ? [
      GoogleProvider({
        clientId: getGoogleCredentials()!.clientId,
        clientSecret: getGoogleCredentials()!.clientSecret,
      }),
    ] : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const dbUserResult = (await fetchRedis('get', `user:${token.id}`)) as
        | string
        | null;

      if (!dbUserResult) {
        if (user) {
          token.id = user!.id;
        }

        return token;
      }

      const dbUser = JSON.parse(dbUserResult) as User;

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }

      return session;
    },
    redirect({ url, baseUrl }) {
      // If a proper callbackUrl is passed (e.g. /dashboard), return it
      if (url.startsWith(baseUrl)) return url;
    
      // Fallback
      return `${baseUrl}/dashboard`;
    }
    
  },
};

