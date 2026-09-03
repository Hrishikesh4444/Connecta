import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import dotenv from "dotenv";

dotenv.config();

const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "openai/gpt-oss-20b",
    temperature: 0.7,
});

export const aiPostAssistant = async (req, res) => {
    try {
        const { action, content } = req.body;

        if (!action || !content) {
            return res.status(400).json({
                message: "Action and content are required."
            });
        }

        const systemMessage =
            "You are an expert social media and LinkedIn content assistant.";

        let userMessageTemplate = "";

        switch (action) {
            case "generate":
                userMessageTemplate =
                    "Write an engaging, professional post about the following topic: {content}. Keep it roughly 150-200 words, use short paragraphs, and end with an engaging question.";
                break;

            case "rewrite":
                userMessageTemplate =
                    "Rewrite the following post to make it sound more professional and engaging. Output only the rewritten post:\n\n{content}";
                break;

            case "grammar":
                userMessageTemplate =
                    "Correct spelling or grammatical errors and improve the flow. Output only the corrected post:\n\n{content}";
                break;

            case "shorter":
                userMessageTemplate =
                    "Make the following post shorter and more concise while keeping the main message:\n\n{content}";
                break;

            case "longer":
                userMessageTemplate =
                    "Expand the following post with more professional depth and detail:\n\n{content}";
                break;

            case "hashtags":
                userMessageTemplate =
                    "Generate 5 relevant hashtags. Output only the hashtags:\n\n{content}";
                break;

            case "title":
                userMessageTemplate =
                    "Generate a catchy title for the following post. Output only the title:\n\n{content}";
                break;

            case "emojis":
                userMessageTemplate =
                    "Add relevant professional emojis to the following post:\n\n{content}";
                break;

            default:
                return res.status(400).json({
                    message: "Invalid action provided."
                });
        }

        const prompt = PromptTemplate.fromTemplate(
            `${systemMessage}\n\n${userMessageTemplate}`
        );

        const parser = new StringOutputParser();

        const chain = prompt
            .pipe(model)
            .pipe(parser);

        const result = await chain.invoke({ content });

        return res.status(200).json({ result });

    } catch (error) {
        console.error("LangChain Error:", error);

        return res.status(500).json({
            message: error.message
        });
    }
};
