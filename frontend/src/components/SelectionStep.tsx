import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Checkbox } from "./ui/checkbox"
import { Eye, BookOpen, Layers } from "lucide-react"
import { Label } from "./ui/label"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import OptionsStep from "./OptionsStep"

type SelectionStepProps = {
  form: any
  bookChapters: Record<string, string[]>
  selectedChapters: string[]
  selectedTopics: { chapter: string; topic: string }[]
  activeTabs: Record<string, string>
  handleChapterToggle: (chapter: string, checked: boolean) => void
  handleTopicToggle: (chapter: string, topic: string, checked: boolean) => void
  topicOptions: string[]
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

  // const { mutateAsync, isLoading } = useMutation(getAllClasses, {
  //   onSuccess: (data) => {
  //     console.log(data)
  //   },
  //   onError: (error) => {
  //     console.log(error)
  //   },
  // })

  // useEffect(() => {
  //   mutateAsync()
  // }, [mutateAsync])

  return (
    <>
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-14">
            <FormField
              control={form.control}
              name="class"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-base font-semibold text-slate-900">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    Class
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                        form.setValue("class", val);
                      }}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full h-20 border-slate-300 bg-white hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all rounded-lg text-[15px] font-medium flex items-center justify-between px-4">
                        <SelectValue placeholder="Select your class" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg text-[16px]">
                        <SelectItem value="class-9">Class 9</SelectItem>
                        <SelectItem value="class-10">Class 10</SelectItem>
                        <SelectItem value="class-11">Class 11</SelectItem>
                        <SelectItem value="class-12">Class 12</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="book"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-base font-semibold text-slate-900">
                    <Layers className="w-5 h-5 text-indigo-600" />
                    Subject
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                        form.setValue("book", val);
                      }}
                      defaultValue={field.value}
                      disabled={!form.watch("class")}
                    >
                      <SelectTrigger className="w-full h-20 border-slate-300 bg-white hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all rounded-lg text-[15px] font-medium flex items-center justify-between px-4 disabled:opacity-50 disabled:cursor-not-allowed">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg text-[16px]">
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                        <SelectItem value="maths">Mathematics</SelectItem>
                        <SelectItem value="computer">Computer Science</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="w-full space-y-4">
          {form.watch("book") && (
            <div className="h-[320px] md:h-[380px] flex flex-col pb-5">
              <div className="hidden md:block mb-2">
                <FormLabel className="flex items-center gap-2 text-base font-semibold text-slate-900">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  Select Chapters
                </FormLabel>
              </div>

              <div
                className="flex-1 overflow-y-auto pr-2
          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3
          scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-gray-100
          hover:scrollbar-thumb-indigo-500 rounded-lg transition-all duration-200"
              >
                {bookChapters[form.watch("book").toLowerCase()]?.map((chapter) => (
                  <label
                    key={chapter}
                    className="flex items-center gap-3 border border-slate-200 rounded-lg px-4 py-3 bg-white 
              hover:bg-indigo-50 hover:border-indigo-300 hover:shadow-md cursor-pointer 
              transition-all duration-200 group"
                  >
                    <Checkbox
                      checked={selectedChapters.includes(chapter)}
                      onCheckedChange={(checked) =>
                        handleChapterToggle(chapter, Boolean(checked))
                      }
                      className="border-slate-300 group-hover:border-indigo-500"
                    />
                    <span className="font-medium text-[15px] text-slate-700 group-hover:text-slate-900">
                      {chapter}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {currentStep === 3 && (
        <div className="w-full">
          <div className="hidden md:block mb-2">
            <FormLabel className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-4">
              <Layers className="w-5 h-5 text-indigo-600" />
              Select Topics
            </FormLabel>
          </div>

          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {selectedChapters.map((chapter: string) => {
                const handleViewContent = (chapter: string, topic: string) => {
                  setModalContent({ chapter, topic })
                  setOpenModal(true)
                }

                return (
                  <CarouselItem key={chapter} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                    <div className="border border-slate-200 rounded-lg p-4 shadow-sm bg-white hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <p className="font-bold text-[20px] text-base text-slate-900">{chapter}</p>
                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                          Topics
                        </span>
                      </div>

                      <div className="space-y-2 flex-1 overflow-y-auto max-h-56 pr-2
  scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-gray-100 
  hover:scrollbar-thumb-indigo-500 rounded-md">
                        {topicOptions.map((topic: string) => {
                          const isSelected = selectedTopics.some((t) => t.chapter === chapter && t.topic === topic)
                          return (
                            <div
                              key={topic}
                              className={`flex items-center justify-between border rounded-md px-3 py-2.5 transition-all duration-200 ${isSelected
                                ? "bg-indigo-50 border-indigo-300 shadow-sm"
                                : "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                                }`}
                            >
                              <div className="flex items-center space-x-2 flex-1 min-w-0">
                                <Checkbox
                                  id={`${chapter}-${topic}`}
                                  checked={isSelected}
                                  onCheckedChange={(checked) => handleTopicToggle(chapter, topic, checked as boolean)}
                                  className="border-slate-300"
                                />
                                <Label
                                  htmlFor={`${chapter}-${topic}`}
                                  className="text-sm cursor-pointer text-slate-700 truncate font-medium text-[15px]"
                                >
                                  {topic}
                                </Label>
                              </div>

                              {isSelected && (
                                <Eye
                                  className="w-6 h-6 text-indigo-600 cursor-pointer hover:text-indigo-700 transition-colors flex-shrink-0 ml-2"
                                  onClick={() => handleViewContent(chapter, topic)}
                                />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>

          <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogContent className="max-w-md rounded-lg">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-slate-900">
                  {modalContent ? `${modalContent.chapter} → ${modalContent.topic}` : "Topic Content"}
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-600">
                  {modalContent ? (
                    <div className="mt-3 text-slate-700 leading-relaxed space-y-2">
                      <p>
                        This is the generated AI content for the topic <strong>{modalContent.topic}</strong> under the
                        chapter <strong>{modalContent.chapter}</strong>.
                      </p>
                      <p className="text-xs text-slate-500">
                        You can later replace this with actual data fetched from the API.
                      </p>
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">No topic selected yet.</p>
                  )}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {currentStep === 4 && (
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
