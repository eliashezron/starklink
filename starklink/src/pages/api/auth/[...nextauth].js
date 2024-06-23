// src/pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    jwt: true,
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Ensure a relative URL redirection after sign in
      return baseUrl;
    },
  },
  pages: {
    signIn: '/', // Redirect here if user tries to access a protected page
    error: '/error', // Error code passed in query string as ?error=
  },
});
