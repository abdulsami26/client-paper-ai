import Login from "@/screens/login/login";
import SelectionForm from "@/screens/selection-form/form";
import ProtectedRoute from "./protected-route";
import PublicRoute from "./public-route";

export const routes = [
    {
        path: "/",
        element: (
            <PublicRoute>
                <Login />
            </PublicRoute>
        ),
    },
    {
        path: "/generate-paper",
        element: (
            <ProtectedRoute>
                <SelectionForm />
            </ProtectedRoute>
        ),
    },
];
