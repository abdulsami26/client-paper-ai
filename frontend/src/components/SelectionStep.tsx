import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Checkbox } from "./ui/checkbox"
import { Eye, BookOpen, Layers } from "lucide-react"
import { Label } from "./ui/label"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import OptionsStep from "./OptionsStep"
import { useQueries, useQuery, type UseQueryResult } from "react-query"
import { getAllClasses, getBooksByClassID, getChaptersByBookID, getTopicsByChapterID, type BooksResponse, type ChaptersResponse, type ClassesResponse, type TopicsResponse } from "@/api/paper-content"
import { ScrollArea } from "./ui/scroll-area"
import { Skeleton } from "./ui/skeleton"
import type { UseFormReturn } from "react-hook-form"
import type { FormData } from "./StepForm"

interface Content {
  id: number;
  title: string;
  topic_id: number;
  content: string;
}
interface ChapterContent {
  id: number;
  title: string;
  content: Content[];
}

interface ModalContent {
  chapterTitle: string;
  content: Content[];
}

type SelectionStepProps = {
  form: UseFormReturn<FormData>
  currentStep: number
}

const SelectionStep = ({
  form,
  currentStep,
}: SelectionStepProps) => {
  const [openModal, setOpenModal] = useState(false)
  const [modalContent, setModalContent] = useState<ModalContent | null>(null)

  const {
    data: classData,
    isLoading: classLoading,
    error: classError,
  } = useQuery<ClassesResponse, Error>("classes", getAllClasses)

  const selectedClass = form.watch("class")

  const {
    data: bookData,
    isLoading: bookLoading,
    error: bookError,
  } = useQuery<BooksResponse, Error>(["books", selectedClass], () => getBooksByClassID(Number(selectedClass)), {
    enabled: !!selectedClass,
  })
  const selectedBook = form.watch("book")
  const {
    data: chapterData,
    isLoading: chapterLoading,
    error: chapterError,
  } = useQuery<ChaptersResponse, Error>(["chapters", selectedBook], () => getChaptersByBookID(Number(selectedBook)), {
    enabled: !!selectedBook,
  })
  const selectedChapter = form.watch("chapters") || [];

  const topicQueries = useQueries<UseQueryResult<TopicsResponse, Error>[]>(
    selectedChapter.map((chapterID: number) => ({
      queryKey: ["topics", chapterID],
      queryFn: () => getTopicsByChapterID(chapterID),
      enabled: currentStep === 3 && selectedChapter.length > 0,
    }))
  );

  const handleTopicToggle = (chapterID: number, topicID: number, checked: boolean) => {
    const currentTopics = form.watch("topics") || [];
    if (checked) {
      form.setValue("topics", [...currentTopics, { chapterID, topicID }]);
    } else {
      form.setValue(
        "topics",
        currentTopics.filter((t: { chapterID: number; topicID: number }) => !(t.chapterID === chapterID && t.topicID === topicID))
      );
    }
  };
  const finalObject = {
    class: form.watch("class"),
    book: form.watch("book"),
    chapters: form.watch("chapters"),
    topic: form.watch("topics"),
    difficulty: form.watch("difficulty"),
    paperType: form.watch("paperType"),
  }

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
                        form.setValue("book", "");
                      }}
                      defaultValue={field.value}
                      disabled={classLoading || !!classError}
                    >
                      <SelectTrigger className="w-full h-20 border-slate-300 bg-white hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all rounded-lg text-[15px] font-medium flex items-center justify-between px-4 disabled:opacity-60 disabled:cursor-not-allowed">
                        <SelectValue
                          placeholder={
                            classLoading
                              ? "Loading classes..."
                              : classError
                                ? "Failed to load classes"
                                : "Select your class"
                          }
                        />
                      </SelectTrigger>

                      <SelectContent className="rounded-lg text-[16px]">
                        {classLoading && (
                          <div className="py-3 px-4 text-sm text-slate-600 text-center">
                            Loading...
                          </div>
                        )}
                        {classError && (
                          <div className="py-3 px-4 text-sm text-red-600 text-center">
                            Error loading classes
                          </div>
                        )}
                        {!classLoading &&
                          !classError &&
                          classData?.classes?.map((item) => (
                            <SelectItem key={item.id} value={item.id.toString()}>
                              {item.name}
                            </SelectItem>
                          ))}
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
                      disabled={!selectedClass || bookLoading || !!bookError}
                    >
                      <SelectTrigger className="w-full h-20 border-slate-300 bg-white hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all rounded-lg text-[15px] font-medium flex items-center justify-between px-4 disabled:opacity-50 disabled:cursor-not-allowed">
                        <SelectValue
                          placeholder={
                            !selectedClass
                              ? "Select class first"
                              : bookLoading
                                ? "Loading subjects..."
                                : bookError
                                  ? "Failed to load subjects"
                                  : "Select a subject"
                          }
                        />
                      </SelectTrigger>

                      <SelectContent className="rounded-lg text-[16px]">
                        {bookLoading && (
                          <div className="py-3 px-4 text-sm text-slate-600 text-center">
                            Loading...
                          </div>
                        )}
                        {bookError && (
                          <div className="py-3 px-4 text-sm text-red-600 text-center">
                            Error loading subjects
                          </div>
                        )}
                        {!bookLoading &&
                          !bookError &&
                          bookData?.classesData?.[0]?.books?.map((book) => (
                            <SelectItem key={book.id} value={book.id.toString()}>
                              {book.title}
                            </SelectItem>
                          ))}
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
            <div className="flex flex-col pb-5">
              <div className="hidden md:block mb-2">
                <FormLabel className="flex items-center gap-2 text-base font-semibold text-slate-900">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  Select Chapters
                </FormLabel>
              </div>
              {chapterLoading ? (
                <div className="flex-1 flex items-center justify-center text-slate-600 text-sm space-x-4">
                  <Skeleton className="h-28 w-[500px]" />
                  <Skeleton className="h-28 w-[500px]" />
                </div>
              ) : chapterError ? (
                <div className="flex-1 flex items-center justify-center text-red-600 text-sm">
                  Error loading chapters
                </div>
              ) : !chapterData?.bookData?.[0]?.chapters?.length ? (
                <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
                  No chapters found for this book.
                </div>
              ) : (
                <div
                  className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-gray-100 hover:scrollbar-thumb-indigo-500 rounded-lg transition-all duration-200"
                >
                  {chapterData.bookData[0].chapters.map((chapter) => (
                    <label
                      key={chapter.id}
                      className="flex items-center gap-3 border border-slate-200 rounded-lg px-4 py-3 bg-white hover:bg-indigo-50 hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all duration-200 group"
                    >
                      <Checkbox
                        checked={form.watch("chapters")?.includes(chapter.id)}
                        onCheckedChange={(checked) => {
                          const currentChapters = form.watch("chapters") || [];

                          if (checked) {
                            form.setValue("chapters", [...currentChapters, chapter.id]);
                          } else {
                            form.setValue(
                              "chapters",
                              currentChapters.filter((id: number) => id !== chapter.id)
                            );
                          }
                        }}
                        className="border-slate-300 group-hover:border-indigo-500"
                      />
                      <span className="line-clamp-1 font-medium text-[15px] text-slate-700 group-hover:text-slate-900">
                        {chapter.title}
                      </span>
                    </label>
                  ))}
                </div>
              )}
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
              {topicQueries.map((query, index) => {
                const chapterID = selectedChapter[index];
                const chapterDataItem = query.data?.chapterData || [];
                const chapterTitle =
                  form.getValues("chapters")?.[chapterID] ||
                  `Chapter ${chapterID}`;
                return (
                  <CarouselItem
                    key={chapterID}
                    className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                  >
                    <div className="border border-slate-200 rounded-lg p-4 shadow-sm bg-white hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <p className="font-bold text-[18px] text-slate-900">
                          {chapterTitle}
                        </p>
                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                          Topics
                        </span>
                      </div>

                      {query.isLoading as any && (
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      )}
                      {query.error && (
                        <p className="text-sm text-red-600 text-center py-6">
                          Failed to load topics
                        </p>
                      )}

                      {!query.isLoading && !query.error && (
                        <ScrollArea className="max-h-56 rounded-md pr-2">
                          <div className="space-y-2">
                            {chapterDataItem.map((topic: ChapterContent) => {
                              const topics = form.watch("topics") || [];
                              const isSelected = topics.some(
                                (t: { chapterID: number; topicID: number }) =>
                                  t.chapterID === chapterID &&
                                  t.topicID === topic.id
                              );
                              return (
                                <div
                                  key={topic.id}
                                  className={`flex items-center justify-between border rounded-md px-3 py-2.5 transition-all duration-200 ${isSelected
                                    ? "bg-indigo-50 border-indigo-300 shadow-sm"
                                    : "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                                    }`}
                                >
                                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                                    <Checkbox
                                      id={`${chapterTitle}-${topic.title}`}
                                      checked={isSelected}
                                      onCheckedChange={(checked) =>
                                        handleTopicToggle(
                                          chapterID,
                                          topic.id,
                                          checked as boolean
                                        )
                                      }
                                      className="border-slate-300"
                                    />
                                    <Label
                                      htmlFor={`${chapterTitle}-${topic.title}`}
                                      className="text-sm cursor-pointer text-slate-700 font-medium text-[15px]"
                                    >
                                      {topic.title}
                                    </Label>
                                  </div>

                                  {isSelected && (
                                    <Eye
                                      className="w-5 h-5 text-indigo-600 cursor-pointer hover:text-indigo-700 transition-colors flex-shrink-0 ml-2"
                                      onClick={() => {
                                        setModalContent({
                                          chapterTitle: chapterTitle as string,
                                          content: topic.content,
                                        });
                                        setOpenModal(true);
                                      }}
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </ScrollArea>
                      )}
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>

          {/* Topic content modal */}
          <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogContent className="max-w-md rounded-lg p-0">
              <ScrollArea className="max-h-[80vh] p-5">
                {modalContent?.content?.length ? (
                  modalContent.content.map((content, index) => (
                    <DialogHeader key={index} className="mb-4">
                      <DialogTitle className="text-lg font-bold text-slate-900">
                        {`${modalContent.chapterTitle} → ${content.title}`}
                      </DialogTitle>
                      <DialogDescription className="text-sm text-slate-600">
                        <div className="mt-3 text-slate-700 leading-relaxed space-y-2">
                          <p>{content.content}</p>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  ))
                ) : (
                  <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-slate-900">
                      Topic Content
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 italic">
                      No topic selected yet.
                    </DialogDescription>
                  </DialogHeader>
                )}
              </ScrollArea>
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
