import type { UseFormReturn } from "react-hook-form";
import type { FormData } from "./StepForm";
import type { GeneratePaperApi } from "@/screens/selection-form/form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useMutation, useQueries } from "react-query";
import { generatePaper } from "@/api/generate-paper";
import { getTopicsByChapterID } from "@/api/paper-content";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useEffect, useMemo, useRef, useState } from "react";
import { Trash2, Eye, ChevronDown, ChevronUp, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";

type GeneratePaperProps = {
  form: UseFormReturn<FormData>;
  onGenApiChange?: (api: GeneratePaperApi | null) => void;
};

type QuestionTypeUI = "MCQ" | "SHORT" | "LONG";
type DifficultyUI = "VERY_LOW" | "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";

type UISection = {
  title: string;
  is_qa: QuestionTypeUI;
  marksValue: number;
  questionConfig: {
    question_length: number;
    difficulty_level: DifficultyUI;
    content_id: number[];
  };
};

const DIFFICULTY_OPTIONS: DifficultyUI[] = [
  "VERY_LOW",
  "LOW",
  "MEDIUM",
  "HIGH",
  "VERY_HIGH",
];

const QTYPE_OPTIONS: QuestionTypeUI[] = ["MCQ", "SHORT", "LONG"];

const difficultyMap: Record<string, DifficultyUI> = {
  easy: "LOW",
  medium: "MEDIUM",
  hard: "HIGH",
};

const GeneratePaper = ({ form, onGenApiChange }: GeneratePaperProps) => {
  const { user, refreshCredits } = useAuth();
  const credits = user?.credits ?? 0;
  const watchedTopics = form.watch("topics") || [];

  const selectedTopicIds = useMemo<number[]>(
    () => watchedTopics.map((t) => t.topicID),
    [watchedTopics],
  );

  const chapterIds = useMemo(
    () => Array.from(new Set(watchedTopics.map((t) => t.chapterID))),
    [watchedTopics],
  );

  const topicQueries = useQueries(
    chapterIds.map((id) => ({
      queryKey: ["topics", id],
      queryFn: () => getTopicsByChapterID(id),
      enabled: true,
    })),
  );

  type TopicDetails = {
    id: number;
    title: string;
    content: { id: number; title: string; content: string }[];
    chapterID: number;
  };

  const topicDetailsMap = useMemo(() => {
    const m = new Map<number, TopicDetails>();
    topicQueries.forEach((q, i) => {
      const chapterID = chapterIds[i];
      const data = (q as { data?: { chapterData?: TopicDetails[] } }).data;
      data?.chapterData?.forEach((t) => {
        m.set(t.id, {
          id: t.id,
          title: t.title,
          content: t.content || [],
          chapterID,
        });
      });
    });
    return m;
  }, [topicQueries, chapterIds]);

  const [verifyOpen, setVerifyOpen] = useState(false);
  const [expandedTopicId, setExpandedTopicId] = useState<number | null>(null);

  const defaultDifficulty: DifficultyUI =
    difficultyMap[(form.watch("difficulty") || "").toLowerCase()] || "MEDIUM";

  const sectionTitleFor = (type: QuestionTypeUI, idx: number) => {
    const labelMap: Record<QuestionTypeUI, string> = {
      MCQ: "Multiple Choice Questions",
      SHORT: "Short Answer Questions",
      LONG: "Long Answer Questions",
    };
    return `SECTION "${String.fromCharCode(65 + idx)}" (${labelMap[type]})`;
  };

  const makeDefaultSection = (type: QuestionTypeUI, idx: number, contentIds: number[]): UISection => ({
    title: sectionTitleFor(type, idx),
    is_qa: type,
    marksValue: 10,
    questionConfig: {
      question_length: 10,
      difficulty_level: defaultDifficulty,
      content_id: contentIds,
    },
  });

  const buildInitialSections = (): UISection[] => {
    const groups: Record<QuestionTypeUI, Set<number>> = {
      MCQ: new Set(),
      SHORT: new Set(),
      LONG: new Set(),
    };
    for (const t of watchedTopics) {
      const types = (t.is_qa && t.is_qa.length > 0 ? t.is_qa : ["MCQ"]) as QuestionTypeUI[];
      for (const type of types) {
        groups[type].add(t.topicID);
      }
    }
    const ordered: QuestionTypeUI[] = ["MCQ", "SHORT", "LONG"];
    const result: UISection[] = [];
    let idx = 0;
    for (const type of ordered) {
      if (groups[type].size > 0) {
        result.push(makeDefaultSection(type, idx++, Array.from(groups[type])));
      }
    }
    if (result.length === 0) {
      result.push(makeDefaultSection("MCQ", 0, selectedTopicIds));
    }
    return result;
  };

  const [boardName, setBoardName] = useState("Private School/Coaching (ABC-XYZ)");
  const [subject, setSubject] = useState<string>(form.watch("subject") || "");
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [totalMarks, setTotalMarks] = useState<number>(10);
  const [timeAllowed, setTimeAllowed] = useState<number>(30);
  const [papertypeAI, setPapertypeAI] = useState<boolean>(true);
  const [sections, setSections] = useState<UISection[]>(() => buildInitialSections());

  useEffect(() => {
    if (!subject && form.watch("subject")) setSubject(form.watch("subject"));
  }, [form.watch("subject")]);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const pdfUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (pdfUrlRef.current) URL.revokeObjectURL(pdfUrlRef.current);
    };
  }, []);

  const { mutate, isLoading } = useMutation({
    mutationFn: (data: any) => generatePaper(data),
    onSuccess: (blob: Blob) => {
      if (pdfUrlRef.current) URL.revokeObjectURL(pdfUrlRef.current);
      const pdfBlob =
        blob instanceof Blob ? blob : new Blob([blob as any], { type: "application/pdf" });
      const url = URL.createObjectURL(pdfBlob);
      pdfUrlRef.current = url;
      setPdfUrl(url);
      refreshCredits?.();
    },
    onError: async (err: any) => {
      const status = err?.response?.status;
      const data = err?.response?.data;
      let message = "Failed to generate paper.";
      if (data instanceof Blob) {
        try {
          const text = await data.text();
          const parsed = JSON.parse(text);
          message = parsed?.message || message;
        } catch {
          // keep default message
        }
      } else if (typeof data?.message === "string") {
        message = data.message;
      }
      toast.error(message);
      if (status === 402) refreshCredits?.();
    },
  });

  const updateSection = (idx: number, patch: Partial<UISection>) => {
    setSections((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  };

  const updateQuestionConfig = (
    idx: number,
    patch: Partial<UISection["questionConfig"]>,
  ) => {
    setSections((prev) =>
      prev.map((s, i) =>
        i === idx ? { ...s, questionConfig: { ...s.questionConfig, ...patch } } : s,
      ),
    );
  };

  const removeSection = (idx: number) =>
    setSections((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev));

  const buildPayload = () => ({
    paperConfig: {
      boardName,
      subject,
      date: new Date(date).toISOString(),
      totalMarks,
      timeAllowed,
      sections: sections.map(({ marksValue, ...s }) => ({
        ...s,
        marks: `[Marks: ${marksValue}]`,
        questionLineSpacing: 2,
      })),
    },
    papertypeAI,
  });

  // Keep a ref to the latest buildPayload so the exposed `generate` uses fresh state
  const buildPayloadRef = useRef(buildPayload);
  buildPayloadRef.current = buildPayload;

  // Expose generate API to the parent footer
  const hasCredits = !papertypeAI || credits > 0;
  const ready = !!subject && sections.length > 0 && hasCredits;
  useEffect(() => {
    onGenApiChange?.({
      generate: () => {
        if (papertypeAI && credits <= 0) {
          toast.error("No credits. Please contact admin to add credits.");
          return;
        }
        mutate(buildPayloadRef.current());
      },
      isLoading,
      ready,
    });
    return () => onGenApiChange?.(null);
  }, [onGenApiChange, isLoading, ready, mutate, papertypeAI, credits]);

  const downloadPdf = () => {
    if (!pdfUrl) return;
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = `${subject || "paper"}-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const inputCls =
    "h-11 rounded-xl bg-slate-50 border-slate-200 focus-visible:bg-white";

  return (
    <div className="flex flex-col gap-5">
      {/* Paper Config Card */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-600 text-sm font-bold">i</span>
          </div>
          <h3 className="text-base font-semibold text-slate-900">Paper Info</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 flex flex-col gap-1.5">
            <Label className="text-xs text-slate-500">Board Name</Label>
            <Input
              className={inputCls}
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
            />
          </div>
          <div className="col-span-2 flex flex-col gap-1.5">
            <Label className="text-xs text-slate-500">Subject</Label>
            <Input
              className={inputCls}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-slate-500">Date</Label>
            <Input
              type="date"
              className={inputCls}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-slate-500">Total Marks</Label>
            <Input
              type="number"
              min={1}
              className={inputCls}
              value={totalMarks}
              onChange={(e) => setTotalMarks(Number(e.target.value) || 0)}
            />
          </div>
          <div className="col-span-2 flex flex-col gap-1.5">
            <Label className="text-xs text-slate-500">Time Allowed (minutes)</Label>
            <Input
              type="number"
              min={1}
              className={inputCls}
              value={timeAllowed}
              onChange={(e) => setTimeAllowed(Number(e.target.value) || 0)}
            />
          </div>
          <label className="col-span-2 flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-3 mt-1 cursor-pointer">
            <Checkbox
              id="papertypeAI"
              checked={papertypeAI}
              onCheckedChange={(v) => setPapertypeAI(Boolean(v))}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900">AI Generation</p>
              <p className="text-[11px] text-slate-500 leading-tight">
                Uncheck to pull existing questions from DB
              </p>
            </div>
          </label>

          {papertypeAI && (
            <div
              className={`col-span-2 rounded-xl px-3 py-2.5 text-xs flex items-center gap-2 ${
                credits > 0
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              <span className="font-semibold">
                {credits > 0 ? `${credits} credits available` : "No credits"}
              </span>
              <span className="opacity-80">
                {credits > 0
                  ? "· 1 credit per AI paper"
                  : "· contact admin to add credits"}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Sections */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1 gap-2">
          <h3 className="text-base font-semibold text-slate-900">
            Sections <span className="text-slate-400 font-normal">· {sections.length}</span>
          </h3>
          <button
            type="button"
            onClick={() => setVerifyOpen(true)}
            disabled={selectedTopicIds.length === 0}
            className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 disabled:text-slate-400 active:scale-95 transition"
          >
            <Eye className="w-4 h-4" />
            Verify
          </button>
        </div>

        {sections.map((section, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                  {String.fromCharCode(65 + idx)}
                </div>
                <h4 className="text-base font-semibold text-slate-900">
                  Section {idx + 1}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => removeSection(idx)}
                disabled={sections.length === 1}
                className="p-2 rounded-xl text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-transparent active:scale-95 transition"
                aria-label="Remove section"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 flex flex-col gap-1.5">
                <Label className="text-xs text-slate-500">Title</Label>
                <Input
                  className={inputCls}
                  value={section.title}
                  onChange={(e) => updateSection(idx, { title: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-slate-500">Type</Label>
                <Select
                  value={section.is_qa}
                  onValueChange={(v) => updateSection(idx, { is_qa: v as QuestionTypeUI })}
                >
                  <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {QTYPE_OPTIONS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-slate-500">Marks</Label>
                <Input
                  type="number"
                  min={1}
                  className={inputCls}
                  value={section.marksValue}
                  onChange={(e) =>
                    updateSection(idx, { marksValue: Number(e.target.value) || 0 })
                  }
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-slate-500">Questions</Label>
                <Input
                  type="number"
                  min={1}
                  className={inputCls}
                  value={section.questionConfig.question_length}
                  onChange={(e) =>
                    updateQuestionConfig(idx, {
                      question_length: Number(e.target.value) || 1,
                    })
                  }
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-slate-500">Difficulty</Label>
                <Select
                  value={section.questionConfig.difficulty_level}
                  onValueChange={(v) =>
                    updateQuestionConfig(idx, { difficulty_level: v as DifficultyUI })
                  }
                >
                  <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTY_OPTIONS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2 flex items-center justify-between gap-2 bg-slate-50 rounded-xl px-3 py-2.5">
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Topics in this section</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {section.questionConfig.content_id.length} selected
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setVerifyOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 px-3 py-2 rounded-lg hover:bg-indigo-50 active:scale-95 transition"
                >
                  <Eye className="w-4 h-4" />
                  Verify
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* PDF Preview */}
      {pdfUrl && (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <h4 className="text-sm font-semibold text-slate-900">Preview</h4>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => window.open(pdfUrl, "_blank")}
                className="text-xs font-medium text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 active:scale-95 transition"
              >
                Open
              </button>
              <button
                type="button"
                onClick={downloadPdf}
                className="text-xs font-medium text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 active:scale-95 transition"
              >
                Download
              </button>
            </div>
          </div>
          <iframe
            src={pdfUrl}
            title="Generated Paper"
            className="w-full"
            style={{ height: "70vh" }}
          />
        </section>
      )}

      {/* Verification Dialog */}
      <Dialog open={verifyOpen} onOpenChange={setVerifyOpen}>
        <DialogContent className="max-w-2xl p-0 rounded-2xl overflow-hidden sm:max-h-[85vh]">
          <DialogHeader className="px-5 py-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base font-semibold text-slate-900">
                Selected Content
              </DialogTitle>
              <button
                type="button"
                onClick={() => setVerifyOpen(false)}
                className="p-1.5 -m-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Verify what will be used to generate each section.
            </p>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh]">
            <div className="flex flex-col gap-4 p-4 sm:p-5">
              {sections.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-10">
                  No sections configured.
                </p>
              ) : (
                sections.map((section, sIdx) => {
                  const ids = section.questionConfig.content_id;
                  return (
                    <div
                      key={sIdx}
                      className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
                    >
                      <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border-b border-slate-100">
                        <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                          {String.fromCharCode(65 + sIdx)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {section.title}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {section.is_qa} · {ids.length} topic
                            {ids.length === 1 ? "" : "s"}
                          </p>
                        </div>
                      </div>

                      {ids.length === 0 ? (
                        <p className="text-xs text-slate-500 p-4">
                          No topics assigned to this section.
                        </p>
                      ) : (
                        <div className="divide-y divide-slate-100">
                          {ids.map((topicId) => {
                            const topic = topicDetailsMap.get(topicId);
                            const expanded =
                              expandedTopicId === topicId * 1000 + sIdx;

                            if (!topic) {
                              return (
                                <div
                                  key={topicId}
                                  className="px-4 py-3 text-xs text-slate-400 italic"
                                >
                                  Loading topic #{topicId}...
                                </div>
                              );
                            }

                            return (
                              <div key={topicId}>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedTopicId(
                                      expanded ? null : topicId * 1000 + sIdx,
                                    )
                                  }
                                  className="w-full flex items-center justify-between gap-2 px-4 py-3 hover:bg-slate-50 active:bg-slate-100 transition text-left"
                                >
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-slate-900 truncate">
                                      {topic.title}
                                    </p>
                                    <p className="text-[11px] text-slate-500">
                                      {topic.content.length} content block
                                      {topic.content.length === 1 ? "" : "s"}
                                    </p>
                                  </div>
                                  {expanded ? (
                                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                                  )}
                                </button>

                                {expanded && (
                                  <div className="px-4 pb-4 space-y-3 bg-slate-50/50">
                                    {topic.content.length === 0 ? (
                                      <p className="text-xs text-slate-500 italic">
                                        No content blocks.
                                      </p>
                                    ) : (
                                      topic.content.map((c) => (
                                        <div
                                          key={c.id}
                                          className="rounded-xl bg-white border border-slate-200 p-3"
                                        >
                                          <p className="text-xs font-semibold text-indigo-600 mb-1">
                                            {c.title}
                                          </p>
                                          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                                            {c.content}
                                          </p>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GeneratePaper;
