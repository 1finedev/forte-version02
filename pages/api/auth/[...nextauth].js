import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "./../../../backend/userModel";
import { connectToDatabase } from "./../../../backend/dbConnect";

export default NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials, req) {
        await connectToDatabase();

        //1. check credentials for body data
        const { mobile, password } = credentials;
        if (!mobile || !password) {
          throw new Error("Invalid  details");
        }

        // 2. init user and check if user exists in DB
        let user;
        try {
          user = await User.findOne({
            mobile,
          }).select("+password");
          if (!user) {
            throw new Error("User not found!");
          }
        } catch (error) {
          throw new Error(error);
        }

        //3) Verify user Password
        if (!(await user.correctPassword(password, user.password))) {
          throw new Error("Incorrect password");
        }

        if (user.suspended) {
          throw new Error("Account has been suspended!");
        }

        user.password = undefined;
        user.__v = undefined;
        user.createdAt = undefined;
        user.otp = undefined;
        user.updatedAt = undefined;
        user.gender = undefined;
        user.suspended = undefined;
        user.active = undefined;

        return user;
      },
    }),
  ],
  secret: process.env.COOKIE_SECRET,
  jwt: {
    encryption: true,
    secret: process.env.JWT_SECRET,
    signingKey: process.env.JWT_SIGNING_KEY,
    encryptionKey: process.env.JWT_ENCRYPTION_KEY,
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async session({ session, token }) {
      token && (session.user = token.user);
      const user = await User.findById(token.user._id);
      session.user = user;
      return session;
    },
    async jwt({ token, user }) {
      user && (token.user = user);
      return token;
    },
  },
  pages: { signIn: "/login", signOut: "/", error: "/login" },
  debug: true,
});
