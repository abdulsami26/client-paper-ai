interface StriperProps {
  currentStep: number
  totalSteps: number
}

const Striper = ({ currentStep, totalSteps }: StriperProps) => {
  const radius = 45
  const strokeWidth = 6
  const circumference = 2 * Math.PI * radius
  const progress = (currentStep / totalSteps) * circumference
  const percentage = Math.round((currentStep / totalSteps) * 100)

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-24 h-24 sm:w-32 sm:h-32">
        {/* Background glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />

        <svg className="transform -rotate-90 w-full h-full drop-shadow-lg" viewBox="0 0 100 100">
          {/* Background circle with subtle gradient */}
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>

          {/* Base circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="transition-all duration-300"
          />

          {/* Progress circle with gradient */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out drop-shadow-md"
          />
        </svg>

        {/* Center content with improved styling */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center">
            <p className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              {percentage}%
            </p>
            <span className="text-xs sm:text-sm text-slate-500 font-semibold block mt-1">
              Step {currentStep}/{totalSteps}
            </span>
          </div>
        </div>
      </div>

      {/* Progress label below indicator */}
      <div className="mt-4 text-center">
        <p className="text-xs sm:text-sm font-medium text-slate-600">
          {currentStep === totalSteps
            ? "Ready to generate"
            : `${totalSteps - currentStep} step${totalSteps - currentStep !== 1 ? "s" : ""} remaining`}
        </p>
      </div>
    </div>
  )
}

export default Striper
