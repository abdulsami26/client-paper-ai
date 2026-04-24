import { Check } from "lucide-react"

interface StriperProps {
  currentStep: number
  totalSteps: number
}

const Striper = ({ currentStep, totalSteps }: StriperProps) => {
  return (
    <div className="w-full flex items-center">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const step = i + 1
        const isCompleted = step < currentStep
        const isActive = step === currentStep
        const isLast = step === totalSteps

        return (
          <div
            key={step}
            className={`flex items-center ${isLast ? "" : "flex-1"}`}
          >
            <div
              className={`relative flex items-center justify-center rounded-full shrink-0 transition-all duration-300 ${
                isActive
                  ? "w-8 h-8 bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-md shadow-indigo-600/20"
                  : isCompleted
                    ? "w-7 h-7 bg-indigo-600 text-white"
                    : "w-7 h-7 bg-white text-slate-400 border-2 border-slate-200"
              }`}
            >
              {isCompleted ? (
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
              ) : (
                <span className="text-xs font-bold">{step}</span>
              )}
            </div>

            {!isLast && (
              <div className="flex-1 h-0.5 mx-1 sm:mx-2 bg-slate-200 relative overflow-hidden rounded-full">
                <div
                  className="absolute inset-y-0 left-0 bg-indigo-600 transition-all duration-500 ease-out"
                  style={{ width: isCompleted ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default Striper
