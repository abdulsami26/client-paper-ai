import { generateRequestSignature } from "@/utility";
import { api } from "./axios-wrapper";

const apiKey = import.meta.env.VITE_API_KEY;

export type ClassesResponse = {
  message: string;
  classes: {
    id: number;
    name: string;
  }[];
};

export type BooksResponse = {
  message: string;
  classesData: {
    id: number;
    name: string;
    books: {
      id: number;
      title: string;
      pdf_url: string;
      class_id: number;
    }[];
  }[];
};

export const getAllClasses = async (): Promise<ClassesResponse> => {
  const headers = await generateRequestSignature({}, apiKey);
  const response = (await api.get(`/public/class`, { headers: headers.headers })) as ClassesResponse;
  return response;
};

export const getBooksByClassID = async (classID: number): Promise<BooksResponse> => {
  const headers = await generateRequestSignature({ classID }, apiKey);
  const response = (await api.get(`/public/class/${classID}`, { headers: headers.headers })) as BooksResponse;
  return response;
};
