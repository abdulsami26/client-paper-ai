"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form as ShadForm } from "./ui/form"
import { useState } from "react"
import { Button } from "./ui/button"
import SelectionStep from "./SelectionStep"
import OptionsStep from "./OptionsStep"
import ConfirmationStep from "./ConfirmationStep"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"

type Topic = {
  chapter: string
  topic: string
}

const formSchema = z.object({
  class: z.string().min(1, "Class is required"),
  book: z.string().min(1, "Book is required"),
  chapters: z.array(z.string()).min(1, "At least one chapter is required"),
  topics: z.array(z.object({ chapter: z.string(), topic: z.string() })).min(1, "At least one topic is required"),
  difficulty: z.string().optional(),
  paperType: z.string().optional(),
})

const bookChapters = {
  physics: ["Laws of Motion", "Energy", "Waves", "Optics"],
  chemistry: ["Atomic Structure", "Chemical Bonding", "Thermodynamics"],
  maths: ["Algebra", "Calculus", "Geometry"],
  computer: ["Programming Basics", "Data Structures", "Databases"],
}

const topicOptions = ["Definition", "Examples", "Derivation", "Numericals"]

const StepForm = ({ currentStep }: { currentStep: number }) => {
  const [selectedChapters, setSelectedChapters] = useState<string[]>([])
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([])
  const [expandedChapters, setExpandedChapters] = useState<string[]>([])
  const [activeTabs, setActiveTabs] = useState<Record<string, string>>({})
  // const [selectedDifficulty, setSelectedDifficulty] = useState<string>("")
  // const [selectedPaperType, setSelectedPaperType] = useState<string>("")
  // const [expandedConfirmChapters, setExpandedConfirmChapters] = useState<string[]>([])
  // const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [books, setBooks] = useState<string[]>(["Physics", "Chemistry", "Maths", "Computer"])
  const [chapters, setChapters] = useState<string[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      class: "",
      book: "",
      chapters: [],
      topics: [],
      difficulty: "",
      paperType: "",
    },
  })

  //   useEffect(() => {
  //     // Sync form values with state
  //     form.setValue("chapters", selectedChapters)
  //     form.setValue("topics", selectedTopics)
  //     form.setValue("difficulty", selectedDifficulty)
  //     form.setValue("paperType", selectedPaperType)
  //     console.log("isModalOpen changed to:", isModalOpen, "Current Step:", currentStep, "Form Valid:", form.formState.isValid)
  //   }, [selectedChapters, selectedTopics, selectedDifficulty, selectedPaperType, currentStep, isModalOpen])

  const handleChapterToggle = (chapter: string, checked: boolean) => {
    let updated = [...selectedChapters]
    if (checked) {
      updated.push(chapter)
    } else {
      updated = updated.filter((c) => c !== chapter)
      setSelectedTopics((prev) => prev.filter((t) => t.chapter !== chapter))
      const tabsCopy = { ...activeTabs }
      delete tabsCopy[chapter]
      setActiveTabs(tabsCopy)
    }
    setSelectedChapters(updated)
  }

  const handleTopicToggle = (chapter: string, topic: string, checked: boolean) => {
    let updated = [...selectedTopics]
    if (checked) {
      updated.push({ chapter, topic })
      setActiveTabs((prev) => ({ ...prev, [chapter]: topic }))
    } else {
      updated = updated.filter((t) => !(t.chapter === chapter && t.topic === topic))
      const chapterTopics = updated.filter((t) => t.chapter === chapter)
      setActiveTabs((prev) => ({
        ...prev,
        [chapter]: chapterTopics.length > 0 ? chapterTopics[chapterTopics.length - 1].topic : "",
      }))
    }
    setSelectedTopics(updated)
  }

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("onSubmit triggered with data:", data, "Form Valid:", form.formState.isValid)
    if (form.formState.isValid) {
      console.log("Form is valid, modal not opened. Errors:", form.formState.errors)
    }
  }


  return (
    <ShadForm {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >

        {currentStep === 1 && (
          <SelectionStep
            form={form}
            bookChapters={bookChapters}
            selectedChapters={selectedChapters}
            selectedTopics={selectedTopics}
            expandedChapters={expandedChapters}
            activeTabs={activeTabs}
            handleChapterToggle={handleChapterToggle}
            handleTopicToggle={handleTopicToggle}
            topicOptions={topicOptions}
            books={books}
            currentStep={currentStep}
          />
        )}
      </form>
    </ShadForm>
  )
}

export default StepForm