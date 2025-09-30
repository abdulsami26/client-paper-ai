"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form as ShadForm } from "./ui/form"
import { useState } from "react"
import { Button } from "./ui/button"
import SelectionStep from "./SelectionStep"
import Striper from "./striper"
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

const StepForm = () => {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [selectedChapters, setSelectedChapters] = useState<string[]>([])
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([])
  const [expandedChapters, setExpandedChapters] = useState<string[]>([])
  const [activeTabs, setActiveTabs] = useState<Record<string, string>>({})
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("")
  const [selectedPaperType, setSelectedPaperType] = useState<string>("")
  const [expandedConfirmChapters, setExpandedConfirmChapters] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

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

  const toggleExpand = (chapter: string) => {
    setExpandedChapters((prev) =>
      prev.includes(chapter) ? prev.filter((c) => c !== chapter) : [...prev, chapter]
    )
  }

  const toggleConfirmExpand = (chapter: string) => {
    setExpandedConfirmChapters((prev) =>
      prev.includes(chapter) ? prev.filter((c) => c !== chapter) : [...prev, chapter]
    )
  }

  const handleNext = () => {
    if (currentStep === 2) {
      form.setValue("difficulty", selectedDifficulty)
      form.setValue("paperType", selectedPaperType)
    }
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("onSubmit triggered with data:", data, "Form Valid:", form.formState.isValid)
    if (form.formState.isValid) {
      setIsModalOpen(true)
    } else {
      console.log("Form is invalid, modal not opened. Errors:", form.formState.errors)
    }
  }

  return (
    <ShadForm {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        className="space-y-8"
      >
        <Striper currentStep={currentStep} totalSteps={3} />

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
            toggleExpand={toggleExpand}
            topicOptions={topicOptions}
          />
        )}
        {currentStep === 2 && (
          <OptionsStep
            selectedDifficulty={selectedDifficulty}
            selectedPaperType={selectedPaperType}
            setSelectedDifficulty={setSelectedDifficulty}
            setSelectedPaperType={setSelectedPaperType}
          />
        )}
        {currentStep === 3 && (
          <ConfirmationStep
            form={form}
            selectedChapters={selectedChapters}
            selectedTopics={selectedTopics}
            expandedConfirmChapters={expandedConfirmChapters}
            toggleConfirmExpand={toggleConfirmExpand}
          />
        )}

        <div className="flex justify-between pt-4 border-t">
          <Button
            type="button"
            onClick={handleBack}
            variant="outline"
            disabled={currentStep === 1}
          >
            Back
          </Button>
          {currentStep < 3 ? (
            <Button type="button" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button type="submit">Generate Paper</Button>
          )}
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Paper Generated Successfully!</DialogTitle>
              <DialogDescription>
                This dialog provides details of the generated paper based on your selections.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg shadow border">
                <h4 className="font-medium">Details</h4>
                <p>Class: {form.watch("class").replace("class-", "Class ")}</p>
                <p>Book: {form.watch("book")}</p>
                <p>Difficulty: {form.watch("difficulty") || "Not selected"}</p>
                <p>Paper Type: {form.watch("paperType") || "Not selected"}</p>
              </div>
              <p className="text-gray-600">
                Your paper has been generated based on the selected chapters and topics. You can download it or view it now.
              </p>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Close
                </Button>
                <Button variant="default" onClick={() => {
                  form.reset()
                  setSelectedChapters([])
                  setSelectedTopics([])
                  setExpandedChapters([])
                  setActiveTabs({})
                  setSelectedDifficulty("")
                  setSelectedPaperType("")
                  setExpandedConfirmChapters([])
                  setCurrentStep(1)
                  setIsModalOpen(false)
                }}>
                  Generate New Paper
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </form>
    </ShadForm>
  )
}

export default StepForm