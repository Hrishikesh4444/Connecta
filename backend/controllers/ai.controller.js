import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import dotenv from "dotenv"
dotenv.config()

// 1. Initialize the Groq model through LangChain
const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile", 
    temperature: 0.7,
});

export const aiPostAssistant = async (req, res) => {
    try {
        const { action, content, topic } = req.body;
        
        const systemMessage = "You are an expert social media and LinkedIn content assistant.";
        let userMessageTemplate = "";
        let inputVariables = { content };

        // 2. Decide the prompt template based on the action
        switch (action) {
            case 'generate':
                userMessageTemplate = "Write an engaging, professional post about the following topic: {topic}. Keep it roughly 150-200 words, use short paragraphs, and end with an engaging question.";
                inputVariables = { topic }; // We pass 'topic' instead of 'content' here
                break;
            case 'rewrite':
                userMessageTemplate = "Rewrite the following post to make it sound more professional and engaging. Output only the rewritten post:\n\n{content}";
                break;
            case 'grammar':
                userMessageTemplate = "Correct any spelling or grammatical errors in the following post. Improve the flow. Output only the corrected post:\n\n{content}";
                break;
            case 'shorter':
                userMessageTemplate = "Make the following post shorter and more concise while keeping the main message. Output only the shorter post:\n\n{content}";
                break;
            case 'longer':
                userMessageTemplate = "Expand on the following post, adding more professional depth and detail to make it longer. Output only the longer post:\n\n{content}";
                break;
            case 'hashtags':
                userMessageTemplate = "Generate 5 relevant hashtags for the following post. Output ONLY the hashtags (e.g., #Example #Tag):\n\n{content}";
                break;
            case 'title':
                userMessageTemplate = "Generate a catchy, engaging title/headline for the following post. Output ONLY the title:\n\n{content}";
                break;
            case 'emojis':
                userMessageTemplate = "Add relevant emojis to the following post to make it more visually engaging. Keep it professional. Output only the updated post:\n\n{content}";
                break;
            default:
                return res.status(400).json({ error: "Invalid action provided." });
        }

        // 3. Create the LangChain Prompt Template
        const prompt = PromptTemplate.fromTemplate(`${systemMessage}\n\n${userMessageTemplate}`);

        // 4. Create the Chain using LCEL (Prompt -> Model -> Output Parser)
        // The StringOutputParser automatically extracts the text so we don't have to do `result.choices[0].message.content` manually.
        const chain = prompt.pipe(model).pipe(new StringOutputParser());

        // 5. Invoke the chain with our variables
        const result = await chain.invoke(inputVariables);

        // Send back to the React frontend
        res.status(200).json({ result: result });

    } catch (error) {
        console.error("LangChain Error:", error);
        res.status(500).json({ message: "Failed to generate AI response." });
    }
};