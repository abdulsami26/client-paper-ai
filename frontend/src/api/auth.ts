import axios from "axios";
import { BASE_URL } from "@/constant/constant";
import { generateRequestSignature } from "@/utility";
import { api } from "./axios-wrapper";

const apiKey = import.meta.env.VITE_API_KEY;

export type LoginResponse = {
  status: boolean,
  user: {
    id: number;
    name: string;
    email: string;
    sub: string;
    picture: string;
    credits: number;
  };
  token: string;
  expiresAt: string;
};

export type MeResponse = {
  status: boolean;
  user: {
    id: number;
    name: string;
    email: string;
    credits: number;
  };
};

export const login = async (token: string): Promise<LoginResponse> => {
  const body = { "token": token }
  const headers = await generateRequestSignature(body, apiKey);
  const response = await axios.post(
    `${BASE_URL}/auth/sign-in`,
    body, { headers: headers.headers }
  );
  return response.data;
};

export const getMe = async (): Promise<MeResponse> => {
  const headers = await generateRequestSignature({}, apiKey);
  const response = (await api.get(`/auth/me`, { headers: headers.headers })) as unknown as MeResponse;
  return response;
};
