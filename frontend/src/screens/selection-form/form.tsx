import { useState } from "react"
import StepForm from "@/components/StepForm"
import Striper from "@/components/striper"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useFormContext } from "react-hook-form"

export function SelectionForm() {
  const totalSteps = 6
  const [currentStep, setCurrentStep] = useState(1)

  const form = useFormContext?.()

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1)
    } else {
      console.log("📄 Generate Paper API call here...", form?.getValues())
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const isNextDisabled = () => {
    if (!form) return false
    const values = form.getValues()

    if (currentStep === 1) {
      return !values.class || !values.book
    }
    if (currentStep === 2) {
      return !values.chapters || values.chapters.length === 0
    }
    if (currentStep === 3) {
      return !values.topics || values.topics.length === 0
    }
    return false
  }

  return (
    <div className="p-5 text-center">
      <h1 className="text-3xl font-bold text-gray-800">Welcome to Paper AI</h1>
      <p className="text-base text-gray-600 mt-2 mb-6">
        Create exam papers instantly with the power of{" "}
        <span className="text-primary font-semibold">AI</span>. Just select your class and subject,
        and let AI design your paper for you!
      </p>

      <Card className="w-full max-w-[1440px] mx-auto shadow-lg p-0">
        <div className="flex items-center justify-between w-full border-b p-6 bg-gray-100 rounded-tl-xl rounded-tr-xl">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <Striper currentStep={currentStep} totalSteps={totalSteps} />
          </div>

          <div className="text-center">
            <h1 className="text-xl font-semibold">
              {currentStep === 1 && "Class and Subject"}
              {currentStep === 2 && "Chapter Selection"}
              {currentStep === 3 && "Topic Selection"}
              {currentStep === 4 && "Difficulty Selection"}
              {currentStep === 5 && "Paper Type"}
              {currentStep === 6 && "Generate Paper"}
            </h1>
            <p className="text-sm">
              {currentStep < totalSteps && (
                <>
                  Next:{" "}
                  <span className="font-medium text-primary">
                    {currentStep === 1 && "Chapter selection"}
                    {currentStep === 2 && "Topic selection"}
                    {currentStep === 3 && "Difficulty selection"}
                    {currentStep === 4 && "Paper type"}
                    {currentStep === 5 && "Generate Paper"}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        <CardContent className="space-y-6">
          <StepForm currentStep={currentStep} />
        </CardContent>

        <CardFooter className="flex justify-between border-t bg-gray-100 p-6">
          <Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 1}>
            Back
          </Button>

          {currentStep === totalSteps ? (
            <Button type="button" onClick={handleNext}>
              Generate Paper
            </Button>
          ) : (
            <Button type="button" onClick={handleNext} disabled={isNextDisabled()}>
              Next
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

export default SelectionForm
