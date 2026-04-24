import type { UseFormReturn } from "react-hook-form"
import { Form as ShadForm } from "./ui/form"
import SelectionStep from "./SelectionStep"
import type { GeneratePaperApi } from "@/screens/selection-form/form"

export interface FormData {
  class: string
  book: string
  subject: string
  chapters: number[]
  topics: { chapterID: number; topicID: number; is_qa: ("MCQ" | "SHORT" | "LONG")[] }[]
  difficulty: string
}

type StepFormProps = {
  currentStep: number
  form: UseFormReturn<FormData>
  onGenApiChange?: (api: GeneratePaperApi | null) => void
}

const StepForm = ({ currentStep, form, onGenApiChange }: StepFormProps) => {
  return (
    <ShadForm {...form}>
      <form className="space-y-8">
        <SelectionStep form={form} currentStep={currentStep} onGenApiChange={onGenApiChange} />
      </form>
    </ShadForm>
  )
}

export default StepForm
