import { Checkbox } from "./ui/checkbox"
import { FormLabel } from "./ui/form"
type OptionsStepProps = {
  selectedDifficulty: string
  selectedPaperType: string
  setSelectedDifficulty: (value: string) => void
  setSelectedPaperType: (value: string) => void
}

const OptionsStep = ({
  selectedDifficulty,
  selectedPaperType,
  setSelectedDifficulty,
  setSelectedPaperType,
}: OptionsStepProps) => {
  return (
    <div className="w-full flex flex-col space-y-10 mt-6">
      {/* Difficulty Section */}
      <div className="w-full max-w-4xl">
        {/* <h3 className="text-lg font-semibold text-gray-800 mb-3">Select Difficulty</h3> */}
        <FormLabel>Select Difficulty</FormLabel>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          {["Easy", "Medium", "Hard"].map((level) => (
            <label
              key={level}
              className="flex items-center gap-2  border rounded-md px-3 py-2 cursor-pointer hover:bg-gray-50"
            >
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedDifficulty === level}
                  onCheckedChange={() => setSelectedDifficulty(level)}
                />
                <span className="font-medium text-[14px]">{level}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Paper Type Section */}
      <div className="w-full max-w-4xl">
        <FormLabel>Select Paper Type</FormLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          {[
            { id: "mcqs", label: "MCQs", value: "Multiple Choice Questions" },
            { id: "full", label: "Full Paper", value: "Full Question Paper" },
          ].map(({ id, label, value }) => (
            <label
              key={id}
              className="flex items-center gap-2  border rounded-md px-3 py-2 cursor-pointer hover:bg-gray-50"
            >
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={id}
                  checked={selectedPaperType === value}
                  onCheckedChange={() => setSelectedPaperType(value)}
                />
                <span className="font-medium text-[14px]">{label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

export default OptionsStep
