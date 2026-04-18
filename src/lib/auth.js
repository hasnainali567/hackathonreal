import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { headers } from "next/headers";

const client = new MongoClient(process.env.MONGO_URI)
const database = client.db();
const auth = betterAuth({
    database: mongodbAdapter(database, {
        client
    }),
    emailAndPassword: {
        enabled: true,
    }
})

export const getSession = async () => {
    const session = await auth.api.getSession({
        headers : await headers()
    });
    if (!session || !session.user) {
        return null;
    }

    return session;
}

export default auth;