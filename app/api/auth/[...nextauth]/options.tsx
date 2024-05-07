import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { api } from "../../index";
import { User, Account } from "next-auth";

type SignInCallbackParams = {
  user: User;
  account: Account;
};

const signInCallback: (
  params: SignInCallbackParams
) => Promise<boolean | undefined> = async ({ user, account }) => {
  if (account?.provider == "credentials") {
    return true;
  }

  // console.log("user", user);
  // console.log("account", account);

  if (account?.provider == "google") {
    try {
      // const [existingUser]: any = await pool.execute(
      //   "SELECT * FROM users WHERE email = ?",
      //   [user.email]
      // );

      // if (existingUser.length == 0) {
      //   const [newUser]: any = await pool.execute(
      //     "INSERT INTO users(name,email) VALUES(?,?)",
      //     [user.name, user.email]
      //   );

      //   return true;
      // }
      return true;
    } catch (error) {
      ////console.log("Error saving user: ", error);
      return false;
    }
  }
};

const callbacks = {
  signIn: signInCallback,
  async session({ session }: any) {
    try {
      const [results]: any = await query({
        query: "SELECT UserID,AppRole,UserImage FROM users WHERE UserEmail = ?",
        data: [session.user.email],
      });
      const data = results;

      session.user.image = data.UserImage;
      session.user.id = data.UserID;
      session.user.role = data.AppRole;
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
      async authorize(credentials) {
        const body = JSON.stringify({
          identifier: credentials?.username,
          password: credentials?.password,
        });
        const { data: user } = await api.post(
          "http://127.0.0.1:1337/api/auth/local",
          body
        );

        if (user) {
          return user;
        } else {
          return null;
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
    //strategy: "jwt",
    maxAge: 90 * 24 * 60 * 60,
  },
  // jwt: {
  //   signingKey: process.env.NEXTAUTH_SECRET,
  // },
  // callbacks: {
  //   async session({ session, token }: any) {
  //     //const user = token.user as IUser
  //     session.user = token.user;
  //     return session;
  //   },
  //   async jwt({ token, user }) {
  //     if (user) {
  //       token.user = user;
  //     }
  //     return token;
  //   },
  // },
};
