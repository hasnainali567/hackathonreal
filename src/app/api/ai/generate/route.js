import { successResponse } from "@/lib/response"
import { withAuth } from "@/lib/withDb"
import { google } from "@ai-sdk/google"
import { generateText } from "ai"

export const POST = withAuth(async (req, { session }) => {
    const { prompt } = await req.json()

    if (!prompt) {
        return new Response(JSON.stringify({ error: 'Prompt is required' }), { status: 400 })
    }

    const { text } = await generateText({
        model: google('gemini-2.0-flash'),
        prompt
    })

    return successResponse({ text })

})


