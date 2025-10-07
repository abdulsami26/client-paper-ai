import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Checkbox } from "./ui/checkbox"
import { Eye } from "lucide-react"
import { Label } from "./ui/label"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import OptionsStep from "./OptionsStep"

type SelectionStepProps = {
  form: any,
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
  currentStep,
}: SelectionStepProps) => {

  const [openModal, setOpenModal] = useState(false)
  const [modalContent, setModalContent] = useState<{ chapter: string; topic: string } | null>(null)
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
        <div className="w-full">
          {form.watch("book") && (
            <div>
              <FormLabel>Chapters</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
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
                    <span className="font-medium text-[14px]">{chapter}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {currentStep === 3 && (
        <div className="w-full">
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent>
              {selectedChapters.map((chapter: string) => {
                const handleViewContent = (chapter: string, topic: string) => {
                  setModalContent({ chapter, topic })
                  setOpenModal(true)
                }

                return (
                  <CarouselItem
                    key={chapter}
                    className="basis-full md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="border rounded-lg p-4 shadow-sm bg-white h-full flex flex-col">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-lg">{chapter} - Topics</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                        {topicOptions.map((topic: string) => {
                          const isSelected = selectedTopics.some(
                            (t) => t.chapter === chapter && t.topic === topic
                          )
                          return (
                            <div
                              key={topic}
                              className="flex items-center justify-between border rounded-md px-3 py-2 bg-gray-50 hover:bg-gray-100 transition"
                            >
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${chapter}-${topic}`}
                                  checked={isSelected}
                                  onCheckedChange={(checked) =>
                                    handleTopicToggle(chapter, topic, checked as boolean)
                                  }
                                />
                                <Label
                                  htmlFor={`${chapter}-${topic}`}
                                  className="text-sm cursor-pointer"
                                >
                                  {topic}
                                </Label>
                              </div>

                              {isSelected && (
                                <Eye
                                  className="h-4 w-4 text-gray-600 cursor-pointer hover:text-black transition"
                                  onClick={() => handleViewContent(chapter, topic)}
                                />
                              )}
                            </div>
                          )
                        })}
                      </div>

                      <Dialog open={openModal} onOpenChange={setOpenModal}>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>
                              {modalContent ? `${modalContent.chapter} → ${modalContent.topic}` : "Topic Content"}
                            </DialogTitle>
                            <DialogDescription>
                              {modalContent ? (
                                <div className="mt-3 text-gray-700 leading-relaxed">
                                  <p>
                                    This is the generated AI content for the topic{" "}
                                    <strong>{modalContent.topic}</strong> under the chapter{" "}
                                    <strong>{modalContent.chapter}</strong>.
                                    You can later replace this with actual data fetched from the API.
                                  </p>
                                </div>
                              ) : (
                                <p className="text-gray-500 italic">No topic selected yet.</p>
                              )}
                            </DialogDescription>

                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
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

      { currentStep === 4 && (
        <OptionsStep
          selectedDifficulty={form.watch("difficulty")}
          selectedPaperType={form.watch("paperType")}
          setSelectedDifficulty={(value) => form.setValue("difficulty", value)}
          setSelectedPaperType={(value) => form.setValue("paperType", value)}
        />
      )}

    </>
  )
}

export default SelectionStep