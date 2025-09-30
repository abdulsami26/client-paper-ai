interface StriperProps {
  currentStep: number
  totalSteps: number
}

const Striper = ({ currentStep, totalSteps }: StriperProps) => {
  const steps = [
    { label: "Selection", step: 1 },
    { label: "Options", step: 2 },
    { label: "Confirmation", step: 3 },
  ]

  return (
    <div className="flex items-start justify-between mb-4">
      {steps.map((step, index) => (
        <div key={step.step} className="flex flex-col items-center space-y-2">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
              currentStep === step.step
                ? "bg-black text-white"
                : currentStep > step.step
                ? "bg-gray-300 text-gray-700"
                : "border border-gray-300 text-gray-500"
            }`}
          >
            {step.step}
          </div>
          <span
            className={`text-sm ${
              currentStep >= step.step ? "text-gray-800" : "text-gray-400"
            }`}
          >
            {step.label}
          </span>
          {index < totalSteps - 1 && (
            <div className="flex-1 flex items-center justify-center h-4 mt-2">
              <div
                className={`w-full border-t ${
                  currentStep > step.step ? "border-gray-800" : "border-gray-300"
                }`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default Striper