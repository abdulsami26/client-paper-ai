import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { X, ChevronDown, ChevronUp } from "lucide-react"
import { Label } from "./ui/label"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel"
import { useState } from "react"

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

  const [activeTab, setActiveTab] = useState<string | null>(null)
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                {bookChapters[form.watch("book").toLowerCase()]?.map((chapter) => (
                  <label
                    key={chapter}
                    className="flex items-center gap-2 border rounded-md px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  >
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

              {/* {selectedChapters.length > 0 && (
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
              )} */}
            </div>
          )}
        </div>
      )}

{currentStep === 3 && (
  <div className="w-full">
    <Carousel opts={{ align: "start" }} className="w-full">
      <CarouselContent>
        {selectedChapters.map((chapter: string) => {
          const chapterTopics = selectedTopics.filter((t) => t.chapter === chapter)
          return (
            <CarouselItem
              key={chapter}
              className="basis-full md:basis-1/2 lg:basis-1/3"
            >
              <div className="border rounded-lg p-4 shadow-sm bg-white h-full flex flex-col">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-lg">{chapter} - Topics</p>
                </div>

                {/* Topic Options */}
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {topicOptions.map((topic: string) => (
                    <div key={topic} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${chapter}-${topic}`}
                        checked={selectedTopics.some(
                          (t) => t.chapter === chapter && t.topic === topic
                        )}
                        onCheckedChange={(checked) =>
                          handleTopicToggle(chapter, topic, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`${chapter}-${topic}`}
                        className="text-sm"
                      >
                        {topic}
                      </Label>
                    </div>
                  ))}
                </div>

                {/* Tabs Area */}
                {chapterTopics.length > 0 && (
                  <div className="mt-4 flex flex-col flex-grow">
                    <div className="flex gap-2 border-b pb-2 overflow-x-auto">
                      {topicOptions.map((tab: string) => {
                        const isAllowed = chapterTopics.some((t) => t.topic === tab)
                        return (
                          <Button
                            key={tab}
                            type="button"
                            size="sm"
                            variant={activeTab === tab ? "default" : "outline"}
                            disabled={!isAllowed}
                            onClick={() => setActiveTab(tab)}
                          >
                            {tab}
                          </Button>
                        )
                      })}
                    </div>

                    <div className="p-3 border rounded bg-gray-50 mt-3 flex-grow">
                      {activeTab ? (
                        <p className="text-sm text-gray-700">
                          Showing <strong>{activeTab}</strong> content for{" "}
                          <strong>{chapter}</strong>.
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400">
                          Select a tab to see content
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CarouselItem>
          )
        })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </div>
)}

    </>
  )
}

export default SelectionStep