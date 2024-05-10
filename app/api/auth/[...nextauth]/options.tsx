import type { NextAuthOptions, Profile } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { api } from "../../index";
import { User, Account } from "next-auth";
import { query } from "@/config/db";
import bcrypt from "bcryptjs";

type SignInCallbackParams = {
  user: User;
  account: Account;
  profile: Profile;
};

const signInCallback: (
  params: SignInCallbackParams
) => Promise<boolean | undefined> = async ({ user, account, profile }) => {
  if (account?.provider == "credentials") {
    return true;
  }

  if (account?.provider == "google") {
    try {
      const username = user.email?.split("@") ?? "null";
      const results = await query({
        query: "SELECT * FROM users WHERE email = ?",
        data: [user.email],
      });

      if (results.length == 0) {
        const newUser = await query({
          query: "INSERT INTO users(name,username,email) VALUES(?,?,?)",
          data: [user.name, username[0], user.email],
        });

        return true;
      }

      return true;
    } catch (error) {
      console.log("Error saving user: ", error);
      return false;
    }
  }
};

const callbacks = {
  signIn: signInCallback,
  async session({ session }: any) {
    try {
      console.log("session", session);
      const results = await query({
        query: "SELECT id, image FROM users WHERE email = ?",
        data: [session.user.email],
      });
      const data = results[0];

      console.log("data", data);

      session.user.image = data.image;
      session.user.id = data.id;
    } catch (error) {
      console.log(error);
    }
    // console.log(session);
    // const acessToken = jwt.sign(
    //   { id: data.id, email: data.email, name: data.name },
    //   process.env.NEXTAUTH_SECRET || "yourFallbackSecret",
    //   { expiresIn: "30d" }
    // );

    return session;
  },
  // Add other callbacks as needed
};

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        try {
          const existingUser = await query({
            query: "SELECT * FROM users WHERE email = ? OR username = ?",
            data: [credentials?.username, credentials?.username],
          });

          const decodedString = Buffer.from(
            credentials?.password,
            "base64"
          ).toString("utf-8");

          var user = existingUser[0];
          if (existingUser.length > 0) {
            var user = existingUser[0];

            const isPasswordCorrect = await bcrypt.compare(
              credentials?.password,
              user.password
            );

            if (isPasswordCorrect) {
              return user;
            } else {
              return null;
            }
          } else {
            return null;
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: callbacks as Record<string, (params: any) => Promise<any>>,
  secret: process.env.SECRET,
  // pages: {
  //   signIn: "/login",
  // },

  session: {
    strategy: "jwt",
    maxAge: 90 * 24 * 60 * 60,
  },
};
