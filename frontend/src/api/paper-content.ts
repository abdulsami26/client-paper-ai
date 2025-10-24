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

export type ChaptersResponse = {
  message: string;
  bookData: {
    id: number;
    title: string;
    pdf_url: string;
    class_id: number;
    chapters: {
      id: number;
      title: string;
      book_id: number;
    }[];
  }[];
};

export type TopicsResponse = {
  message: string;
  chapterData: {
    id: number;
    title: string;
    chapter_id: number;
    content: {
      id: number;
      title: string;
      topic_id: number;
      content: string;
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

export const getChaptersByBookID = async (bookID: number): Promise<ChaptersResponse> => {
  const headers = await generateRequestSignature({ bookID }, apiKey);
  const response = (await api.get(`/public/book/${bookID}`, { headers: headers.headers })) as ChaptersResponse;
  return response;
};

export const getTopicsByChapterID = async (chapterID: number): Promise<TopicsResponse> => {
  const headers = await generateRequestSignature({ chapterID }, apiKey);
  const response = (await api.get(`/public/chapter/${chapterID}`, { headers: headers.headers })) as TopicsResponse;
  return response;
};

