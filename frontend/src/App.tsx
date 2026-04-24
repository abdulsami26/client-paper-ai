import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes/route";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "@/context/AuthProvider";
import MobileOnly from "@/components/MobileOnly";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});


function App() {
  const router = createBrowserRouter(routes);

  return (
    <MobileOnly>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </MobileOnly>
  );
}

export default App
