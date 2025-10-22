import { useEffect, useState } from "react";
import StepForm from "@/components/StepForm";
import Striper from "@/components/striper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useFormContext } from "react-hook-form";
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export function SelectionForm() {
  const navigate = useNavigate();
  const totalSteps = 6;
  const [currentStep, setCurrentStep] = useState(1);
  const { user, setUser } = useAuth();
  const form = useFormContext?.();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/");
    }
  }, [setUser, navigate]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      console.log("📄 Generate Paper API call here...", form?.getValues());
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const isNextDisabled = () => {
    if (!form) return false;
    const values = form.getValues();

    if (currentStep === 1) return !values.class || !values.book;
    if (currentStep === 2) return !values.chapters || values.chapters.length === 0;
    if (currentStep === 3) return !values.topics || values.topics.length === 0;
    return false;
  };

  const handleLogout = () => {
    googleLogout();

    localStorage.removeItem("user");
    sessionStorage.clear();

    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });

    setUser(null);
    toast.success("You have been logged out successfully!");
    setTimeout(() => {
      navigate("/");
    }, 300);
  };

  return (
    <div className="p-5 text-center">
      <div className="mb-8 max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl shadow-sm border gap-4 sm:gap-0">
        <div className="text-center sm:text-left">
          <h2 className="text-lg font-semibold text-gray-800">
            👋 Hello, <span className="text-primary">{user?.name || "Guest"}</span>
          </h2>
          <p className="text-sm text-gray-500">Hope you're having a productive day!</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <p className="font-medium text-gray-800 hidden sm:block">{user?.name || "User"}</p>
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/40 shadow-md transition-transform duration-300 hover:scale-105">
              <img
                src={
                  user?.picture ||
                  "https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png"
                }
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg shadow hover:bg-primary/90 transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      <Card className="w-full max-w-[1440px] mx-auto shadow-lg p-0">
        <div className="flex items-center justify-between w-full border-b p-6 bg-gray-100 rounded-tl-xl rounded-tr-xl">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <Striper currentStep={currentStep} totalSteps={totalSteps} />
          </div>

          <div className="text-center">
            <h1 className="text-xl font-semibold">
              {currentStep === 1 && "Class and Subject"}
              {currentStep === 2 && "Chapter Selection"}
              {currentStep === 3 && "Topic Selection"}
              {currentStep === 4 && "Difficulty Selection"}
              {currentStep === 5 && "Paper Type"}
              {currentStep === 6 && "Generate Paper"}
            </h1>
            <p className="text-sm">
              {currentStep < totalSteps && (
                <>
                  Next:{" "}
                  <span className="font-medium text-primary">
                    {currentStep === 1 && "Chapter selection"}
                    {currentStep === 2 && "Topic selection"}
                    {currentStep === 3 && "Difficulty selection"}
                    {currentStep === 4 && "Paper type"}
                    {currentStep === 5 && "Generate Paper"}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        <CardContent className="space-y-6">
          <StepForm currentStep={currentStep} />
        </CardContent>

        <CardFooter className="flex justify-between border-t bg-gray-100 p-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>

          {currentStep === totalSteps ? (
            <Button type="button" onClick={handleNext}>
              Generate Paper
            </Button>
          ) : (
            <Button type="button" onClick={handleNext} disabled={isNextDisabled()}>
              Next
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default SelectionForm;
