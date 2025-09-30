import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"

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
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Paper Options</h3>
      <div className="space-y-2">
        <h4 className="font-medium">Difficulty Level</h4>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="easy"
            checked={selectedDifficulty === "Easy"}
            onCheckedChange={() => setSelectedDifficulty("Easy")}
          />
          <Label htmlFor="easy">Easy</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="medium"
            checked={selectedDifficulty === "Medium"}
            onCheckedChange={() => setSelectedDifficulty("Medium")}
          />
          <Label htmlFor="medium">Medium</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="hard"
            checked={selectedDifficulty === "Hard"}
            onCheckedChange={() => setSelectedDifficulty("Hard")}
          />
          <Label htmlFor="hard">Hard</Label>
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium">Paper Type</h4>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="mcqs"
            checked={selectedPaperType === "Multiple Choice Questions"}
            onCheckedChange={() => setSelectedPaperType("Multiple Choice Questions")}
          />
          <Label htmlFor="mcqs">Multiple Choice Questions (MCQs)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="full"
            checked={selectedPaperType === "Full Question Paper"}
            onCheckedChange={() => setSelectedPaperType("Full Question Paper")}
          />
          <Label htmlFor="full">Full Question Paper</Label>
        </div>
      </div>
    </div>
  )
}

export default OptionsStep