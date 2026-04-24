import { useState } from "react";
import { useQuery, useQueries } from "react-query";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";
import { BookOpen, Layers, Eye, X, FileText } from "lucide-react";

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
  topicTitle: string;
  content: Content[];
}

import type { GeneratePaperApi } from "@/screens/selection-form/form";

type SelectionStepProps = {
  form: UseFormReturn<FormData>;
  currentStep: number;
  onGenApiChange?: (api: GeneratePaperApi | null) => void;
};

const SelectionStep = ({ form, currentStep, onGenApiChange }: SelectionStepProps) => {
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

  // Toggle topic selection in form
  const handleTopicToggle = (chapterID: number, topicID: number, checked: boolean) => {
    const currentTopics = form.watch("topics") || [];
    if (checked) {
      form.setValue("topics", [
        ...currentTopics,
        { chapterID, topicID, is_qa: ["MCQ"] },
      ]);
    } else {
      form.setValue(
        "topics",
        currentTopics.filter(
          (t) => !(t.chapterID === chapterID && t.topicID === topicID)
        )
      );
    }
  };

  // Toggle a specific question type (MCQ/SHORT/LONG) for a topic — multi-select
  const handleTopicTypeToggle = (
    chapterID: number,
    topicID: number,
    type: "MCQ" | "SHORT" | "LONG"
  ) => {
    const currentTopics = form.watch("topics") || [];
    form.setValue(
      "topics",
      currentTopics.map((t) => {
        if (t.chapterID !== chapterID || t.topicID !== topicID) return t;
        const has = t.is_qa.includes(type);
        const next = has ? t.is_qa.filter((x) => x !== type) : [...t.is_qa, type];
        // Ensure at least one type remains selected
        return { ...t, is_qa: next.length === 0 ? t.is_qa : next };
      })
    );
  };

  const QA_TYPES: { key: "MCQ" | "SHORT" | "LONG"; label: string }[] = [
    { key: "MCQ", label: "MCQ" },
    { key: "SHORT", label: "QA" },
    { key: "LONG", label: "LONG" },
  ];

  return (
    <>
      {/* Step 1: Select Class & Book */}
      {currentStep === 1 && (
        <div className="w-full max-w-xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="class"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
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
                      <SelectTrigger className="w-full h-12 border-slate-200 bg-slate-50 rounded-xl px-4 disabled:opacity-60">
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
                      <SelectContent className="rounded-xl">
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
                  <FormLabel className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Layers className="w-4 h-4 text-indigo-600" />
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
                      <SelectTrigger className="w-full h-12 border-slate-200 bg-slate-50 rounded-xl px-4 disabled:opacity-50">
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
                      <SelectContent className="rounded-xl">
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
                    <div className="border rounded-lg p-3 sm:p-4 bg-white shadow-sm flex flex-col h-full">
                      <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
                        <p className="font-bold text-slate-900 text-sm sm:text-base truncate">{chapterTitle}</p>
                        <span className="text-[10px] sm:text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full shrink-0">
                          Topics
                        </span>
                      </div>

                      {query.isLoading ? (
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full max-w-[250px]" />
                          <Skeleton className="h-4 w-full max-w-[200px]" />
                          <Skeleton className="h-4 w-full max-w-[250px]" />
                        </div>
                      ) : query.error ? (
                        <p className="text-red-600 text-sm text-center py-6">Failed to load topics</p>
                      ) : (
                        <ScrollArea className="max-h-[60vh] sm:max-h-72 rounded-md pr-1 sm:pr-2">
                          <div className="space-y-2">
                            {topics.map((topic: ChapterContent) => {
                              const selectedTopics = form.watch("topics") || [];
                              const selectedEntry = selectedTopics.find(
                                (t) => t.chapterID === chapterID && t.topicID === topic.id
                              );
                              const isSelected = !!selectedEntry;
                              const activeTypes = selectedEntry?.is_qa || [];

                              return (
                                <div
                                  key={topic.id}
                                  className={`flex flex-col gap-2 border rounded-md px-2.5 sm:px-3 py-2 sm:py-2.5 ${isSelected
                                    ? "bg-indigo-50 border-indigo-300 shadow-sm"
                                    : "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                                    }`}
                                >
                                  <div className="flex items-start gap-2">
                                    <Checkbox
                                      id={`${chapterTitle}-${topic.title}`}
                                      checked={isSelected}
                                      onCheckedChange={(checked) =>
                                        handleTopicToggle(chapterID, topic.id, checked as boolean)
                                      }
                                      className="mt-0.5 shrink-0"
                                    />
                                    <Label
                                      htmlFor={`${chapterTitle}-${topic.title}`}
                                      className="flex-1 min-w-0 text-xs sm:text-sm cursor-pointer text-slate-700 font-medium leading-snug break-words"
                                    >
                                      <span className="line-clamp-2">{topic.title}</span>
                                    </Label>

                                    {isSelected && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setModalContent({ chapterTitle, topicTitle: topic.title, content: topic.content });
                                          setOpenModal(true);
                                        }}
                                        className="shrink-0 p-1 -m-1 rounded hover:bg-indigo-100 text-indigo-600"
                                        aria-label="View topic content"
                                      >
                                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                                      </button>
                                    )}
                                  </div>

                                  {isSelected && (
                                    <div className="flex gap-1 flex-wrap pl-6">
                                      {QA_TYPES.map((qt) => {
                                        const active = activeTypes.includes(qt.key);
                                        const isOnly = active && activeTypes.length === 1;
                                        return (
                                          <button
                                            key={qt.key}
                                            type="button"
                                            onClick={() =>
                                              handleTopicTypeToggle(chapterID, topic.id, qt.key)
                                            }
                                            disabled={isOnly}
                                            title={isOnly ? "At least one type must stay selected" : ""}
                                            className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[11px] sm:text-xs font-semibold border transition ${
                                              active
                                                ? "bg-indigo-600 text-white border-indigo-600"
                                                : "bg-white text-slate-600 border-slate-300 hover:border-indigo-400"
                                            } ${isOnly ? "opacity-80 cursor-not-allowed" : ""}`}
                                          >
                                            {qt.label}
                                          </button>
                                        );
                                      })}
                                    </div>
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
            <DialogContent className="max-w-2xl p-0 rounded-2xl overflow-hidden sm:max-h-[85vh]">
              <DialogHeader className="px-5 py-4 border-b border-slate-100">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <DialogTitle className="text-base font-semibold text-slate-900 truncate">
                        {modalContent?.topicTitle || "Topic Content"}
                      </DialogTitle>
                      <p className="text-[11px] text-slate-500 truncate">
                        {modalContent?.chapterTitle || ""}
                        {modalContent?.content?.length
                          ? ` · ${modalContent.content.length} block${
                              modalContent.content.length === 1 ? "" : "s"
                            }`
                          : ""}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpenModal(false)}
                    className="p-1.5 -m-1.5 rounded-lg hover:bg-slate-100 text-slate-500 shrink-0"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </DialogHeader>

              <ScrollArea className="max-h-[70vh]">
                <div className="flex flex-col gap-3 p-4 sm:p-5">
                  {modalContent?.content?.length ? (
                    modalContent.content.map((c) => (
                      <div
                        key={c.id}
                        className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm"
                      >
                        <p className="text-xs font-semibold text-indigo-600 mb-2">
                          {c.title}
                        </p>
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                          {c.content}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 italic text-center py-10">
                      No content blocks available.
                    </p>
                  )}
                </div>
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
        <GeneratePaper form={form} onGenApiChange={onGenApiChange} />
      )}
    </>
  );
};

export default SelectionStep;
