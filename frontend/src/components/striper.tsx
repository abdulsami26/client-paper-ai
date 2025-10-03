interface StriperProps {
  currentStep: number
  totalSteps: number
}

const Striper = ({ currentStep, totalSteps }: StriperProps) => {
  const radius = 40
  const strokeWidth = 8
  const circumference = 2 * Math.PI * radius
  const progress = (currentStep / totalSteps) * circumference

  return (
    <div className="flex flex-col items-center justify-center">
      <svg
        className="transform -rotate-90"
        width={100}
        height={100}
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#e5e7eb" // gray-200
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#6366f1" // violet-500
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <p className="text-lg font-bold text-violet-600">
          {Math.round((currentStep / totalSteps) * 100)}%
        </p>
        <span className="text-xs text-gray-500">
          Step {currentStep}/{totalSteps}
        </span>
      </div>
    </div>
  )
}

export default Striper
