
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, QuestionType } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStudyNotes = async (course: string, topic: string) => {
    const prompt = `
        As an expert tutor, provide comprehensive study material for the topic "${topic}" within the course "${course}". 
        Your response should be structured into two parts:
        1. A concise, clear "Tutor Explanation" that breaks down the core concepts as if you were explaining it to a student.
        2. A "Study Notes" section with well-structured, easy-to-digest bullet points covering key definitions, principles, and examples.
        Use Google Search to ensure the information is accurate and up-to-date.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const text = response.text;
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        return { text, groundingChunks };
    } catch (error) {
        console.error("Error fetching study notes:", error);
        throw new Error("Failed to fetch study notes from Gemini API.");
    }
};

const quizQuestionSchema = {
    type: Type.OBJECT,
    properties: {
        question: { type: Type.STRING, description: "The quiz question." },
        type: { type: Type.STRING, enum: [QuestionType.MCQ, QuestionType.ShortAnswer, QuestionType.TrueFalse], description: "The type of question." },
        options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An array of 4 options for Multiple Choice questions. Should be null for other types."
        },
        answer: { type: Type.STRING, description: "The correct answer. For MCQs, this should be one of the options. For True/False, it should be 'True' or 'False'." },
        explanation: { type: Type.STRING, description: "A brief explanation of the correct answer." }
    },
    required: ["question", "type", "answer", "explanation"]
};

export const generateQuiz = async (
    topic: string,
    numQuestions: number,
    questionTypes: QuestionType[],
    difficulty: string
): Promise<QuizQuestion[]> => {
    const prompt = `
        Generate a mock test with ${numQuestions} questions on the topic "${topic}".
        The difficulty level should be ${difficulty}.
        Include the following question types: ${questionTypes.join(', ')}.
        For each question, provide the question text, its type, options (for MCQs), the correct answer, and a brief explanation.
        Ensure MCQs have 4 distinct options.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        questions: {
                            type: Type.ARRAY,
                            items: quizQuestionSchema
                        }
                    },
                    required: ["questions"]
                }
            }
        });

        const jsonResponse = JSON.parse(response.text);
        if (jsonResponse.questions && Array.isArray(jsonResponse.questions)) {
            return jsonResponse.questions as QuizQuestion[];
        }
        throw new Error("Invalid response format from Gemini API.");
    } catch (error) {
        console.error("Error generating quiz:", error);
        throw new Error("Failed to generate quiz from Gemini API.");
    }
};
