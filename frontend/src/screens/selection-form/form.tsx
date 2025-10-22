import { useEffect, useState } from "react"
import Striper from "@/components/striper"
import { Button } from "@/components/ui/button"
import { useFormContext } from "react-hook-form"
import { googleLogout } from "@react-oauth/google"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { LogOut, ChevronLeft, ChevronRight } from "lucide-react"
import StepForm from "@/components/StepForm"

export function SelectionForm() {
  const navigate = useNavigate()
  const totalSteps = 6
  const [currentStep, setCurrentStep] = useState(1)
  const { user, setUser } = useAuth()
  const form = useFormContext?.()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      navigate("/")
    }
  }, [setUser, navigate])

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

    if (currentStep === 1) return !values.class || !values.book
    if (currentStep === 2) return !values.chapters || values.chapters.length === 0
    if (currentStep === 3) return !values.topics || values.topics.length === 0
    return false
  }

  const handleLogout = () => {
    googleLogout()
    localStorage.removeItem("user")
    sessionStorage.clear()
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`)
    })
    setUser(null)
    toast.success("You have been logged out successfully!")
    setTimeout(() => {
      navigate("/")
    }, 300)
  }

  const stepTitles = [
    "Class and Subject",
    "Chapter Selection",
    "Topic Selection",
    "Difficulty Selection",
    "Paper Type",
    "Generate Paper",
  ]

  const stepDescriptions = [
    "Select your class and subject",
    "Choose chapters to include",
    "Pick topics to focus on",
    "Set difficulty level",
    "Choose paper format",
    "Review and generate",
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5">
          <div className="flex items-center justify-between gap-3 sm:gap-4 lg:gap-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-slate-900 truncate">
                Hello, <span className="text-indigo-600">{user?.name || "Guest"}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 hidden sm:block mt-0.5">
                Let's create your perfect exam paper
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <div className="hidden sm:flex items-center gap-2 lg:gap-3">
                <p className="text-sm lg:text-base font-medium text-slate-700">{user?.name || "User"}</p>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full overflow-hidden ring-2 ring-indigo-200 flex-shrink-0">
                <img
                  src={
                    user?.picture ||
                    "https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png"
                  }
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm lg:text-base font-medium px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 rounded-lg transition-colors duration-200 min-h-10 sm:min-h-10 lg:min-h-11"
                title="Logout"
              >
                <LogOut className="w-4 text-indigo-600 h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-10 h-[calc(100vh-64px)]">
        <div className="w-full max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-slate-200 md:p-4 p-2">
              <div className="flex gap-5 w-full">
                <div className="flex-shrink-0">
                  <Striper currentStep={currentStep} totalSteps={totalSteps} />
                </div>

                <div className="flex w-full justify-center md:justify-end items-center">
                  <div>

                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
                      {stepTitles[currentStep - 1]}
                    </h1>
                    <p className="text-sm sm:text-base text-slate-600 mt-1 lg:mt-2">
                      {stepDescriptions[currentStep - 1]}
                    </p>
                    {currentStep < totalSteps && (
                      <p className="text-xs sm:text-sm text-indigo-600 font-medium mt-2 lg:mt-3">
                        Next: {stepTitles[currentStep]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 lg:p-8 h-[330px]">
              <StepForm currentStep={currentStep} />
            </div>
          </div>
        </div>
      </main>

      <footer className="sticky bottom-0 bg-white border-t border-slate-200 shadow-lg">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5">
          <div className="flex gap-2 sm:gap-3 lg:gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex-1 sm:flex-none gap-2 bg-transparent h-10 sm:h-11 lg:h-12 text-sm sm:text-base"
            >
              <ChevronLeft className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">Back</span>
            </Button>

            <div className="flex-1" />

            {currentStep === totalSteps ? (
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1 sm:flex-none gap-2 bg-indigo-600 hover:bg-indigo-700 h-10 sm:h-11 lg:h-12 text-sm sm:text-base"
              >
                <span>Generate Paper</span>
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNext}
                disabled={isNextDisabled()}
                className="flex-1 sm:flex-none gap-2 bg-indigo-600 hover:bg-indigo-700 h-10 sm:h-11 lg:h-12 text-sm sm:text-base"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
              </Button>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}

export default SelectionForm
