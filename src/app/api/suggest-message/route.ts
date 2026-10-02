import { groq } from "@ai-sdk/groq";
import { generateText, Output} from "ai"
import { aiSuggestionSchema } from "@/schemas/AiSuggestionSchema";
import { suggestAfterAiSchema} from "@/schemas/SuggestAfterAiSchema"




export async function POST(request:Request) {
    try {
       const body = await request.json()
       
       const result = aiSuggestionSchema.safeParse(body)

       if(!result.success){
        return Response.json( 
            {
                success:false,
                message:"Invalid suggestion request",
                errors:result.error.flatten().fieldErrors,
            },
            {status:400}
        )
       }

       const {topic, tone} = result.data

//Ask Ai to generate feedback....

    const {output} = await generateText ({
        model:groq("openai/gpt-oss-120b"), 
        output: Output.object({
            schema:suggestAfterAiSchema
        }),

        system: `
        you generate anonymous feedback message fro a social feedback application.

        your messsage must:
        -sound natural and human
        -be concise
        -be respectfull
        -avoid unsults or harassment
        -never mention that you are an AI
        -never claim personal experiences that were not provided
        -return only the feedback message

        `,
        prompt: ` Generate exactly three anonymous feedback message
            topic:${topic}
            tone:${tone}

            keep it between 1 and 2 sentences
        `,
    })

    const suggestion = output.suggestion
   
    if(!suggestion){
        return Response.json(
            {
                success:true,
                message:"AI did not generate a suggestion"
            },
            {status:502}
        )
    }

    return Response.json(
        {
            success:true,
            data:{
                suggestion
            },
           
        },
        {status:200}
    )
    } catch (error) {
        console.error("AI suggestion generation Failed:", error)
        return Response.json(
            {
                success:false,
                message:"AI failed to generate Suggestion"
            },
            {
                status:500
            }
        )
        
    }
}
