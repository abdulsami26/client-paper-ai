import { useForm } from "react-hook-form"
import { Form as ShadForm } from "./ui/form"
import SelectionStep from "./SelectionStep"

export interface FormData {
  class: string
  book: string
  chapters: number[]
  topics: { chapterID: number; topicID: number }[]
  difficulty: string
  paperType: string
}

const StepForm = ({ currentStep }: { currentStep: number }) => {

  const form = useForm<FormData>({
    defaultValues: {
      class: "",
      book: "",
      chapters: [],
      topics: [],
      difficulty: "",
      paperType: "",
    },
  })


  // const onSubmit = (data: z.infer<typeof formSchema>) => {
  //   console.log("onSubmit triggered with data:", data, "Form Valid:", form.formState.isValid)
  //   if (form.formState.isValid) {
  //     console.log("Form is valid, modal not opened. Errors:", form.formState.errors)
  //   }
  // }


  return (
    <ShadForm {...form}>
      <form className="space-y-8">
        <SelectionStep form={form} currentStep={currentStep} />
      </form>
    </ShadForm>
  )
}

export default StepForm