import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { X, ChevronDown, ChevronUp } from "lucide-react"
import { Label } from "./ui/label"

type SelectionStepProps = {
  form: any
  bookChapters: Record<string, string[]>
  selectedChapters: string[]
  selectedTopics: { chapter: string; topic: string }[]
  expandedChapters: string[]
  activeTabs: Record<string, string>
  handleChapterToggle: (chapter: string, checked: boolean) => void
  handleTopicToggle: (chapter: string, topic: string, checked: boolean) => void
  topicOptions: string[]
  books: string[]
  currentStep: number
}

const SelectionStep = ({
  form,
  bookChapters,
  selectedChapters,
  selectedTopics,
  handleChapterToggle,
  handleTopicToggle,
  topicOptions,
  books,
  currentStep,
}: SelectionStepProps) => {
  return (
    <>
      {currentStep === 1 && (
        <div className="grid md:grid-cols-2 grid-cols-1  gap-4">
          <FormField
            control={form.control}
            name="class"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class</FormLabel>
                <FormControl>
                  <Select onValueChange={(val) => {
                    field.onChange(val)
                    form.setValue("class", val)
                  }} defaultValue={field.value} >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="class-9">Class 9</SelectItem>
                      <SelectItem value="class-10">Class 10</SelectItem>
                      <SelectItem value="class-11">Class 11</SelectItem>
                      <SelectItem value="class-12">Class 12</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="book"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Book</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val)
                      form.setValue("book", val)
                    }}
                    defaultValue={field.value}
                    disabled={!form.watch("class")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Book" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="maths">Maths</SelectItem>
                      <SelectItem value="computer">Computer Science</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
      {currentStep === 2 && (
        <div>
          {form.watch("book") && (
            <div>
              <FormLabel>Chapters</FormLabel>
              <div className="flex flex-col gap-2 mt-2">
                {bookChapters[form.watch("book").toLowerCase()]?.map((chapter) => (
                  <label key={chapter} className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedChapters.includes(chapter)}
                      onCheckedChange={(checked) =>
                        handleChapterToggle(chapter, Boolean(checked))
                      }
                    />
                    <span>{chapter}</span>
                  </label>
                ))}
              </div>

              {/* Selected chapters */}
              {selectedChapters.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-4">
                  {selectedChapters.map((chapter) => (
                    <div
                      key={chapter}
                      className="flex items-center gap-1 px-2 py-1 rounded-full text-sm bg-gray-200 text-gray-700"
                    >
                      {chapter}
                      <button
                        type="button"
                        onClick={() => handleChapterToggle(chapter, false)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </>
  )
}

export default SelectionStep