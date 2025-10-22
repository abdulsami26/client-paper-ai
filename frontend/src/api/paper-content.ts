// import axios from "axios";
// import { BASE_URL } from "@/constant/constant";
// import { generateRequestSignature } from "@/utility";

// const apiKey = import.meta.env.VITE_API_KEY;

// // export type LoginResponse = {
// //   status: boolean,
// //   user: {
// //     id: number;
// //     name: string;
// //     email: string;
// //     sub: string;
// //     picture: string;
// //   };
// //   token: string;
// //   expiresAt: string;
// // };       

// export const getAllClasses = async (): Promise<any> => {
//     const headers = await generateRequestSignature({}, apiKey);  
//     const response = await axios.get(
//         `${BASE_URL}/public/class`,
//         { headers: headers.headers }
//     );
//     return response.data;
// };
