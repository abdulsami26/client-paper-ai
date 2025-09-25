import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

import Striper from "@/components/striper"
import Form from "@/components/form"

export function SelectionForm() {

    return (
        <Card className="w-full max-w-3xl mx-auto shadow-lg">
            <CardHeader className="border-b">
                <Striper />
            </CardHeader>
            <CardContent className="space-y-6">
                <Form />
                <div className="flex items-center justify-end pt-4 border-t">
                    <Button>Next</Button>
                </div>
            </CardContent>
        </Card>
    )
}
