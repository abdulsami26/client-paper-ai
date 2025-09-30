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
  toggleExpand: (chapter: string) => void
  topicOptions: string[]
}

const SelectionStep = ({
  form,
  bookChapters,
  selectedChapters,
  selectedTopics,
  expandedChapters,
  activeTabs,
  handleChapterToggle,
  handleTopicToggle,
  toggleExpand,
  topicOptions,
}: SelectionStepProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="class"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Class</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
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
                  form.setValue("chapters", [])
                  form.setValue("topics", [])
                }}
                defaultValue={field.value}
              >
                <SelectTrigger className="w-[180px]">
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
      {form.watch("book") && (
        <div className="space-y-2">
          <FormLabel>Chapters</FormLabel>
          <div className="flex gap-2 flex-wrap mt-2">
            {selectedChapters.map((chapter: string) => (
              <div
                key={chapter}
                className="flex items-center gap-1 px-2 py-1 rounded-full text-sm bg-gray-200 text-gray-700"
              >
                {chapter}
                <button type="button" onClick={() => handleChapterToggle(chapter, false)}>
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {bookChapters[form.watch("book")]?.map((chapter: string) => (
              <div key={chapter} className="flex items-center gap-2">
                <Checkbox
                  id={chapter}
                  checked={selectedChapters.includes(chapter)}
                  onCheckedChange={(checked) => handleChapterToggle(chapter, checked as boolean)}
                />
                <label htmlFor={chapter}>{chapter}</label>
              </div>
            ))}
          </div>
        </div>
      )}
      {selectedChapters.length > 0 && (
        <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
          {selectedChapters.map((chapter: string) => {
            const chapterTopics = selectedTopics.filter((t) => t.chapter === chapter)
            return (
              <div key={chapter} className="border rounded-lg p-4 shadow-sm bg-white">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleExpand(chapter)}
                >
                  <p className="font-bold text-lg">{chapter} - Topics</p>
                  {expandedChapters.includes(chapter) ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
                {expandedChapters.includes(chapter) && (
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {topicOptions.map((topic: string) => (
                      <div key={topic} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${chapter}-${topic}`}
                          checked={selectedTopics.some((t) => t.chapter === chapter && t.topic === topic)}
                          onCheckedChange={(checked) => handleTopicToggle(chapter, topic, checked as boolean)}
                        />
                        <Label htmlFor={`${chapter}-${topic}`} className="text-sm">
                          {topic}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
                {chapterTopics.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <div className="flex gap-4 border-b pb-2 overflow-x-auto">
                      {topicOptions.map((tab: string) => {
                        const isAllowed = chapterTopics.some((t) => t.topic === tab)
                        return (
                          <Button
                            key={tab}
                            type="button"
                            disabled={!isAllowed}
                            onClick={() => setActiveTabs((prev) => ({ ...prev, [chapter]: tab }))}
                            className={`px-3 py-1 text-sm font-medium border-b-2 transition
                              ${activeTabs[chapter] === tab ? "border-b-purple-950" : "border-transparent"}
                              ${!isAllowed ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            {tab}
                          </Button>
                        )
                      })}
                    </div>
                    <div className="p-4 border rounded bg-gray-50">
                      {(() => {
                        const activeSelection = chapterTopics.find((t) => t.topic === activeTabs[chapter])
                        if (!activeSelection) {
                          return <p className="text-sm text-gray-500">Select a topic tab to see content</p>
                        }
                        return (
                          <>
                            <p className="font-semibold text-gray-800">{chapter} → {activeTabs[chapter]}</p>
                            <p className="mt-2 text-sm text-gray-700">
                              Showing <strong>{activeTabs[chapter]}</strong> content for <strong>{chapter}</strong> chapter.
                            </p>
                          </>
                        )
                      })()}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
      {selectedTopics.length > 0 && (
        <div className="space-y-2">
          <FormLabel>Selected Topics</FormLabel>
          <div className="flex gap-2 flex-wrap">
            {selectedTopics.map((t: { chapter: string; topic: string }, idx: number) => (
              <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                {t.chapter}: {t.topic}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default SelectionStep