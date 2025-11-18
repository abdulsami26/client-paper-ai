import { useState } from "react";
import { useQuery, useQueries } from "react-query";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";
import { BookOpen, Layers, Eye } from "lucide-react";

import OptionsStep from "./OptionsStep";
import { getAllClasses, getBooksByClassID, getChaptersByBookID, getTopicsByChapterID } from "@/api/paper-content";
import type { UseFormReturn } from "react-hook-form";
import type { FormData } from "./StepForm";
import GeneratePaper from "./generate-paper";

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
  form: UseFormReturn<FormData>;
  currentStep: number;
};

const SelectionStep = ({ form, currentStep }: SelectionStepProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);

  // Classes query
  const { data: classData, isLoading: classLoading, error: classError } = useQuery(
    "classes",
    getAllClasses
  );

  const selectedClass = form.watch("class");

  // Books query
  const { data: bookData, isLoading: bookLoading, error: bookError } = useQuery(
    ["books", selectedClass],
    () => getBooksByClassID(Number(selectedClass)),
    { enabled: !!selectedClass }
  );

  const selectedBook = form.watch("book");

  // Chapters query
  const { data: chapterData, isLoading: chapterLoading, error: chapterError } = useQuery(
    ["chapters", selectedBook],
    () => getChaptersByBookID(Number(selectedBook)),
    { enabled: !!selectedBook }
  );

  const selectedChapter = form.watch("chapters") || [];

  // Topics queries
  const topicQueries = useQueries(
    selectedChapter.map((chapterID: number) => ({
      queryKey: ["topics", chapterID],
      queryFn: () => getTopicsByChapterID(chapterID),
      enabled: currentStep === 3 && selectedChapter.length > 0,
    }))
  );

  // Toggle topics in form
  const handleTopicToggle = (chapterID: number, topicID: number, checked: boolean) => {
    const currentTopics = form.watch("topics") || [];
    if (checked) {
      form.setValue("topics", [...currentTopics, { chapterID, topicID }]);
    } else {
      form.setValue(
        "topics",
        currentTopics.filter(
          (t: { chapterID: number; topicID: number }) =>
            !(t.chapterID === chapterID && t.topicID === topicID)
        )
      );
    }
  };

  return (
    <>
      {/* Step 1: Select Class & Book */}
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
                      disabled={classLoading || !!classError}
                    >
                      <SelectTrigger className="w-full h-20 border-slate-300 bg-white rounded-lg px-4 flex items-center justify-between disabled:opacity-60">
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
                        {classData?.classes?.map((item) => (
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
                        const bookObj = JSON.parse(val);
                        field.onChange(bookObj.id);
                        form.setValue("subject", bookObj.title);
                      }}
                      defaultValue={field.value}
                      disabled={!selectedClass || bookLoading || !!bookError}
                    >
                      <SelectTrigger className="w-full h-20 border-slate-300 bg-white rounded-lg px-4 flex items-center justify-between disabled:opacity-50">
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
                        {bookData?.classesData?.[0]?.books?.map((book) => (
                          <SelectItem
                            key={book.id}
                            value={JSON.stringify({ id: book.id, title: book.title })}
                          >
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

      {/* Step 2: Select Chapters */}
      {currentStep === 2 && (
        <div className="w-full space-y-4">
          {form.watch("book") && (
            <div className="flex flex-col pb-5">
              {chapterLoading ? (
                <div className="flex items-center justify-center space-x-4 text-slate-600">
                  <Skeleton className="h-28 w-[500px]" />
                  <Skeleton className="h-28 w-[500px]" />
                </div>
              ) : chapterError ? (
                <div className="text-red-600 text-sm text-center">Error loading chapters</div>
              ) : !chapterData?.bookData?.[0]?.chapters?.length ? (
                <div className="text-slate-500 text-sm text-center">No chapters found for this book.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto max-h-[500px] pr-2 scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-gray-100">
                  {chapterData.bookData[0].chapters.map((chapter) => (
                    <label
                      key={chapter.id}
                      className="flex items-center gap-3 border rounded-lg px-4 py-3 bg-white hover:bg-indigo-50 hover:border-indigo-300 cursor-pointer transition-all"
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
                      />
                      <span className="line-clamp-1 font-medium text-slate-700">{chapter.title}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Select Topics */}
      {currentStep === 3 && (
        <div className="w-full">
          <Carousel opts={{ align: "start" }}>
            <CarouselContent className="-ml-2 md:-ml-4">
              {topicQueries.map((query, index) => {
                const chapterID = selectedChapter[index];
                const chapterTitle =
                  chapterData?.bookData?.[0]?.chapters?.find((c) => c.id === chapterID)?.title ||
                  `Chapter ${chapterID}`;
                const topics = query.data?.chapterData || [];

                return (
                  <CarouselItem key={chapterID} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                    <div className="border rounded-lg p-4 bg-white shadow-sm flex flex-col h-full">
                      <div className="flex items-center justify-between mb-4">
                        <p className="font-bold text-slate-900">{chapterTitle}</p>
                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                          Topics
                        </span>
                      </div>

                      {query.isLoading ? (
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-4 w-[250px]" />
                        </div>
                      ) : query.error ? (
                        <p className="text-red-600 text-sm text-center py-6">Failed to load topics</p>
                      ) : (
                        <ScrollArea className="max-h-56 rounded-md pr-2">
                          <div className="space-y-2">
                            {topics.map((topic: ChapterContent) => {
                              const selectedTopics = form.watch("topics") || [];
                              const isSelected = selectedTopics.some(
                                (t: { chapterID: number; topicID: number }) =>
                                  t.chapterID === chapterID && t.topicID === topic.id
                              );

                              return (
                                <div
                                  key={topic.id}
                                  className={`flex items-center justify-between border rounded-md px-3 py-2.5 ${isSelected
                                    ? "bg-indigo-50 border-indigo-300 shadow-sm"
                                    : "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                                    }`}
                                >
                                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                                    <Checkbox
                                      id={`${chapterTitle}-${topic.title}`}
                                      checked={isSelected}
                                      onCheckedChange={(checked) =>
                                        handleTopicToggle(chapterID, topic.id, checked as boolean)
                                      }
                                    />
                                    <Label
                                      htmlFor={`${chapterTitle}-${topic.title}`}
                                      className="text-sm cursor-pointer text-slate-700 font-medium"
                                    >
                                      {topic.title}
                                    </Label>
                                  </div>

                                  {isSelected && (
                                    <Eye
                                      className="w-5 h-5 text-indigo-600 cursor-pointer"
                                      onClick={() => {
                                        setModalContent({ chapterTitle, content: topic.content });
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

          {/* Topic Content Modal */}
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
                        <div className="mt-3 text-slate-700 leading-relaxed">{content.content}</div>
                      </DialogDescription>
                    </DialogHeader>
                  ))
                ) : (
                  <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-slate-900">Topic Content</DialogTitle>
                    <DialogDescription className="text-slate-500 italic">No topic selected yet.</DialogDescription>
                  </DialogHeader>
                )}
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Step 4: Select Difficulty & Paper Type */}
      {currentStep === 4 && (
        <OptionsStep form={form} />
      )}

      {currentStep === 5 && (
        <GeneratePaper form={form} />
      )}
    </>
  );
};

export default SelectionStep;
