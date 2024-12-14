
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.email === 'adam@apogeeintelligence.ai' && 
            credentials?.password === 'P@ssword123!') {
          return {
            id: "1",
            name: "Admin",
            email: credentials.email
          }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
});

export { handler as GET, handler as POST };
