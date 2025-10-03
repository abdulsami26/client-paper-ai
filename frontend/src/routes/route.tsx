import Login from "@/screens/login/login";
import SelectionForm from "@/screens/selection-form/form";


export const routes = [
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "/generate-paper",
        element: <SelectionForm />,
    },
]