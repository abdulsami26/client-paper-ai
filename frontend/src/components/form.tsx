// 🔹 Changes:
//  - Single chapter select (radio type behavior).
//  - Topics linked to selected chapter.
//  - Card for each chapter with its topics.

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
import {EditIcon, TrashIcon } from "lucide-react"
import { Checkbox } from "./ui/checkbox"
import { Input } from "./ui/input"
import { Card, CardTitle } from "./ui/card"

const formSchema = z.object({
  class: z.string(),
  book: z.string(),
  chapters: z.array(
    z.object({
      name: z.string(),
      topics: z.array(
        z.object({
          name: z.string(),
          contents: z.array(z.string()),
        })
      ),
    })
  ),
})

const bookChapters: Record<string, string[]> = {
  physics: ["Laws of Motion", "Energy", "Waves", "Optics"],
  chemistry: ["Atomic Structure", "Chemical Bonding", "Thermodynamics"],
  maths: ["Algebra", "Calculus", "Geometry"],
  computer: ["Programming Basics", "Data Structures", "Databases"],
}

const Form = () => {
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null)
  const [chaptersData, setChaptersData] = useState<
    { name: string; topics: { name: string; contents: string[] }[] }[]
  >([])
  const [topicInput, setTopicInput] = useState("")
  const [editIndex, setEditIndex] = useState<number | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      class: "",
      book: "",
      chapters: [],
    },
  })

  // handle chapter select (only 1 at a time)
  const handleChapterSelect = (chapter: string) => {
    setSelectedChapter(chapter)
  }

  // add or edit topic under selected chapter
  const handleAddTopic = () => {
    if (!topicInput.trim() || !selectedChapter) return

    const updatedChapters = [...chaptersData]
    const chapterIndex = updatedChapters.findIndex((c) => c.name === selectedChapter)

    if (chapterIndex === -1) {
      // new chapter with first topic
      updatedChapters.push({
        name: selectedChapter,
        topics: [{ name: topicInput.trim(), contents: [] }],
      })
    } else {
      if (editIndex !== null) {
        // edit topic
        updatedChapters[chapterIndex].topics[editIndex].name = topicInput.trim()
        setEditIndex(null)
      } else {
        // add topic
        updatedChapters[chapterIndex].topics.push({ name: topicInput.trim(), contents: [] })
      }
    }

    setChaptersData(updatedChapters)
    form.setValue("chapters", updatedChapters)
    setTopicInput("")
  }

  // edit topic
  const handleEditTopic = (chapterName: string, index: number) => {
    setSelectedChapter(chapterName)
    const chapter = chaptersData.find((c) => c.name === chapterName)
    if (chapter) {
      setTopicInput(chapter.topics[index].name)
      setEditIndex(index)
    }
  }

  // delete topic
  const handleDeleteTopic = (chapterName: string, index: number) => {
    const updatedChapters = chaptersData.map((c) =>
      c.name === chapterName
        ? { ...c, topics: c.topics.filter((_, i) => i !== index) }
        : c
    )
    setChaptersData(updatedChapters)
    form.setValue("chapters", updatedChapters)
  }

  // handle topic content change
  const handleTopicContentChange = (
    chapterName: string,
    topicName: string,
    content: string,
    checked: boolean
  ) => {
    const updatedChapters = chaptersData.map((c) =>
      c.name === chapterName
        ? {
            ...c,
            topics: c.topics.map((t) =>
              t.name === topicName
                ? {
                    ...t,
                    contents: checked
                      ? [...t.contents, content]
                      : t.contents.filter((c) => c !== content),
                  }
                : t
            ),
          }
        : c
    )
    setChaptersData(updatedChapters)
    form.setValue("chapters", updatedChapters)
  }

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form Data:", data)
  }

  return (
    <ShadForm {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CardTitle className="text-xl font-bold">Select Content</CardTitle>

        {/* Class Dropdown */}
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

        {/* Book Dropdown */}
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
                    setSelectedChapter(null)
                    setChaptersData([])
                    form.setValue("chapters", [])
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

        {/* Single Chapter Selection */}
        {form.watch("book") && (
          <div className="space-y-2">
            <FormLabel>Chapter</FormLabel>
            <div className="grid grid-cols-2 gap-2">
              {bookChapters[form.watch("book")]?.map((chapter) => (
                <Button
                  key={chapter}
                  type="button"
                  variant={selectedChapter === chapter ? "default" : "outline"}
                  onClick={() => handleChapterSelect(chapter)}
                >
                  {chapter}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Topics Section (only if a chapter selected) */}
        {selectedChapter && (
          <div className="space-y-4">
            <FormLabel>Topics for {selectedChapter}</FormLabel>
            <div className="flex gap-2">
              <Input
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="Enter Topic Name"
              />
              <Button type="button" onClick={handleAddTopic}>
                {editIndex !== null ? "Update" : "Add"}
              </Button>
            </div>
          </div>
        )}

        {/* Chapters with Topics */}
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {chaptersData.map((chapter) => (
            <Card key={chapter.name} className="p-4">
              <p className="font-bold mb-2">{chapter.name}</p>
              {chapter.topics.map((topic, index) => (
                <div key={topic.name} className="border p-2 rounded-md space-y-2 mb-2">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{topic.name}</p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEditTopic(chapter.name, index)}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteTopic(chapter.name, index)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {["Definition", "Examples", "Derivation", "Numericals"].map((opt) => (
                      <div key={opt} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${chapter.name}-${topic.name}-${opt}`}
                          checked={topic.contents.includes(opt)}
                          onCheckedChange={(checked) =>
                            handleTopicContentChange(chapter.name, topic.name, opt, checked as boolean)
                          }
                        />
                        <label htmlFor={`${chapter.name}-${topic.name}-${opt}`} className="text-sm">
                          {opt}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </Card>
          ))}
        </div>

        {/* <Button type="submit" className="bg-primary text-white">
          Submit
        </Button> */}
      </form>
    </ShadForm>
  )
}

export default Form
