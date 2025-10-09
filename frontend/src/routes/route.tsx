import Login from "@/screens/login/login";
import SelectionForm from "@/screens/selection-form/form";
import ProtectedRoute from "./protected-route";


export const routes = [
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "/generate-paper",
        element: <ProtectedRoute>
            <SelectionForm />
        </ProtectedRoute>,
    },
]