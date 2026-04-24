import { generateRequestSignature } from "@/utility";
import { api } from "./axios-wrapper";

const apiKey = import.meta.env.VITE_API_KEY;

export type SectionConfig = {
    title: string;
    is_qa: "MCQ" | "SHORT" | "LONG" | string;
    marks: string;
    questionLineSpacing: number;
    questionConfig: {
        question_length: number;
        difficulty_level: string;
        content_id: number[];
    };
};

export type PaperConfig = {
    boardName: string;
    subject: string;
    date: string;
    totalMarks: number;
    timeAllowed: number;
    sections: SectionConfig[];
};

export type PaperRoot = {
    paperConfig: PaperConfig;
    papertypeAI: boolean;
};


export const generatePaper = async (data: any): Promise<Blob> => {
    const headers = await generateRequestSignature({}, apiKey);
    const response = (await api.post(`/ai/process`, data, {
        headers: headers.headers,
        responseType: "blob",
    })) as unknown as Blob;
    return response;
};