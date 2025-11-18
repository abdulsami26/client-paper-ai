import type { UseFormReturn } from "react-hook-form";
import type { FormData } from "./StepForm";
import { Button } from "./ui/button";
import { useMutation } from "react-query";
import { generatePaper } from "@/api/generate-paper";

type GeneratePaperProps = {
  form: UseFormReturn<FormData>;
}

const GeneratePaper = ({ form }: GeneratePaperProps) => {

  // FIXED: mutationFn sirf data leta hai, render pe execute nahi hota
  const { mutate, isLoading } = useMutation({
    mutationFn: (data: any) => generatePaper(data),
    onSuccess: (res) => {
      console.log("Paper Generated Successfully:", res);
    },
    onError: (err) => {
      console.error("Error:", err);
    }
  });

//   // Build Paper Object
//   const finalObj = {
//     class: form.watch("class"),
//     book: form.watch("book"),
//     subject: form.watch("subject"),
//     chapters: form.watch("chapters"),
//     topics: form.watch("topics"),
//     difficulty: form.watch("difficulty").toUpperCase(),
//     paperType: form.watch("paperType"),
//   }
//   console.log(finalObj);

  function buildSectionA() {
    return {
      paperConfig: {
        boardName: "Private School/Coaching (ABC-XYZ)",
        subject: form.watch("subject"),
        date: new Date().toISOString(),
        totalMarks: 10,
        timeAllowed: 30,
        sections: [
          {
            title: 'SECTION "A" (Multiple Choice Questions)',
            is_qa: "MCQ",
            marks: "[Marks: 10]",
            questionLineSpacing: 2,
            questionConfig: {
              question_length: 10,
              difficulty_level: form.watch("difficulty").toUpperCase() || "MEDIUM",
              content_id: form.watch("topics")?.map((t) => t.topicID) || []
            }
          }
        ],
      },
      papertypeAI: false
    };
  }

  return (
    <div>
      <Button
        disabled={isLoading}
        onClick={() => mutate(buildSectionA())}
      >
        {isLoading ? "Generating..." : "Generate Paper"}
      </Button>
    </div>
  );
};

export default GeneratePaper;
