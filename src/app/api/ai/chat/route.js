// app/api/ai/chat/route.js
import { withAuth } from "@/lib/withAuth"
import { google } from "@ai-sdk/google"
import { streamText } from "ai"

export const POST = withAuth(async (request) => {
    const { messages } = await request.json()

    const result = await streamText({
        model: google('gemini-2.0-flash'),
        messages  // full conversation history
    })

    return result.toDataStreamResponse()  // 👈 handles streaming automatically
})