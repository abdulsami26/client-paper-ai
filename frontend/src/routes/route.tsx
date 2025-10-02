import Layout from "@/screens/dashboard/layout";
import SelectionForm from "@/screens/dashboard/selection-form/form";
import Login from "@/screens/login/login";


export const routes = [
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "/dashboard",
        element: <Layout />,
        children: [
            {
                path: "generate-paper",
                element: <SelectionForm />,
            },
            {
                path: "generate-paper",
                element: <SelectionForm />,
            }
        ]
    }
]