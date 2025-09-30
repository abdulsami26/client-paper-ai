import { ChevronDown, ChevronUp } from "lucide-react"

type ConfirmationStepProps = {
  form: any,
  selectedChapters: string[]
  selectedTopics: { chapter: string; topic: string }[]
  expandedConfirmChapters: string[]
  toggleConfirmExpand: (chapter: string) => void
}

const ConfirmationStep = ({
  form,
  selectedChapters,
  selectedTopics,
  expandedConfirmChapters,
  toggleConfirmExpand,
}: ConfirmationStepProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Review Your Selections</h3>
      <div className="p-4 bg-white rounded-lg shadow border">
        <h4 className="font-medium">Content</h4>
        <p>Class: {form.watch("class").replace("class-", "Class ")}</p>
        <p>Book: {form.watch("book")}</p>
      </div>
      <div className="p-4 bg-white rounded-lg shadow border">
        <h4 className="font-medium">Options</h4>
        <p>Difficulty: {form.watch("difficulty") || "Not selected"}</p>
        <p>Paper Type: {form.watch("paperType") || "Not selected"}</p>
      </div>
      <div className="p-4 bg-white rounded-lg shadow border">
        <h4 className="font-medium">Selected Chapters and Topics</h4>
        {selectedChapters.map((chapter: string) => {
          const chapterTopics = selectedTopics.filter((t) => t.chapter === chapter)
          return (
            <div key={chapter} className="border-b last:border-b-0">
              <div
                className="flex items-center justify-between p-2 cursor-pointer bg-gray-50"
                onClick={() => toggleConfirmExpand(chapter)}
              >
                <p className="font-semibold">{chapter}</p>
                {expandedConfirmChapters.includes(chapter) ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
              {expandedConfirmChapters.includes(chapter) && (
                <div className="p-2 space-y-1">
                  {chapterTopics.length > 0 ? (
                    chapterTopics.map((t, idx) => (
                      <p key={idx} className="text-sm text-gray-700">
                        {t.chapter}: {t.topic}
                      </p>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No topics selected</p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ConfirmationStep