import { useEffect, useState } from "react";
import { Smartphone } from "lucide-react";

const MOBILE_BREAKPOINT = 768;

export const MobileOnly = ({ children }: { children: React.ReactNode }) => {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= MOBILE_BREAKPOINT : false,
  );

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= MOBILE_BREAKPOINT);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (!isDesktop) return <>{children}</>;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mx-auto mb-5">
          <Smartphone className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">
          Mobile Only Experience
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          This app is designed for mobile devices. Please open it on your phone,
          or resize your browser window to a mobile width to continue.
        </p>
        <div className="text-xs text-slate-500 bg-slate-50 rounded-xl px-4 py-3">
          <p className="font-semibold text-slate-700 mb-1">On desktop browser:</p>
          <p>Press F12 → toggle device toolbar, or resize window below 768px.</p>
        </div>
      </div>
    </div>
  );
};

export default MobileOnly;
