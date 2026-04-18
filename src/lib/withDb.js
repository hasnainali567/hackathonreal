import { headers } from "next/headers"
import { errorResponse } from "./response"
import auth from "./auth"
import { connectDB } from "./mongoose"

export function withAuth(handler) {
    return async function (request, context) {
        try {
            await connectDB()
            const session = await auth.api.getSession({
                headers: await headers()
            })
            if (!session) return errorResponse("Unauthorized", 401)
            return await handler(request, context, session)  // 👈 session passed in
        } catch (error) {
            return errorResponse(error.message, 500)
        }
    }
}