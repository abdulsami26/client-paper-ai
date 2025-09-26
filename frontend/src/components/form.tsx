import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form as ShadForm,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useState } from "react"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { X, ChevronDown, ChevronUp } from "lucide-react"

const formSchema = z.object({
  class: z.string(),
  book: z.string(),
  chapters: z.array(z.string()),
  topics: z.array(
    z.object({
      chapter: z.string(),
      topic: z.string(),
    })
  ),
})

const bookChapters: Record<string, string[]> = {
  physics: ["Laws of Motion", "Energy", "Waves", "Optics"],
  chemistry: ["Atomic Structure", "Chemical Bonding", "Thermodynamics"],
  maths: ["Algebra", "Calculus", "Geometry"],
  computer: ["Programming Basics", "Data Structures", "Databases"],
}

const topicOptions = ["Definition", "Examples", "Derivation", "Numericals"]

const Form = () => {
  const [selectedChapters, setSelectedChapters] = useState<string[]>([])
  const [selectedTopics, setSelectedTopics] = useState<
    { chapter: string; topic: string }[]
  >([])
  const [activeChapter, setActiveChapter] = useState<string>("")
  const [expandedChapters, setExpandedChapters] = useState<string[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      class: "",
      book: "",
      chapters: [],
      topics: [],
    },
  })

  // toggle chapter selection
  const handleChapterToggle = (chapter: string, checked: boolean) => {
    let updated = [...selectedChapters]
    if (checked) {
      updated.push(chapter)
    } else {
      updated = updated.filter((c) => c !== chapter)
      setSelectedTopics((prev) => prev.filter((t) => t.chapter !== chapter))
      if (activeChapter === chapter) setActiveChapter("")
    }
    setSelectedChapters(updated)
    form.setValue("chapters", updated)
  }

  const handleRemoveChapter = (chapter: string) => {
    handleChapterToggle(chapter, false)
  }

  // toggle topic under chapter
  const handleTopicToggle = (chapter: string, topic: string, checked: boolean) => {
    let updated = [...selectedTopics]
    if (checked) {
      updated.push({ chapter, topic })
    } else {
      updated = updated.filter(
        (t) => !(t.chapter === chapter && t.topic === topic)
      )
    }
    setSelectedTopics(updated)
    form.setValue("topics", updated)
  }

  // expand/collapse
  const toggleExpand = (chapter: string) => {
    if (expandedChapters.includes(chapter)) {
      setExpandedChapters(expandedChapters.filter((c) => c !== chapter))
    } else {
      setExpandedChapters([...expandedChapters, chapter])
    }
  }

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form Data:", data)
  }

  return (
    <ShadForm {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Step 1: Class */}
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

        {/* Step 2: Book */}
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
                    setSelectedChapters([])
                    setSelectedTopics([])
                    setActiveChapter("")
                    setExpandedChapters([])
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

        {/* Step 3: Chapters */}
        {form.watch("book") && (
          <div className="space-y-2">
            <FormLabel>Chapters</FormLabel>

            {/* Chips */}
            <div className="flex gap-2 flex-wrap mt-2">
              {selectedChapters.map((chapter) => {
                const isActive = activeChapter === chapter
                return (
                  <div
                    key={chapter}
                    onClick={() => setActiveChapter(chapter)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm cursor-pointer transition
                    ${isActive ? "bg-blue-200 text-blue-800" : "bg-gray-200 text-gray-700"}`}
                  >
                    {chapter}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveChapter(chapter)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Chapter list checkboxes */}
            <div className="grid grid-cols-2 gap-2">
              {bookChapters[form.watch("book")]?.map((chapter) => (
                <div key={chapter} className="flex items-center gap-2">
                  <Checkbox
                    id={chapter}
                    checked={selectedChapters.includes(chapter)}
                    onCheckedChange={(checked) =>
                      handleChapterToggle(chapter, checked as boolean)
                    }
                  />
                  <label htmlFor={chapter}>{chapter}</label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Active Chapter Topics */}
        {activeChapter && (
          <div className="border rounded p-4 space-y-2">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleExpand(activeChapter)}
            >
              <p className="font-bold">{activeChapter} - Topics</p>
              {expandedChapters.includes(activeChapter) ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>

            {expandedChapters.includes(activeChapter) && (
              <div className="grid grid-cols-2 gap-2">
                {topicOptions.map((topic) => (
                  <div key={topic} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${activeChapter}-${topic}`}
                      checked={selectedTopics.some(
                        (t) => t.chapter === activeChapter && t.topic === topic
                      )}
                      onCheckedChange={(checked) =>
                        handleTopicToggle(activeChapter, topic, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`${activeChapter}-${topic}`}
                      className="text-sm"
                    >
                      {topic}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 5: Selected Topics */}
        {selectedTopics.length > 0 && (
          <div className="space-y-2">
            <FormLabel>Selected Topics</FormLabel>
            <div className="flex gap-2 flex-wrap">
              {selectedTopics.map((t, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
                >
                  {t.chapter}: {t.topic}
                </span>
              ))}
            </div>
          </div>
        )}

        <Button type="submit" className="bg-primary text-white">
          Next
        </Button>
      </form>
    </ShadForm>
  )
}

export default Form
