
import StepForm from "@/components/StepForm"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function SelectionForm() {
  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader className="border-b">
        {/* Striper component ko hata diya gaya */}
      </CardHeader>
      <CardContent className="space-y-6">
        <StepForm />
      </CardContent>
    </Card>
  )
}

export default SelectionForm