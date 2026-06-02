import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { SignJWT, jwtVerify } from "jose";

const rawUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_BASE_URL ||
  "http://localhost:8000";
const API_BASE_URL = rawUrl.replace(/\/api\/v1\/?$/, "");

const secret = new TextEncoder().encode(
  process.env.BACKEND_SECRET || "shared-jwt-secret-between-frontend-and-backend"
);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "BritaRH",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          });

          const data = await res.json();
          const backendUser = data?.user;

          if (res.ok && backendUser) {
            return {
              id: backendUser.email,
              name: backendUser.name,
              email: backendUser.email,
              image: backendUser.picture,
              role: backendUser.role,
              accessToken: data.access_token,
            };
          }
        } catch (error) {
          console.error("Auth error:", error);
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    // Custom JWT encoding to allow standard HS256 and shared secret with FastAPI
    async encode({ token, secret: _secret }) {
      if (!token) return "";
      // Remove iat e exp que o NextAuth já pode ter injetado para evitar conflito com o jose
      const { iat, exp, jti, ...payload } = token as any;
      return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(secret);
    },
    async decode({ token, secret: _secret }) {
      if (!token) return null;
      try {
        const { payload } = await jwtVerify(token, secret, {
          algorithms: ["HS256"],
        });
        return payload as any;
      } catch {
        return null;
      }
    },
  },
  callbacks: {
    async jwt({ token, user, profile }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.role = (user as any).role;
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
        (session.user as any).role = token.role as string;
        (session as any).accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});
