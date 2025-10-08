import { BASE_URL } from "@/constant/constant";
import axios from "axios";

export const login = async (token: string) => {
    const response = await axios.post(
        `${BASE_URL}/auth/sign-in`,
        { token },
        {
            headers: {
                "x-api-key": import.meta.env.VITE_API_KEY,
            },
        }
    );

    console.log(response.data);
    return response.data;
};

