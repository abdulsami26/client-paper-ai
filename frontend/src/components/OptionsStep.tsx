
import { FormLabel } from "./ui/form"
import { Zap, FileText, BookMarked } from "lucide-react"
import type { UseFormReturn } from "react-hook-form";
import type { FormData } from "./StepForm";
import { Button } from "./ui/button";

type OptionsStepProps = {
  form: UseFormReturn<FormData>;
}

const OptionsStep = ({ form }: OptionsStepProps) => {
  const difficultyOptions = [
    { id: "easy", label: "Easy", icon: "🟢", description: "Basic concepts" },
    { id: "medium", label: "Medium", icon: "🟡", description: "Intermediate level" },
    { id: "hard", label: "Hard", icon: "🔴", description: "Advanced topics" },
  ]


  const paperTypeOptions = [
    {
      id: "mcqs",
      label: "MCQs",
      value: "Multiple Choice Questions",
      icon: BookMarked,
      description: "Multiple choice format",
    },
    {
      id: "full",
      label: "Full Paper",
      value: "Full Question Paper",
      icon: FileText,
      description: "Complete question paper",
    },
  ]

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Difficulty Section */}
      <div className="w-full">
        <FormLabel className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-3 sm:mb-4">
          <Zap className="w-5 h-5 text-indigo-600" />
          Select Difficulty Level
        </FormLabel>

        {/* Scrollable container on mobile */}
        <div className="flex sm:grid sm:grid-cols-3 gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
          {difficultyOptions.map(({ id, label, icon, description }) => (
            <Button
              type="button"
              key={id}
              onClick={() => form.setValue("difficulty", label)}
              className={`relative flex-shrink-0 w-[160px] h-20 sm:w-auto flex flex-col items-start gap-2 border-2 rounded-lg px-3 py-3 cursor-pointer transition-all duration-200 group ${form.watch("difficulty") === label
                  ? "border-indigo-500 bg-indigo-50 shadow-md"
                  : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50 hover:shadow-sm"
                }`}
            >
              {form.watch("difficulty") === label && (
                <div className="absolute top-2 right-2 w-4 h-4 sm:w-5 sm:h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl">{icon}</span>
                <span className="font-semibold text-sm sm:text-base text-slate-900">{label}</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600">{description}</p>
            </Button>
          ))}
        </div>
      </div>

      {/* Paper Type Section */}
      <div className="w-full">
        <FormLabel className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-3 sm:mb-4">
          <FileText className="w-5 h-5 text-indigo-600" />
          Select Paper Type
        </FormLabel>

        {/* Scrollable container on mobile */}
        <div className="flex sm:grid sm:grid-cols-2 gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
          {paperTypeOptions.map(({ id, label, value, icon: Icon, description }) => (
            <Button
              type="button"
              key={id}
              onClick={() => form.setValue("paperType", value)}
              className={`relative flex-shrink-0 w-[180px] h-20 sm:w-auto flex flex-col items-start gap-2 border-2 rounded-lg px-3 py-3 cursor-pointer transition-all duration-200 group ${form.watch("paperType") === value
                  ? "border-indigo-500 bg-indigo-50 shadow-md"
                  : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50 hover:shadow-sm"
                }`}
            >
              {form.watch("paperType") === value && (
                <div className="absolute top-2 right-2 w-4 h-4 sm:w-5 sm:h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                <span className="font-semibold text-sm sm:text-base text-slate-900">{label}</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600">{description}</p>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default OptionsStep
