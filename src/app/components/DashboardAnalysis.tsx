import { useState, useRef, useEffect } from "react";
import { CloudUpload, Loader2 } from "lucide-react";

interface DashboardAnalysisProps {
  latestResult: {
    result: string;
    confidence: number;
    status: "danger" | "warning" | "safe";
  };
  onAnalysisComplete?: (result: any) => void;
}

export function DashboardAnalysis({
  latestResult,
  onAnalysisComplete,
}: DashboardAnalysisProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisData, setAnalysisData] = useState<{
    result: string;
    confidence: number;
    status: "danger" | "warning" | "safe";
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setShowResult(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!uploadedImage || !agreedToTerms) {
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);

    try {
      const response = await fetch(uploadedImage);
      const blob = await response.blob();
      const file = new File([blob], "skin.jpg", { type: blob.type });

      const formData = new FormData();
      formData.append("file", file);

      const aiResponse = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });

      if (!aiResponse.ok) {
        throw new Error("Server lỗi: " + aiResponse.status);
      }

      const data = await aiResponse.json();

      const status: "danger" | "warning" | "safe" =
        data.confidence >= 0.85
          ? "danger"
          : data.confidence >= 0.6
            ? "warning"
            : "safe";

      const result = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString("vi-VN"),
        time: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        image: uploadedImage,
        result: data.prediction,
        confidence: Math.round(data.confidence * 100),
        status: status,
      };

      setAnalysisData(result);
      setIsAnalyzing(false);
      setShowResult(true);

      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (error) {
      setIsAnalyzing(false);
      alert(
        "❌ Không thể kết nối AI Server. Hãy chắc chắn Python đang chạy ở port 5000.",
      );
      console.error(error);
    }
  };

  useEffect(() => {
    if (isAnalyzing) {
      const duration = 3000;
      const interval = 50;
      const increment = (100 / duration) * interval;

      const timer = setInterval(() => {
        setProgress((prev) => {
          const next = prev + increment;
          if (next >= 100) {
            clearInterval(timer);
            return 100;
          }
          return next;
        });
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isAnalyzing]);

  const handleClearImage = () => {
    setUploadedImage(null);
    setShowResult(false);
    setAgreedToTerms(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onAnalysisComplete) {
      onAnalysisComplete(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg">Hệ thống phân tích</h2>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/jpeg,image/png,image/jpg"
        className="hidden"
      />

      {!showResult ? (
        <div className="flex-1 flex flex-col">
          {!uploadedImage ? (
            <div className="mb-4">
              <div className="p-2 bg-white rounded-xl shadow-sm border-4 border-gray-300 aspect-video">
                <div
                  onClick={handleUploadClick}
                  className="size-full border-2 border-dashed border-gray-400 rounded-lg bg-gray-50/30 text-center cursor-pointer hover:bg-gray-50/50 transition-colors flex items-center justify-center"
                >
                  <div className="flex flex-col items-center gap-2 p-4">
                    <div className="size-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <CloudUpload className="size-6 text-gray-900" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 mb-1 text-sm">
                        Kéo thả ảnh hoặc tải ảnh từ thiết bị
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleUploadClick}
                      className="px-4 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-xs"
                    >
                      Tải ảnh
                    </button>
                    <p className="text-[10px] text-gray-500 mt-1">
                      Hỗ trợ định dạng JPG, PNG. Đảm bảo ảnh rõ nét, đủ sáng.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <div className="p-2 bg-white rounded-xl shadow-sm border-4 border-gray-300">
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  className="w-full aspect-video object-cover rounded-lg"
                />
              </div>
            </div>
          )}

          {isAnalyzing ? (
            <div className="mb-4 bg-gray-100 border border-gray-300 rounded-lg p-4">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Loader2 className="size-5 text-gray-900 animate-spin" />
                <span className="text-sm font-medium text-gray-800">
                  Đang xử lý và phân tích ảnh...
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-300 rounded-full h-2.5">
                  <div
                    className="bg-gray-900 h-2.5 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-800 min-w-[45px] text-right">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          ) : (
            <div className="mb-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 size-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                />
                <span className="text-sm text-gray-700">
                  Xác nhận ảnh chụp thuộc quyền sở hữu của tôi và đồng ý chia sẻ
                  cho hệ thống phân tích. Tôi đã đọc và hiểu rõ{" "}
                  <strong>Điều khoản bảo mật</strong>{" "}
                  <a href="#" className="text-gray-900 hover:underline"></a>
                </span>
              </label>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={handleAnalyze}
              disabled={!uploadedImage || !agreedToTerms || isAnalyzing}
              className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg hover:opacity-90 transition-opacity font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? "Đang phân tích..." : "Phân tích"}
            </button>
            <button
              onClick={handleClearImage}
              disabled={!uploadedImage || isAnalyzing}
              className="w-full px-4 py-3 bg-white border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Xóa ảnh
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="mb-4">
            <div className="p-2 bg-white rounded-xl shadow-sm border-4 border-gray-300">
              <img
                src={uploadedImage!}
                alt="Analysis"
                className="w-full aspect-video object-cover rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-sm text-gray-600 mb-1">Kết quả chẩn đoán:</p>
              <p className="font-bold text-lg">
                {analysisData?.result ?? latestResult.result}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  Độ tin cậy (Confidence):
                </span>
                <span className="font-bold text-lg">
                  {analysisData?.confidence ?? latestResult.confidence}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-red-500 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${analysisData?.confidence ?? latestResult.confidence}%`,
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <button
                onClick={() => {
                  setShowResult(false);
                  setAgreedToTerms(false);
                }}
                className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg hover:opacity-90 transition-opacity font-medium text-sm"
              >
                Phân tích lại
              </button>
              <button
                onClick={() => {
                  setShowResult(false);
                  handleClearImage();
                }}
                className="w-full px-4 py-3 bg-white border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm"
              >
                Xóa ảnh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
