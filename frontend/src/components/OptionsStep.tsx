import { FormLabel } from "./ui/form";
import { Zap } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { FormData } from "./StepForm";

type OptionsStepProps = {
  form: UseFormReturn<FormData>;
};

const OptionsStep = ({ form }: OptionsStepProps) => {
  const difficultyOptions = [
    { id: "easy", label: "Easy", icon: "🟢", description: "Basic concepts" },
    { id: "medium", label: "Medium", icon: "🟡", description: "Intermediate" },
    { id: "hard", label: "Hard", icon: "🔴", description: "Advanced" },
  ];

  const selected = form.watch("difficulty");

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="w-full">
        <FormLabel className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-3">
          <Zap className="w-5 h-5 text-indigo-600" />
          Select Difficulty Level
        </FormLabel>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {difficultyOptions.map(({ id, label, icon, description }) => {
            const active = selected === label;
            return (
              <button
                type="button"
                key={id}
                onClick={() => form.setValue("difficulty", label)}
                className={`relative flex flex-col items-start gap-1.5 border-2 rounded-2xl px-3 py-3 sm:px-4 sm:py-4 text-left transition-all active:scale-[0.98] ${
                  active
                    ? "border-indigo-500 bg-indigo-50 shadow-md"
                    : "border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm"
                }`}
              >
                {active && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
                <span className="text-2xl sm:text-3xl leading-none">{icon}</span>
                <span className="font-semibold text-sm sm:text-base text-slate-900">
                  {label}
                </span>
                <p className="text-[11px] sm:text-xs text-slate-500 leading-tight">
                  {description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OptionsStep;
