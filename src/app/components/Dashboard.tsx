import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  LogOut,
  AlertTriangle,
  Search,
  Eye,
  Download,
  Trash2,
  User,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Scan,
  CalendarCheck,
  Calendar,
  ShoppingBag,
  ShoppingCart,
  FileText,
  History,
  Phone,
  Upload,
  ArrowLeft,
  Save,
  Droplet,
  Sparkles,
  Palette,
  Wind,
  Zap,
  MapPin,
  Star,
  CheckCircle,
  X,
  Stethoscope,
  CreditCard,
} from "lucide-react";
import { DashboardAnalysis } from "./DashboardAnalysis";
import { diseaseDetails, aiToDiseaseName } from "./diseaseData";
import { HealthOverview } from "./HealthOverview";

interface DashboardProps {
  userInfo: {
    identifier: string;
    loginMethod: "email" | "phone";
  };
  onLogout: () => void;
}

interface AnalysisRecord {
  id: string;
  date: string;
  time: string;
  image: string;
  result: string;
  confidence: number;
  status: "danger" | "warning" | "safe";
}

type MenuItem =
  | "overview"
  | "analysis"
  | "appointment"
  | "schedule"
  | "products"
  | "orders"
  | "health-record"
  | "history";

export function Dashboard({ userInfo, onLogout }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenu, setActiveMenu] = useState<MenuItem>("overview");
  const [analysisResult, setAnalysisResult] = useState<AnalysisRecord | null>(
    null,
  );
  const [viewingHistoryRecord, setViewingHistoryRecord] =
    useState<AnalysisRecord | null>(null);
  const [isEditingHealthRecord, setIsEditingHealthRecord] = useState(false);
  const [skinAnalysisImage, setSkinAnalysisImage] = useState<string | null>(
    null,
  );
  const [skinMetrics, setSkinMetrics] = useState<{
    moisture: number;
    elasticity: number;
    pigmentation: number;
    oiliness: number;
    acne: number;
    overall: number;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [animatedMetrics, setAnimatedMetrics] = useState<{
    moisture: number;
    elasticity: number;
    pigmentation: number;
    oiliness: number;
    acne: number;
    overall: number;
  }>({
    moisture: 0,
    elasticity: 0,
    pigmentation: 0,
    oiliness: 0,
    acne: 0,
    overall: 0,
  });
  const [savedHealthData, setSavedHealthData] = useState<{
    name: string;
    phone: string;
    birthDate: string;
    gender: string;
    email: string;
    address: string;
    skinImage: string | null;
    skinMetrics: typeof skinMetrics;
  } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    birthDate: "",
    gender: "",
    email: "",
    address: "",
  });
  const [isBookingAppointment, setIsBookingAppointment] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState({
    doctor: "",
    date: "",
    time: "",
  });
  const [bookingStep, setBookingStep] = useState(1); // 1: form đặt lịch, 2: xác nhận, 3: thanh toán
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [appointments, setAppointments] = useState<
    Array<{
      id: string;
      hospital: string;
      doctor: string;
      specialty: string;
      service: string;
      date: string;
      time: string;
      patientInfo: {
        name: string;
        phone: string;
        birthDate: string;
        gender: string;
      };
      paymentMethod: string;
      price: string;
      status: string;
    }>
  >([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPaymentMethod, setOrderPaymentMethod] = useState("");
  const [showOrderSuccessModal, setShowOrderSuccessModal] = useState(false);
  const [productVariant, setProductVariant] = useState("Vĩ");
  const [productQuantity, setProductQuantity] = useState(1);
  const [cart, setCart] = useState<
    Array<{
      id: string;
      name: string;
      image: string;
      variant: string;
      quantity: number;
      unitPrice: number;
    }>
  >([]);
  const [orders, setOrders] = useState<
    Array<{
      id: string;
      orderNumber: string;
      date: string;
      items: Array<{
        id: string;
        name: string;
        image: string;
        variant: string;
        quantity: number;
        unitPrice: number;
      }>;
      recipient: {
        name: string;
        phone: string;
        address: string;
      };
      paymentMethod: string;
      totalAmount: number;
      status: string;
      statusIndex: number;
    }>
  >([]);

  // Mock data
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisRecord[]>([]);
  const latestResult = analysisHistory[0] ?? {
    result: "",
    confidence: 0,
    status: "safe" as const,
  };

  const products = [
    {
      id: "1",
      name: "Telfast BD",
      description: "Trị viêm mũi dị ứng, mày đay",
      price: 126000,
      image:
        "https://img.tgdd.vn/imgt/ankhang/f_webp,fit_outside,quality_95/https://cdnv2.tgdd.vn/mwg-static/ankhang/Products/Images/10036/292598/telfast-bd-60mg-hop-30v-fix-thumb-638693591760795255-600x600.jpg",
    },
    {
      id: "2",
      name: "Alorax",
      description: "Trị dị ứng (hắt hơi, ngứa, sổ mũi)",
      price: 90000,
      image:
        "https://img.tgdd.vn/imgt/ankhang/f_webp,fit_outside,quality_95/https://cdnv2.tgdd.vn/mwg-static/ankhang/Products/Images/10036/194819/thuoc-dieu-tri-di-ung-alorax-10mg-100-vien-fix-thumb-638684068219486066-600x600.jpg",
    },
    {
      id: "3",
      name: "Lorastad",
      description: "Trị dị ứng (viêm mũi dị ứng, mề đay)",
      price: 9000,
      image:
        "https://img.tgdd.vn/imgt/ankhang/f_webp,fit_outside,quality_95/https://cdnv2.tgdd.vn/mwg-static/ankhang/Products/Images/10036/160774/fexostad-60-fix-thumb-638684059561843201-300x300.jpg",
    },
    {
      id: "4",
      name: "Dimenhydrinat Traphaco",
      description: "Trị buồn nôn, chóng mặt, say tàu xe.",
      price: 40000,
      image:
        "https://img.tgdd.vn/imgt/ankhang/f_webp,fit_outside,quality_95/https://cdnv2.tgdd.vn/mwg-static/ankhang/Products/Images/10036/129918/dimenhydrinat-50mg-thumb-638682317267151999-600x600.jpg",
    },
    {
      id: "5",
      name: "Vaco Pola",
      description: "Trị sổ mũi dị ứng, viêm mũi",
      price: 160000,
      image:
        "https://img.tgdd.vn/imgt/ankhang/f_webp,fit_outside,quality_95/https://cdnv2.tgdd.vn/mwg-static/ankhang/Products/Images/10036/299766/vacopola-2mg-thumb-638677841285992558-300x300.jpg",
    },
    {
      id: "6",
      name: "Cồn Alcool 70 độ",
      description: "Sát trùng ngoài da",
      price: 3000,
      image:
        "https://img.tgdd.vn/imgt/ankhang/f_webp,fit_outside,quality_95/https://cdn.tgdd.vn/Products/Images/12119/131024/alcool-70-60ml-thumb01-600x600.jpg",
    },
    {
      id: "7",
      name: "Cồn Alcool 90 độ",
      description: "Sát trùng vết thương",
      price: 5000,
      image:
        "https://img.tgdd.vn/imgt/ankhang/f_webp,fit_outside,quality_95/https://cdn.tgdd.vn/Products/Images/12119/130201/alcool-xanh-90-thumb-1-600x600.jpg",
    },
    {
      id: "8",
      name: "Antanazalo",
      description: "Trị nấm da",
      price: 26000,
      image:
        "https://img.tgdd.vn/imgt/ankhang/f_webp,fit_outside,quality_95/https://cdn.tgdd.vn/Products/Images/10037/243380/antanazol-cream-10g-thumb-01-600x600.jpg",
    },
    {
      id: "9",
      name: "Bacterocin Oint",
      description: "Trị nhiễm trùng",
      price: 38000,
      image:
        "https://img.tgdd.vn/imgt/ankhang/f_webp,fit_outside,quality_95/https://cdn.tgdd.vn/Products/Images/10037/284398/bacterocin-oint-tube-15g-thumb-1-600x600.jpg",
    },
    {
      id: "10",
      name: "Biroxime",
      description: "Trị nấm da",
      price: 28000,
      image:
        "https://img.tgdd.vn/imgt/ankhang/f_webp,fit_outside,quality_95/https://cdn.tgdd.vn/Products/Images/10037/313090/kem-boi-biroxime-tri-nam-da-tuyp-20g-thumb-1-600x600.jpg",
    },
  ];

  // Animate progress bars - tất cả thanh chạy cùng lúc
  useEffect(() => {
    if (skinMetrics && !isAnalyzing) {
      // Reset tất cả về 0 trước
      setAnimatedMetrics({
        moisture: 0,
        elasticity: 0,
        pigmentation: 0,
        oiliness: 0,
        acne: 0,
        overall: 0,
      });

      const duration = 1500;
      const steps = 60;
      const interval = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        // Tất cả thanh đều update cùng lúc với cùng 1 progress
        setAnimatedMetrics({
          moisture: Math.floor(skinMetrics.moisture * progress),
          elasticity: Math.floor(skinMetrics.elasticity * progress),
          pigmentation: Math.floor(skinMetrics.pigmentation * progress),
          oiliness: Math.floor(skinMetrics.oiliness * progress),
          acne: Math.floor(skinMetrics.acne * progress),
          overall: Math.floor(skinMetrics.overall * progress),
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setAnimatedMetrics(skinMetrics);
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [skinMetrics, isAnalyzing]);

  // Auto update order status every 5 seconds
  useEffect(() => {
    const statusFlow = [
      "Chờ Xác Nhận",
      "Chờ Lấy Hàng",
      "Chờ Giao Hàng",
      "Đã Giao",
    ];

    const timer = setInterval(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.statusIndex < statusFlow.length - 1) {
            const newStatusIndex = order.statusIndex + 1;
            return {
              ...order,
              statusIndex: newStatusIndex,
              status: statusFlow[newStatusIndex],
            };
          }
          return order;
        }),
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "danger":
        return "bg-red-500";
      case "warning":
        return "bg-orange-500";
      case "safe":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "bg-red-100 text-red-700";
    if (confidence >= 80) return "bg-green-100 text-green-700";
    return "bg-orange-100 text-orange-700";
  };

  const menuItems = [
    { id: "overview" as MenuItem, label: "Tổng quan", icon: LayoutDashboard },
    { id: "analysis" as MenuItem, label: "Phân tích da", icon: Scan },
    {
      id: "appointment" as MenuItem,
      label: "Đặt khám chuyên khoa",
      icon: CalendarCheck,
    },
    { id: "schedule" as MenuItem, label: "Lịch hẹn", icon: Calendar },
    { id: "products" as MenuItem, label: "Sản Phẩm", icon: ShoppingBag },
    { id: "orders" as MenuItem, label: "Đơn mua", icon: ShoppingCart },
    {
      id: "health-record" as MenuItem,
      label: "Hồ sơ sức khỏe",
      icon: FileText,
    },
    { id: "history" as MenuItem, label: "Lịch sử phân tích", icon: History },
  ];

  return (
    <div className="size-full bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <div>
              <span className="font-bold text-lg text-gray-900">
                SkinCare System
              </span>
              <p className="text-xs text-gray-500">Hệ thống phân tích da</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="size-10 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">KH</span>
            </div>
            <button
              onClick={() => setShowCartModal(true)}
              className="relative flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors font-medium"
            >
              <ShoppingCart className="size-4" />
              Giỏ hàng
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 size-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors font-medium"
            >
              <LogOut className="size-4" />
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    activeMenu === item.id
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="size-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Phân tích Da liễu */}
            {activeMenu === "analysis" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                {/* Left Column - Hệ thống phân tích */}
                <div className="lg:col-span-1 space-y-6">
                  <DashboardAnalysis
                    latestResult={latestResult}
                    onAnalysisComplete={(result) => {
                      if (result) {
                        const mappedName =
                          aiToDiseaseName[result.result] || result.result;
                        const finalResult = { ...result, result: mappedName };
                        setAnalysisResult(finalResult);
                        setAnalysisHistory((prev) => [finalResult, ...prev]);
                      } else {
                        setAnalysisResult(null);
                      }
                    }}
                  />
                </div>

                {/* Right Column - Chi tiết kết quả đã phân tích */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full">
                    <h2 className="font-bold text-lg mb-6">
                      Chi tiết kết quả đã phân tích
                    </h2>

                    {analysisResult && diseaseDetails[analysisResult.result] ? (
                      <div
                        className="space-y-6 overflow-y-auto pr-2"
                        style={{ maxHeight: "calc(100vh - 280px)" }}
                      >
                        {/* Ảnh đã phân tích */}
                        <div>
                          <div className="p-2 bg-white rounded-xl shadow-sm border-4 border-gray-300">
                            {analysisResult?.image ? (
                              <img
                                src={analysisResult.image}
                                alt="Ảnh phân tích"
                                className="w-full rounded-lg object-cover aspect-video"
                              />
                            ) : (
                              <div className="w-full bg-gray-900 rounded-lg flex items-center justify-center aspect-video">
                                <span className="text-white text-2xl font-bold">
                                  IMAGE
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Tên bệnh chính */}
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {diseaseDetails[analysisResult.result].name}
                          </h3>
                        </div>

                        {/* Độ tin cậy */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">
                              Độ tin cậy (Confidence):
                            </span>
                            <span className="font-bold text-xl text-gray-900">
                              {analysisResult.confidence}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="h-3 rounded-full transition-all duration-100 bg-red-500"
                              style={{ width: `${analysisResult.confidence}%` }}
                            />
                          </div>
                        </div>

                        {/* Tất cả thông tin trong 1 ô xám */}
                        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                          <div>
                            <h4 className="font-bold text-gray-900 mb-2">
                              Mô tả
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {
                                diseaseDetails[analysisResult.result]
                                  .description
                              }
                            </p>
                          </div>

                          <div className="border-t border-gray-200 pt-4">
                            <h4 className="font-bold text-gray-900 mb-2">
                              Triệu chứng
                            </h4>

                            <ul className="space-y-1.5">
                              {diseaseDetails[
                                analysisResult.result
                              ].symptoms.map((symptom, index) => (
                                <li
                                  key={index}
                                  className="text-sm text-gray-700 flex items-start gap-2"
                                >
                                  <span className="text-gray-500 mt-1">•</span>
                                  <span>{symptom}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="border-t border-gray-200 pt-4">
                            <h4 className="font-bold text-gray-900 mb-2">
                              Nguyên nhân
                            </h4>

                            <ul className="space-y-1.5">
                              {diseaseDetails[analysisResult.result].causes.map(
                                (cause, index) => (
                                  <li
                                    key={index}
                                    className="text-sm text-gray-700 flex items-start gap-2"
                                  >
                                    <span className="text-gray-500 mt-1">
                                      •
                                    </span>
                                    <span>{cause}</span>
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>

                          <div className="border-t border-gray-200 pt-4">
                            <h4 className="font-bold text-gray-900 mb-2">
                              Đối tượng dễ mắc
                            </h4>

                            <ul className="space-y-1.5">
                              {diseaseDetails[
                                analysisResult.result
                              ].riskGroups.map((group, index) => (
                                <li
                                  key={index}
                                  className="text-sm text-gray-700 flex items-start gap-2"
                                >
                                  <span className="text-gray-500 mt-1">•</span>
                                  <span>{group}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="border-t border-gray-200 pt-4">
                            <h4 className="font-bold text-gray-900 mb-2">
                              Cách phòng chống
                            </h4>
                            <ul className="space-y-1.5">
                              {diseaseDetails[
                                analysisResult.result
                              ].prevention.map((prevention, index) => (
                                <li
                                  key={index}
                                  className="text-sm text-gray-700 flex items-start gap-2"
                                >
                                  <span className="text-gray-500 mt-1">•</span>
                                  <span>{prevention}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-gray-500">
                        <p className="text-center">
                          Chưa có kết quả phân tích.
                          <br />
                          Vui lòng tải ảnh và nhấn nút "Phân tích".
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tổng quan */}
            {activeMenu === "overview" && (
              <HealthOverview savedHealthData={savedHealthData} />
            )}

            {/* Đặt khám chuyên khoa */}
            {activeMenu === "appointment" && !isBookingAppointment && (
              <div className="space-y-6">
                <div>
                  {/* <h2 className="font-bold text-2xl mb-2">Đặt khám chuyên khoa</h2>
                  <p className="text-gray-600">Chọn bệnh viện để đặt lịch khám</p> */}
                </div>

                <div className="space-y-4">
                  {/* Bệnh viện 1 */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-6 justify-between">
                      <div className="flex items-center gap-6 flex-1">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                          <img
                            src="https://bo-api.medpro.com.vn:5000/static/images/nhidong1/app/image/logo_circle.png?t=11111&w=64&q=75"
                            alt="Bệnh viện Da Liễu Phú Yên"
                            className="size-20 rounded-full object-cover"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-lg text-gray-900">
                              Bệnh viện Da Liễu Phú Yên
                            </h3>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600 mb-3">
                            <MapPin className="size-4" />
                            <span className="text-sm">
                              Huyện Đông Xuân, Tỉnh Phú Yên
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-bold text-orange-500">
                              (4.5)
                            </span>
                            <div className="flex items-center gap-1">
                              <Star
                                className="size-4 text-orange-400"
                                fill="currentColor"
                              />
                              <Star
                                className="size-4 text-orange-400"
                                fill="currentColor"
                              />
                              <Star
                                className="size-4 text-orange-400"
                                fill="currentColor"
                              />
                              <Star
                                className="size-4 text-orange-400"
                                fill="currentColor"
                              />
                              <Star
                                className="size-4 text-orange-400"
                                fill="url(#half-star)"
                              />
                              <svg width="0" height="0">
                                <defs>
                                  <linearGradient id="half-star">
                                    <stop
                                      offset="50%"
                                      stopColor="rgb(251 146 60)"
                                    />
                                    <stop
                                      offset="50%"
                                      stopColor="rgb(209 213 219)"
                                    />
                                  </linearGradient>
                                </defs>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Nút Đặt khám - Bên phải */}
                      <div className="flex-shrink-0 flex items-center">
                        <button
                          onClick={() => {
                            setSelectedHospital("Bệnh viện Da Liễu Phú Yên");
                            setIsBookingAppointment(true);
                          }}
                          className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors whitespace-nowrap"
                        >
                          Đặt khám ngay
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bệnh viện 2 */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-6 justify-between">
                      <div className="flex items-center gap-6 flex-1">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                          <img
                            src="https://cdn.medpro.vn/prod-partner/54752409-33d3-498f-a4ae-00fef667678e-logo-bv-nhan-dan-115-circle.jpg?w=64&q=75"
                            alt="Bệnh viện Da Liễu Quảng Bình"
                            className="size-20 rounded-full object-cover"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-lg text-gray-900">
                              Bệnh viện Da Liễu Quảng Bình
                            </h3>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600 mb-3">
                            <MapPin className="size-4" />
                            <span className="text-sm">
                              Huyện Quảng Ninh, Tỉnh Quảng Bình
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-bold text-orange-500">
                              (4)
                            </span>
                            <div className="flex items-center gap-1">
                              <Star
                                className="size-4 text-orange-400"
                                fill="currentColor"
                              />
                              <Star
                                className="size-4 text-orange-400"
                                fill="currentColor"
                              />
                              <Star
                                className="size-4 text-orange-400"
                                fill="currentColor"
                              />
                              <Star
                                className="size-4 text-orange-400"
                                fill="currentColor"
                              />
                              <Star
                                className="size-4 text-gray-300"
                                fill="currentColor"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Nút Đặt khám - Bên phải */}
                      <div className="flex-shrink-0 flex items-center">
                        <button
                          onClick={() => {
                            setSelectedHospital("Bệnh viện Da Liễu Quảng Bình");
                            setIsBookingAppointment(true);
                          }}
                          className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors whitespace-nowrap"
                        >
                          Đặt khám ngay
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bệnh viện 3 */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-6 justify-between">
                      <div className="flex items-center gap-6 flex-1">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                          <img
                            src="https://cdn.medpro.vn/prod-partner/a5ce4c68-5edb-46d8-bef9-267b78515fe7-logo.jpg?w=64&q=75"
                            alt="Bệnh viện Da Liễu Quảng Nam"
                            className="size-20 rounded-full object-cover"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-lg text-gray-900">
                              Bệnh viện Da Liễu Quảng Nam
                            </h3>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600 mb-3">
                            <MapPin className="size-4" />
                            <span className="text-sm">
                              Huyện Duy Xuyên, Tỉnh Quảng Nam
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-bold text-orange-500">
                              (4)
                            </span>
                            <div className="flex items-center gap-1">
                              <Star
                                className="size-4 text-orange-400"
                                fill="currentColor"
                              />
                              <Star
                                className="size-4 text-orange-400"
                                fill="currentColor"
                              />
                              <Star
                                className="size-4 text-orange-400"
                                fill="currentColor"
                              />
                              <Star
                                className="size-4 text-orange-400"
                                fill="currentColor"
                              />
                              <Star
                                className="size-4 text-gray-300"
                                fill="currentColor"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Nút Đặt khám - Bên phải */}
                      <div className="flex-shrink-0 flex items-center">
                        <button
                          onClick={() => {
                            setSelectedHospital("Bệnh viện Da Liễu Quảng Nam");
                            setIsBookingAppointment(true);
                          }}
                          className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors whitespace-nowrap"
                        >
                          Đặt khám ngay
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Đặt lịch khám - Bước 1 */}
            {activeMenu === "appointment" &&
              isBookingAppointment &&
              bookingStep === 1 && (
                <div className="space-y-6">
                  {/* Header đã xóa */}

                  <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <h2 className="font-bold text-2xl mb-8">
                      Đặt lịch khám chuyên khoa
                    </h2>

                    <div className="space-y-6">
                      {/* Chọn bác sĩ */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Bác sĩ <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={bookingData.doctor}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              doctor: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent appearance-none bg-white"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 12px center",
                            backgroundSize: "20px",
                          }}
                        >
                          <option value="">Chọn bác sĩ</option>
                          <option value="BS Dương Gia">BS Dương Gia</option>
                          <option value="BS Trần Thị Khánh Linh">
                            BS Trần Thị Khánh Linh
                          </option>
                          <option value="BS Nguyễn Thị Huỳnh Như">
                            BS Nguyễn Thị Huỳnh Như
                          </option>
                          <option value="BS Võ Tấn Huy">BS Võ Tấn Huy</option>
                          <option value="BS Lê Thanh Xin">
                            BS Lê Thanh Xin
                          </option>
                        </select>
                      </div>

                      {/* Chuyên khoa */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Chuyên khoa <span className="text-red-500">*</span>
                        </label>
                        <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed">
                          Da liễu
                        </div>
                      </div>

                      {/* Dịch vụ */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Dịch vụ <span className="text-red-500">*</span>
                        </label>
                        <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed">
                          Da liễu
                        </div>
                      </div>

                      {/* Ngày khám */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Ngày khám <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                          {["07/05", "08/05", "09/05"].map(
                            (dateLabel, index) => (
                              <button
                                key={index}
                                onClick={() =>
                                  setBookingData({
                                    ...bookingData,
                                    date: dateLabel,
                                  })
                                }
                                className={`px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                                  bookingData.date === dateLabel
                                    ? "border-gray-900 bg-gray-900 text-white"
                                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-900"
                                }`}
                              >
                                {dateLabel}
                              </button>
                            ),
                          )}
                          <button className="px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium bg-white text-gray-700 hover:border-gray-900 flex items-center justify-center gap-2">
                            <Calendar className="size-4" />
                            Ngày khác
                          </button>
                        </div>
                      </div>

                      {/* Giờ khám */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Giờ khám <span className="text-red-500">*</span>
                        </label>

                        {/* Buổi sáng */}
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-900 mb-3">
                            Buổi sáng
                          </p>
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              "07:30 - 08:30",
                              "08:30 - 09:30",
                              "09:30 - 10:30",
                            ].map((time) => (
                              <button
                                key={time}
                                onClick={() =>
                                  setBookingData({ ...bookingData, time })
                                }
                                className={`px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                                  bookingData.time === time
                                    ? "border-gray-900 bg-gray-900 text-white"
                                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-900"
                                }`}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Buổi chiều */}
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-3">
                            Buổi chiều
                          </p>
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              "13:30 - 14:30",
                              "14:30 - 15:30",
                              "15:30 - 16:30",
                            ].map((time) => (
                              <button
                                key={time}
                                onClick={() =>
                                  setBookingData({ ...bookingData, time })
                                }
                                className={`px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                                  bookingData.time === time
                                    ? "border-gray-900 bg-gray-900 text-white"
                                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-900"
                                }`}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Nút hành động */}
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => {
                            setIsBookingAppointment(false);
                            setBookingData({ doctor: "", date: "", time: "" });
                            setBookingStep(1);
                          }}
                          className="py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                          Quay lại
                        </button>
                        <button
                          disabled={
                            !bookingData.doctor ||
                            !bookingData.date ||
                            !bookingData.time
                          }
                          onClick={() => {
                            if (
                              bookingData.doctor &&
                              bookingData.date &&
                              bookingData.time
                            ) {
                              setBookingStep(2);
                            }
                          }}
                          className={`py-3 rounded-lg font-medium transition-colors ${
                            bookingData.doctor &&
                            bookingData.date &&
                            bookingData.time
                              ? "bg-gray-900 hover:bg-gray-800 text-white cursor-pointer"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          Tiếp tục
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {/* Xác nhận đặt khám - Bước 2 */}
            {activeMenu === "appointment" &&
              isBookingAppointment &&
              bookingStep === 2 && (
                <div className="space-y-6">
                  <div className="max-w-2xl mx-auto">
                    {/* Thông tin đặt khám */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                      <h3 className="font-bold text-lg mb-6 text-gray-900">
                        Thông tin đặt khám
                      </h3>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <User className="size-5 text-gray-900" />
                          <span className="text-gray-700">
                            {bookingData.doctor}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <svg
                            className="size-5 text-gray-900"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                            />
                          </svg>
                          <span className="text-gray-700">Da liễu</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <FileText className="size-5 text-gray-900" />
                          <span className="text-gray-700">Da liễu</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <Calendar className="size-5 text-gray-900" />
                          <span className="text-gray-700">
                            {bookingData.date} ({bookingData.time})
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <svg
                            className="size-5 text-gray-900"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          <span className="text-gray-700 font-medium">
                            320.000 đ
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Thông tin bệnh nhân */}
                    {savedHealthData && (
                      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                        <h3 className="font-bold text-lg mb-4 text-gray-900">
                          Hồ sơ sức khỏe
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              Họ và tên
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {savedHealthData.name || "---"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              Số điện thoại
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {savedHealthData.phone || "---"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              Ngày sinh
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {savedHealthData.birthDate || "---"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              Giới tính
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {savedHealthData.gender || "---"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Nút hành động */}
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setBookingStep(1)}
                        className="py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Quay lại
                      </button>
                      <button
                        onClick={() => setBookingStep(3)}
                        className="py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors"
                      >
                        Tiếp tục
                      </button>
                    </div>
                  </div>
                </div>
              )}

            {/* Thanh toán - Bước 3 */}
            {activeMenu === "appointment" &&
              isBookingAppointment &&
              bookingStep === 3 && (
                <div className="space-y-6">
                  <div className="max-w-2xl mx-auto">
                    {/* Tên bệnh viện */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                      <h2 className="font-bold text-2xl text-gray-900 mb-2">
                        {selectedHospital}
                      </h2>
                      <p className="text-gray-600">Xác nhận thanh toán</p>
                    </div>

                    {/* Thông tin đặt khám */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                      <h3 className="font-bold text-lg mb-4 text-gray-900">
                        Thông tin đặt khám
                      </h3>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <User className="size-5 text-gray-900" />
                          <span className="text-gray-700">
                            {bookingData.doctor}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <svg
                            className="size-5 text-gray-900"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                            />
                          </svg>
                          <span className="text-gray-700">Da liễu</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <Calendar className="size-5 text-gray-900" />
                          <span className="text-gray-700">
                            {bookingData.date} ({bookingData.time})
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <svg
                            className="size-5 text-gray-900"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          <span className="text-gray-700 font-medium">
                            320.000 đ
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Thông tin bệnh nhân */}
                    {savedHealthData && (
                      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                        <h3 className="font-bold text-lg mb-4 text-gray-900">
                          Hồ sơ sức khỏe
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              Họ và tên
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {savedHealthData.name || "---"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              Số điện thoại
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {savedHealthData.phone || "---"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              Ngày sinh
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {savedHealthData.birthDate || "---"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              Giới tính
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {savedHealthData.gender || "---"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Phương thức thanh toán */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                      <h3 className="font-bold text-lg mb-4 text-gray-900">
                        Phương thức thanh toán
                      </h3>

                      <div className="space-y-3">
                        {/* MoMo */}
                        <label
                          className="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          style={{
                            borderColor:
                              paymentMethod === "momo" ? "#000" : "#e5e7eb",
                          }}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value="momo"
                            checked={paymentMethod === "momo"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="size-5"
                          />
                          <img
                            src="https://images.seeklogo.com/logo-png/42/1/momo-logo-png_seeklogo-425716.png"
                            alt="MoMo"
                            className="size-12 object-contain"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">Ví MoMo</p>
                            <p className="text-sm text-gray-600">
                              Thanh toán qua ví điện tử MoMo
                            </p>
                          </div>
                        </label>

                        {/* Thanh toán tại cơ sở */}
                        <label
                          className="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          style={{
                            borderColor:
                              paymentMethod === "onsite" ? "#000" : "#e5e7eb",
                          }}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value="onsite"
                            checked={paymentMethod === "onsite"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="size-5"
                          />
                          <div className="size-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <svg
                              className="size-7 text-gray-900"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              Thanh toán tại bệnh viện
                            </p>
                            <p className="text-sm text-gray-600">
                              Thanh toán trực tiếp khi đến khám
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Nút hành động */}
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setBookingStep(2)}
                        className="py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Quay lại
                      </button>
                      <button
                        disabled={!paymentMethod}
                        onClick={() => {
                          if (paymentMethod === "momo") {
                            window.open(
                              "https://me.momo.vn/N6IpTps8fMtjTwUOIdi9f9",
                              "_blank",
                            );
                          }
                          setShowSuccessModal(true);
                        }}
                        className={`py-3 rounded-lg font-medium transition-colors ${
                          paymentMethod
                            ? "bg-gray-900 hover:bg-gray-800 text-white cursor-pointer"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        Tiếp tục
                      </button>
                    </div>
                  </div>
                </div>
              )}

            {/* Modal thành công */}
            {showSuccessModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Backdrop */}
                <div
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                  onClick={() => {
                    // Lưu lịch hẹn
                    const newAppointment = {
                      id: Date.now().toString(),
                      hospital: selectedHospital || "",
                      doctor: bookingData.doctor,
                      specialty: "Da liễu",
                      service: "Da liễu",
                      date: bookingData.date,
                      time: bookingData.time,
                      patientInfo: {
                        name: savedHealthData?.name || "",
                        phone: savedHealthData?.phone || "",
                        birthDate: savedHealthData?.birthDate || "",
                        gender: savedHealthData?.gender || "",
                      },
                      paymentMethod:
                        paymentMethod === "momo"
                          ? "Thanh toán qua MoMo"
                          : "Thanh toán tại cơ sở",
                      price: "320.000 đ",
                      status:
                        paymentMethod === "momo"
                          ? "Đã xác nhận"
                          : "Chờ xác nhận",
                    };
                    setAppointments([...appointments, newAppointment]);
                    setShowSuccessModal(false);
                    setIsBookingAppointment(false);
                    setBookingStep(1);
                    setPaymentMethod("");
                    setActiveMenu("schedule");
                  }}
                />

                {/* Modal */}
                <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 z-10">
                  {/* Close button */}
                  <button
                    onClick={() => {
                      // Lưu lịch hẹn
                      const newAppointment = {
                        id: Date.now().toString(),
                        hospital: selectedHospital || "",
                        doctor: bookingData.doctor,
                        specialty: "Da liễu",
                        service: "Da liễu",
                        date: bookingData.date,
                        time: bookingData.time,
                        patientInfo: {
                          name: savedHealthData?.name || "",
                          phone: savedHealthData?.phone || "",
                          birthDate: savedHealthData?.birthDate || "",
                          gender: savedHealthData?.gender || "",
                        },
                        paymentMethod:
                          paymentMethod === "momo"
                            ? "Thanh toán qua MoMo"
                            : "Thanh toán tại cơ sở",
                        price: "320.000 đ",
                        status: "Chờ xác nhận",
                      };
                      setAppointments([...appointments, newAppointment]);
                      setShowSuccessModal(false);
                      setIsBookingAppointment(false);
                      setBookingStep(1);
                      setPaymentMethod("");
                      setActiveMenu("schedule");
                    }}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="size-6" />
                  </button>

                  {/* Success icon */}
                  <div className="flex justify-center mb-6">
                    <div className="size-20 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="size-12 text-green-600" />
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
                    Đặt Lịch Thành Công
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 text-center mb-8">
                    Lịch khám của bạn đã được xác nhận.
                  </p>

                  {/* Confirm button */}
                  <button
                    onClick={() => {
                      // Lưu lịch hẹn
                      const newAppointment = {
                        id: Date.now().toString(),
                        hospital: selectedHospital || "",
                        doctor: bookingData.doctor,
                        specialty: "Da liễu",
                        service: "Da liễu",
                        date: bookingData.date,
                        time: bookingData.time,
                        patientInfo: {
                          name: savedHealthData?.name || "",
                          phone: savedHealthData?.phone || "",
                          birthDate: savedHealthData?.birthDate || "",
                          gender: savedHealthData?.gender || "",
                        },
                        paymentMethod:
                          paymentMethod === "momo"
                            ? "Thanh toán qua MoMo"
                            : "Thanh toán tại cơ sở",
                        price: "320.000 đ",
                        status: "Chờ xác nhận",
                      };
                      setAppointments([...appointments, newAppointment]);
                      setShowSuccessModal(false);
                      setIsBookingAppointment(false);
                      setBookingStep(1);
                      setPaymentMethod("");
                      setActiveMenu("schedule");
                    }}
                    className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            )}

            {/* Lịch hẹn */}
            {activeMenu === "schedule" && (
              <div className="space-y-6">
                <div>
                  {/* <h2 className="font-bold text-2xl mb-2">Lịch hẹn</h2>
                  <p className="text-gray-600">Danh sách các lịch khám của bạn</p> */}
                </div>

                {appointments.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <Calendar className="size-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Chưa có lịch hẹn nào</p>
                    <p className="text-sm text-gray-500">
                      Đặt khám để tạo lịch hẹn mới
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="size-12 bg-blue-100 rounded-xl flex items-center justify-center">
                              <Calendar className="size-6 text-blue-500" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-gray-900">
                                {appointment.hospital}
                              </h3>
                            </div>
                          </div>
                          <span
                            className={`px-4 py-1.5 text-sm font-medium rounded-full ${
                              appointment.status === "Đã xác nhận"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {appointment.status}
                          </span>
                        </div>

                        {/* Grid 2 cột: Thông tin đặt khám và Thông tin bệnh nhân */}
                        <div className="grid grid-cols-2 gap-6 mb-6">
                          {/* Thông tin đặt khám */}
                          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                            <h3 className="font-bold text-lg text-gray-900 mb-4">
                              Thông tin đặt khám
                            </h3>

                            <div className="flex items-start gap-3">
                              <User className="size-5 text-gray-400 flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm text-gray-600">
                                  {appointment.doctor}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <Stethoscope className="size-5 text-gray-400 flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm text-gray-600">
                                  {appointment.specialty}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <Calendar className="size-5 text-gray-400 flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm text-gray-600">
                                  {appointment.date} ({appointment.time})
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <CreditCard className="size-5 text-gray-400 flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm text-gray-600">
                                  {appointment.price}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Thông tin bệnh nhân */}
                          <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-bold text-lg text-gray-900 mb-4">
                              Thông tin bệnh nhân
                            </h3>

                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                              <div>
                                <p className="text-sm text-gray-600 mb-1">
                                  Họ và tên
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                  {appointment.patientInfo.name}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">
                                  Số điện thoại
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                  {appointment.patientInfo.phone}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">
                                  Ngày sinh
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                  {appointment.patientInfo.birthDate}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">
                                  Giới tính
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                  {appointment.patientInfo.gender}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <span className="text-gray-600">Thanh toán: </span>
                            <span className="font-medium text-gray-900">
                              {appointment.paymentMethod}
                            </span>
                          </div>
                          <div className="font-bold text-2xl text-gray-900">
                            {appointment.price}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sản Phẩm */}
            {activeMenu === "products" && !showCheckout && (
              <div className="space-y-6">
                <div>
                  {/* <h2 className="font-bold text-2xl mb-2">Sản phẩm</h2>
                  <p className="text-gray-600">Danh sách các sản phẩm chăm sóc da</p> */}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                    >
                      {/* Product Image */}
                      <div className="aspect-square mb-3 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Product Name */}
                      <h3 className="font-bold text-sm text-gray-900 mb-1 line-clamp-1">
                        {product.name}
                      </h3>

                      {/* Product Description */}
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2 min-h-[2rem]">
                        {product.description}
                      </p>

                      {/* Stock */}
                      <p className="text-xs text-gray-900 mb-2 font-medium"></p>

                      {/* Price */}
                      <p className="text-red-600 font-bold mb-3">
                        {product.price.toLocaleString("vi-VN")}đ
                      </p>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setProductVariant("Vĩ");
                          setProductQuantity(1);
                          setShowProductModal(true);
                        }}
                        className="w-full py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Thêm vào giỏ
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Checkout */}
            {activeMenu === "products" && showCheckout && (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="flex items-center gap-2 text-gray-900 hover:text-gray-700 transition-colors"
                  >
                    <ArrowLeft className="size-5" />
                    <span className="font-medium">Quay lại</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left - Thông tin giao hàng và Phương thức thanh toán */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Thông tin giao hàng */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                      <h3 className="font-bold text-lg mb-4 text-gray-900">
                        Thông tin giao hàng
                      </h3>

                      {savedHealthData ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                              Họ và tên <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={savedHealthData.name}
                              disabled
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                              Số điện thoại{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={savedHealthData.phone}
                              disabled
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                              Địa chỉ giao hàng{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              value={savedHealthData.address}
                              disabled
                              rows={3}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                              placeholder="Nhập địa chỉ chi tiết (số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố)"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                          <p className="text-gray-700 mb-2">
                            Chưa có thông tin giao hàng
                          </p>
                          <p className="text-sm text-gray-600">
                            Vui lòng cập nhật hồ sơ sức khỏe để tiếp tục
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Phương thức thanh toán */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                      <h3 className="font-bold text-lg mb-4 text-gray-900">
                        Phương thức thanh toán
                      </h3>

                      <div className="space-y-3">
                        {/* MoMo */}
                        <label
                          className="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          style={{
                            borderColor:
                              orderPaymentMethod === "momo"
                                ? "#000"
                                : "#e5e7eb",
                          }}
                        >
                          <input
                            type="radio"
                            name="orderPayment"
                            value="momo"
                            checked={orderPaymentMethod === "momo"}
                            onChange={(e) =>
                              setOrderPaymentMethod(e.target.value)
                            }
                            className="size-5"
                          />
                          <img
                            src="https://images.seeklogo.com/logo-png/42/1/momo-logo-png_seeklogo-425716.png"
                            alt="MoMo"
                            className="size-12 object-contain"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">Ví MoMo</p>
                            <p className="text-sm text-gray-600">
                              Thanh toán qua ví điện tử MoMo
                            </p>
                          </div>
                        </label>

                        {/* Thanh toán khi nhận hàng */}
                        <label
                          className="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          style={{
                            borderColor:
                              orderPaymentMethod === "cod" ? "#000" : "#e5e7eb",
                          }}
                        >
                          <input
                            type="radio"
                            name="orderPayment"
                            value="cod"
                            checked={orderPaymentMethod === "cod"}
                            onChange={(e) =>
                              setOrderPaymentMethod(e.target.value)
                            }
                            className="size-5"
                          />
                          <div className="size-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <svg
                              className="size-7 text-orange-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              Thanh toán khi nhận hàng (COD)
                            </p>
                            <p className="text-sm text-gray-600">
                              Thanh toán bằng tiền mặt khi nhận được hàng
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Right - Thông tin đơn hàng */}
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">
                      <h3 className="font-bold text-lg mb-4 text-gray-900">
                        Thông tin đơn hàng
                      </h3>

                      {/* Product List */}
                      <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
                        {cart.map((item) => (
                          <div key={item.id} className="flex gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="size-16 object-contain bg-gray-50 rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm text-gray-900 truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-600">
                                {item.variant}
                              </p>
                              <p className="text-xs text-gray-600">
                                x{item.quantity}
                              </p>
                            </div>
                            <p className="text-sm font-bold text-red-600 whitespace-nowrap">
                              {item.unitPrice.toLocaleString("vi-VN")}đ
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Summary */}
                      <div className="border-t pt-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">Tổng số lượng:</span>
                          <span className="font-bold text-gray-900">
                            {cart.length} sản phẩm
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">Tạm tính:</span>
                          <span className="font-bold text-gray-900">
                            {cart
                              .reduce(
                                (total, item) =>
                                  total + item.unitPrice * item.quantity,
                                0,
                              )
                              .toLocaleString("vi-VN")}
                            đ
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">Phí vận chuyển:</span>
                          <span className="font-bold text-gray-900">
                            Miễn phí
                          </span>
                        </div>
                        <div className="border-t pt-2 flex items-center justify-between">
                          <span className="font-bold text-gray-900">
                            Tổng tiền:
                          </span>
                          <span className="text-2xl font-bold text-red-600">
                            {cart
                              .reduce(
                                (total, item) =>
                                  total + item.unitPrice * item.quantity,
                                0,
                              )
                              .toLocaleString("vi-VN")}
                            đ
                          </span>
                        </div>
                      </div>

                      {/* Order Button */}
                      <button
                        disabled={!orderPaymentMethod || !savedHealthData}
                        onClick={() => {
                          if (orderPaymentMethod === "momo") {
                            window.open(
                              "https://me.momo.vn/N6IpTps8fMtjTwUOIdi9f9",
                              "_blank",
                            );
                          }
                          setShowOrderSuccessModal(true);
                        }}
                        className={`w-full py-4 rounded-lg font-bold text-lg transition-colors mt-4 ${
                          orderPaymentMethod && savedHealthData
                            ? "bg-gray-900 hover:bg-gray-800 text-white cursor-pointer"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        Đặt hàng
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Order Success Modal */}
            {showOrderSuccessModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Backdrop */}
                <div
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                  onClick={() => {
                    // Create new order
                    const newOrder = {
                      id: Date.now().toString(),
                      orderNumber: `#${Date.now()}`,
                      date: new Date().toLocaleString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }),
                      items: [...cart],
                      recipient: {
                        name: savedHealthData?.name || "",
                        phone: savedHealthData?.phone || "",
                        address: savedHealthData?.address || "",
                      },
                      paymentMethod:
                        orderPaymentMethod === "momo"
                          ? "Thanh toán qua MoMo"
                          : "Thanh toán khi nhận hàng",
                      totalAmount: cart.reduce(
                        (total, item) => total + item.unitPrice * item.quantity,
                        0,
                      ),
                      status: "Chờ Xác Nhận",
                      statusIndex: 0,
                    };
                    setOrders([newOrder, ...orders]);
                    setShowOrderSuccessModal(false);
                    setShowCheckout(false);
                    setOrderPaymentMethod("");
                    setCart([]);
                  }}
                />

                {/* Modal */}
                <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 z-10">
                  {/* Close button */}
                  <button
                    onClick={() => {
                      // Create new order
                      const newOrder = {
                        id: Date.now().toString(),
                        orderNumber: `#${Date.now()}`,
                        date: new Date().toLocaleString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }),
                        items: [...cart],
                        recipient: {
                          name: savedHealthData?.name || "",
                          phone: savedHealthData?.phone || "",
                          address: savedHealthData?.address || "",
                        },
                        paymentMethod:
                          orderPaymentMethod === "momo"
                            ? "Thanh toán qua MoMo"
                            : "Thanh toán khi nhận hàng",
                        totalAmount: cart.reduce(
                          (total, item) =>
                            total + item.unitPrice * item.quantity,
                          0,
                        ),
                        status: "Chờ Xác Nhận",
                        statusIndex: 0,
                      };
                      setOrders([newOrder, ...orders]);
                      setShowOrderSuccessModal(false);
                      setShowCheckout(false);
                      setOrderPaymentMethod("");
                      setCart([]);
                    }}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="size-6" />
                  </button>

                  {/* Success icon */}
                  <div className="flex justify-center mb-6">
                    <div className="size-20 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="size-12 text-green-600" />
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                    Đặt hàng thành công
                  </h2>
                  <p className="text-xl font-medium text-gray-700 text-center mb-4">
                    Cảm ơn bạn đã đặt hàng!
                  </p>

                  {/* Description */}
                  <p className="text-gray-600 text-center mb-8">
                    Đơn hàng đang xử lý và sẽ sớm được giao đến bạn.
                  </p>

                  {/* Confirm button */}
                  <button
                    onClick={() => {
                      // Create new order
                      const newOrder = {
                        id: Date.now().toString(),
                        orderNumber: `#${Date.now()}`,
                        date: new Date().toLocaleString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }),
                        items: [...cart],
                        recipient: {
                          name: savedHealthData?.name || "",
                          phone: savedHealthData?.phone || "",
                          address: savedHealthData?.address || "",
                        },
                        paymentMethod:
                          orderPaymentMethod === "momo"
                            ? "Thanh toán qua MoMo"
                            : "Thanh toán khi nhận hàng",
                        totalAmount: cart.reduce(
                          (total, item) =>
                            total + item.unitPrice * item.quantity,
                          0,
                        ),
                        status: "Chờ Xác Nhận",
                        statusIndex: 0,
                      };
                      setOrders([newOrder, ...orders]);
                      setShowOrderSuccessModal(false);
                      setShowCheckout(false);
                      setOrderPaymentMethod("");
                      setCart([]);
                    }}
                    className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            )}

            {/* Đơn mua */}
            {activeMenu === "orders" && (
              <div className="space-y-6">
                <div>
                  {/* <h2 className="font-bold text-2xl mb-2">Đơn mua</h2>
                  <p className="text-gray-600">Quản lý đơn hàng của bạn</p> */}
                </div>

                {/* Orders List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  {orders.length === 0 ? (
                    <div className="py-12 text-center">
                      <ShoppingCart className="size-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">Chưa có đơn hàng nào</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-gray-200 rounded-xl p-6"
                        >
                          {/* Order Header */}
                          <div className="flex items-center justify-between mb-4 pb-4 border-b">
                            <div className="flex items-center gap-6">
                              <div>
                                <p className="text-sm text-gray-600">
                                  Mã đơn hàng
                                </p>
                                <p className="font-bold text-gray-900">
                                  {order.orderNumber}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">
                                  Ngày đặt
                                </p>
                                <p className="font-medium text-gray-900">
                                  {order.date}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`px-4 py-2 rounded-lg font-medium ${
                                order.status === "Đã Giao"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-900"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>

                          {/* Order Items */}
                          <div className="space-y-3 mb-4">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center gap-4"
                              >
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="size-16 object-contain bg-gray-50 rounded-lg"
                                />
                                <div className="flex-1">
                                  <p className="font-bold text-gray-900">
                                    {item.name}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {item.variant}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-gray-600">
                                    x{item.quantity}
                                  </p>
                                  <p className="font-bold text-red-600">
                                    {item.unitPrice.toLocaleString("vi-VN")}đ
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Recipient Info */}
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <p className="text-sm text-gray-600 mb-2">
                              Người nhận:
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {order.recipient.name} / {order.recipient.phone} /{" "}
                              {order.recipient.address}
                            </p>
                          </div>

                          {/* Order Footer */}
                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="text-sm">
                              <span className="text-gray-600">
                                Thanh toán:{" "}
                              </span>
                              <span className="font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded">
                                {order.paymentMethod}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600 mb-1">
                                Tổng tiền:
                              </p>
                              <p className="text-2xl font-bold text-red-600">
                                {order.totalAmount.toLocaleString("vi-VN")}đ
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Hồ sơ sức khỏe */}
            {activeMenu === "health-record" && !isEditingHealthRecord && (
              <div className="space-y-6">
                <div>
                  {/* <h2 className="font-bold text-2xl mb-2">Hồ sơ sức khỏe</h2> */}
                  {/* <p className="text-gray-600">Quản lý thông tin sức khỏe cá nhân của bạn</p> */}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Sidebar - User Info */}
                  <div className="lg:col-span-1 space-y-6">
                    {/* User Profile Card */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl p-8 text-white shadow-lg">
                      <div className="flex flex-col items-center">
                        <div className="size-24 bg-white rounded-full flex items-center justify-center mb-4">
                          <User className="size-12 text-gray-900" />
                        </div>
                        <h3 className="text-xl font-bold mb-1">
                          {savedHealthData?.name || "Người dùng"}
                        </h3>
                        <p className="text-sm text-gray-300 mb-6">
                          Mã BN: BN123456
                        </p>
                        <p className="text-sm text-gray-300 mb-5">THÔNG TIN</p>

                        <div className="w-full space-y-3">
                          <div className="flex items-center justify-between py-3 border-b border-white/20">
                            <span className="text-sm text-gray-300">
                              Ngày sinh:
                            </span>
                            <span className="text-sm font-medium">
                              {savedHealthData?.birthDate || "---"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-3 border-b border-white/20">
                            <span className="text-sm text-gray-300">
                              Giới tính:
                            </span>
                            <span className="text-sm font-medium">
                              {savedHealthData?.gender || "---"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-3 border-b border-white/20">
                            <span className="text-sm text-gray-300">
                              Số điện thoại:
                            </span>
                            <span className="text-sm font-medium">
                              {savedHealthData?.phone || "---"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-3 border-b border-white/20">
                            <span className="text-sm text-gray-300">
                              Email:
                            </span>
                            <span className="text-sm font-medium">
                              {savedHealthData?.email || "---"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-3">
                            <span className="text-sm text-gray-300">
                              Địa chỉ:
                            </span>
                            <span className="text-sm font-medium text-right">
                              {savedHealthData?.address || "---"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Download PDF Button */}
                    <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-colors shadow-sm">
                      <FileText className="size-5" />
                      Tải hồ sơ PDF
                    </button>
                  </div>

                  {/* Right Content - Health Details */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Health Metrics Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <svg
                          className="size-5 text-gray-900"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        Chỉ số sức khỏe da
                      </h3>
                      {savedHealthData?.skinMetrics ? (
                        <>
                          {/* Overall Score */}
                          <div className="flex items-center justify-center mb-8">
                            <div className="relative size-40">
                              <svg className="size-full -rotate-90">
                                <circle
                                  cx="80"
                                  cy="80"
                                  r="72"
                                  fill="none"
                                  stroke="#e5e7eb"
                                  strokeWidth="16"
                                />
                                <circle
                                  cx="80"
                                  cy="80"
                                  r="72"
                                  fill="none"
                                  stroke="#10b981"
                                  strokeWidth="16"
                                  strokeDasharray={`${(savedHealthData.skinMetrics.overall / 100) * 452.39} 452.39`}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold text-gray-900">
                                  {savedHealthData.skinMetrics.overall}
                                </span>
                                <span className="text-sm text-green-600 font-medium">
                                  Khá tốt
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Metrics */}
                          <div className="space-y-5">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Droplet className="size-5 text-blue-500" />
                                  <span className="text-sm font-medium text-gray-700">
                                    Độ ẩm
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-bold text-gray-900">
                                    {savedHealthData.skinMetrics.moisture}%
                                  </span>
                                  <span className="text-xs text-green-600 font-medium min-w-[80px] text-right">
                                    Tốt
                                  </span>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="h-2.5 rounded-full bg-blue-500"
                                  style={{
                                    width: `${savedHealthData.skinMetrics.moisture}%`,
                                  }}
                                />
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Sparkles className="size-5 text-purple-500" />
                                  <span className="text-sm font-medium text-gray-700">
                                    Độ đàn hồi
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-bold text-gray-900">
                                    {savedHealthData.skinMetrics.elasticity}%
                                  </span>
                                  <span className="text-xs text-green-600 font-medium min-w-[80px] text-right">
                                    Khá
                                  </span>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="h-2.5 rounded-full bg-purple-500"
                                  style={{
                                    width: `${savedHealthData.skinMetrics.elasticity}%`,
                                  }}
                                />
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Palette className="size-5 text-yellow-500" />
                                  <span className="text-sm font-medium text-gray-700">
                                    Sắc tố da
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-bold text-gray-900">
                                    {savedHealthData.skinMetrics.pigmentation}%
                                  </span>
                                  <span className="text-xs text-orange-600 font-medium min-w-[80px] text-right">
                                    Trung bình
                                  </span>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="h-2.5 rounded-full bg-yellow-500"
                                  style={{
                                    width: `${savedHealthData.skinMetrics.pigmentation}%`,
                                  }}
                                />
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Wind className="size-5 text-green-500" />
                                  <span className="text-sm font-medium text-gray-700">
                                    Bã nhờn
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-bold text-gray-900">
                                    {savedHealthData.skinMetrics.oiliness}%
                                  </span>
                                  <span className="text-xs text-green-600 font-medium min-w-[80px] text-right">
                                    Khá
                                  </span>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="h-2.5 rounded-full bg-green-500"
                                  style={{
                                    width: `${savedHealthData.skinMetrics.oiliness}%`,
                                  }}
                                />
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Zap className="size-5 text-red-500" />
                                  <span className="text-sm font-medium text-gray-700">
                                    Mụn
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-bold text-gray-900">
                                    {savedHealthData.skinMetrics.acne}%
                                  </span>
                                  <span className="text-xs text-red-600 font-medium min-w-[80px] text-right">
                                    Kém
                                  </span>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="h-2.5 rounded-full bg-red-500"
                                  style={{
                                    width: `${savedHealthData.skinMetrics.acne}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                          <p className="text-lg font-medium text-orange-500 mb-2">
                            Chưa có thông tin chỉ số sức khỏe
                          </p>
                          <p className="text-sm text-gray-500">
                            Vui lòng cập nhật thông tin để theo dõi sức khỏe
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Update Info Button */}
                    <button
                      onClick={() => {
                        if (savedHealthData) {
                          setFormData({
                            name: savedHealthData.name,
                            phone: savedHealthData.phone,
                            birthDate: savedHealthData.birthDate,
                            gender: savedHealthData.gender,
                            email: savedHealthData.email,
                            address: savedHealthData.address,
                          });
                          setSkinAnalysisImage(savedHealthData.skinImage);
                          setSkinMetrics(savedHealthData.skinMetrics);
                        }
                        setIsEditingHealthRecord(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-900 rounded-xl font-medium transition-colors"
                    >
                      <User className="size-5" />
                      Cập nhật thông tin
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Form Cập nhật thông tin */}
            {activeMenu === "health-record" && isEditingHealthRecord && (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsEditingHealthRecord(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="size-6" />
                  </button>
                  <div>
                    <h2 className="font-bold text-2xl">Cập nhật thông tin</h2>
                    <p className="text-gray-600">
                      Vui lòng điền đầy đủ thông tin của bạn
                    </p>
                  </div>
                </div>

                {/* Thông tin cá nhân - Full Width */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-bold text-lg mb-6">Thông tin cá bản</h3>

                  <div className="space-y-6">
                    {/* Hàng 1: Họ và tên, Giới tính, Ngày sinh */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Họ và tên
                        </label>
                        <input
                          type="text"
                          placeholder="VD: Nguyễn Văn A"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Giới tính
                        </label>
                        <select
                          value={formData.gender}
                          onChange={(e) =>
                            setFormData({ ...formData, gender: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-700"
                        >
                          <option value="">Chọn giới tính</option>
                          <option value="Nam">Nam</option>
                          <option value="Nữ">Nữ</option>
                          <option value="Khác">Khác</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngày sinh
                        </label>
                        <input
                          type="date"
                          value={formData.birthDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              birthDate: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Hàng 2: Số điện thoại, Email, Địa chỉ */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số điện thoại
                        </label>
                        <input
                          type="tel"
                          placeholder="VD: 0901234567"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          placeholder="VD: example@email.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Địa chỉ
                        </label>
                        <input
                          type="text"
                          placeholder="VD: 123 Đường ABC, Quận XYZ"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chỉ số da chi tiết - 2 Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Hệ thống phân tích */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-bold text-lg mb-6">
                      Chỉ số sức khỏe da
                    </h3>

                    {/* Upload Area */}
                    <div className="mb-6">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="skin-upload"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setSkinAnalysisImage(
                                event.target?.result as string,
                              );
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      {skinAnalysisImage ? (
                        <div className="border-2 border-gray-300 rounded-xl p-4">
                          <img
                            src={skinAnalysisImage}
                            alt="Uploaded"
                            className="w-full max-h-64 object-contain rounded-lg"
                          />
                        </div>
                      ) : (
                        <label
                          htmlFor="skin-upload"
                          className="block border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-gray-900 transition-colors cursor-pointer"
                        >
                          <Upload className="size-16 text-gray-400 mx-auto mb-4" />
                          <p className="font-medium text-gray-700 mb-2">
                            Kéo thả ảnh hoặc tải ảnh từ thiết bị
                          </p>
                          <div className="px-6 py-2 bg-white border border-gray-900 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors mt-2 inline-block">
                            Tải ảnh
                          </div>
                          <p className="text-xs text-gray-500 mt-3">
                            Hỗ trợ định dạng JPG, PNG. Đảm bảo ảnh rõ nét, đủ
                            sáng.
                          </p>
                        </label>
                      )}
                    </div>

                    {/* Checkbox */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="mt-1 size-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                        />
                        <span className="text-sm text-gray-700 leading-relaxed">
                          Xác nhận ảnh chụp thuộc quyền sở hữu của tôi và đồng ý
                          chia sẻ cho hệ thống phân tích. Tôi đã đọc và hiểu rõ{" "}
                          <strong>Điều khoản bảo mật</strong>{" "}
                          <span className="underline"></span>
                        </span>
                      </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          if (skinAnalysisImage) {
                            setIsAnalyzing(true);
                            setAnimatedMetrics({
                              moisture: 0,
                              elasticity: 0,
                              pigmentation: 0,
                              oiliness: 0,
                              acne: 0,
                              overall: 0,
                            });
                            setTimeout(() => {
                              setIsAnalyzing(false);
                              setSkinMetrics({
                                moisture: 85,
                                elasticity: 78,
                                pigmentation: 65,
                                oiliness: 70,
                                acne: 30,
                                overall: 82,
                              });
                            }, 500);
                          }
                        }}
                        disabled={isAnalyzing}
                        className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isAnalyzing ? "Đang phân tích..." : "Phân tích"}
                      </button>
                      <button
                        onClick={() => {
                          setSkinAnalysisImage(null);
                          setSkinMetrics(null);
                          setAnimatedMetrics({
                            moisture: 0,
                            elasticity: 0,
                            pigmentation: 0,
                            oiliness: 0,
                            acne: 0,
                            overall: 0,
                          });
                        }}
                        className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Xóa ảnh
                      </button>
                    </div>
                  </div>

                  {/* Right: Kết quả phân tích */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-bold text-lg mb-6">
                      Kết quả phân tích
                    </h3>

                    {skinMetrics ? (
                      <>
                        {/* Overall Score */}
                        <div className="flex items-center justify-center mb-8">
                          <div className="relative size-40">
                            <svg className="size-full -rotate-90">
                              <circle
                                cx="80"
                                cy="80"
                                r="72"
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="16"
                              />
                              <circle
                                cx="80"
                                cy="80"
                                r="72"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="16"
                                strokeDasharray={`${(animatedMetrics.overall / 100) * 452.39} 452.39`}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-4xl font-bold text-gray-900">
                                {animatedMetrics.overall}
                              </span>
                              <span className="text-sm text-green-600 font-medium">
                                Khá tốt
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Metrics */}
                        <div className="space-y-5">
                          {/* Độ ẩm */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Droplet className="size-5 text-blue-500" />
                                <span className="text-sm font-medium text-gray-700">
                                  Độ ẩm
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-gray-900">
                                  {animatedMetrics.moisture}%
                                </span>
                                <span className="text-xs text-green-600 font-medium min-w-[80px] text-right">
                                  Tốt
                                </span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="h-2.5 rounded-full bg-blue-500 transition-all duration-100"
                                style={{
                                  width: `${animatedMetrics.moisture}%`,
                                }}
                              />
                            </div>
                          </div>

                          {/* Độ đàn hồi */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Sparkles className="size-5 text-purple-500" />
                                <span className="text-sm font-medium text-gray-700">
                                  Độ đàn hồi
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-gray-900">
                                  {animatedMetrics.elasticity}%
                                </span>
                                <span className="text-xs text-green-600 font-medium min-w-[80px] text-right">
                                  Khá
                                </span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="h-2.5 rounded-full bg-purple-500 transition-all duration-100"
                                style={{
                                  width: `${animatedMetrics.elasticity}%`,
                                }}
                              />
                            </div>
                          </div>

                          {/* Sắc tố da */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Palette className="size-5 text-yellow-500" />
                                <span className="text-sm font-medium text-gray-700">
                                  Sắc tố da
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-gray-900">
                                  {animatedMetrics.pigmentation}%
                                </span>
                                <span className="text-xs text-orange-600 font-medium min-w-[80px] text-right">
                                  Trung bình
                                </span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="h-2.5 rounded-full bg-yellow-500 transition-all duration-100"
                                style={{
                                  width: `${animatedMetrics.pigmentation}%`,
                                }}
                              />
                            </div>
                          </div>

                          {/* Bã nhờn */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Wind className="size-5 text-green-500" />
                                <span className="text-sm font-medium text-gray-700">
                                  Bã nhờn
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-gray-900">
                                  {animatedMetrics.oiliness}%
                                </span>
                                <span className="text-xs text-green-600 font-medium min-w-[80px] text-right">
                                  Khá
                                </span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="h-2.5 rounded-full bg-green-500 transition-all duration-100"
                                style={{
                                  width: `${animatedMetrics.oiliness}%`,
                                }}
                              />
                            </div>
                          </div>

                          {/* Mụn */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Zap className="size-5 text-red-500" />
                                <span className="text-sm font-medium text-gray-700">
                                  Mụn
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-gray-900">
                                  {animatedMetrics.acne}%
                                </span>
                                <span className="text-xs text-red-600 font-medium min-w-[80px] text-right">
                                  Kém
                                </span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="h-2.5 rounded-full bg-red-500 transition-all duration-100"
                                style={{ width: `${animatedMetrics.acne}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="size-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Scan className="size-10 text-gray-400" />
                        </div>
                        <p className="text-gray-500 mb-2">
                          Chưa có kết quả phân tích
                        </p>
                        <p className="text-sm text-gray-400">
                          Tải ảnh lên và nhấn "Phân tích" để xem kết quả
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Nút Hủy và Lưu thông tin - Ngoài 2 bảng, nằm ngang */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <button
                    onClick={() => {
                      setIsEditingHealthRecord(false);
                      setSkinAnalysisImage(null);
                      setSkinMetrics(null);
                      setFormData({
                        name: "",
                        phone: "",
                        birthDate: "",
                        gender: "",
                        email: "",
                        address: "",
                      });
                    }}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => {
                      setSavedHealthData({
                        name: formData.name,
                        phone: formData.phone,
                        birthDate: formData.birthDate,
                        gender: formData.gender,
                        email: formData.email,
                        address: formData.address,
                        skinImage: skinAnalysisImage,
                        skinMetrics: skinMetrics,
                      });
                      setIsEditingHealthRecord(false);
                    }}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors"
                  >
                    <Save className="size-5" />
                    Lưu thông tin
                  </button>
                </div>
              </div>
            )}

            {/* Lịch sử phân tích */}
            {activeMenu === "history" && (
              <div className="space-y-6">
                {/* Lịch sử phân tích */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-lg">Lịch sử phân tích</h2>
                    <div className="relative">
                      <Search className="size-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm theo tên bệnh..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 w-64"
                      />
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                            THỜI GIAN
                          </th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                            ẢNH PHÂN TÍCH
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                            KẾT QUẢ PHÂN TÍCH
                          </th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                            ĐỘ TIN CẬY
                          </th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                            THAO TÁC
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysisHistory.map((record) => (
                          <tr
                            key={record.id}
                            className={`border-b border-gray-100 hover:bg-gray-50 ${
                              viewingHistoryRecord?.id === record.id
                                ? "bg-blue-50"
                                : ""
                            }`}
                          >
                            <td className="py-4 px-4">
                              <div className="text-sm">
                                <p className="font-medium">{record.date}</p>
                                <p className="text-gray-500">{record.time}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <div className="inline-block">
                                {record.image ? (
                                  <img
                                    src={record.image}
                                    alt="Ảnh phân tích"
                                    className="size-14 rounded-lg object-cover border border-gray-200"
                                  />
                                ) : (
                                  <div className="size-14 bg-gray-900 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-xs">
                                      IMG
                                    </span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`size-2 rounded-full ${getStatusColor(record.status)}`}
                                />
                                <span className="text-sm">{record.result}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(record.confidence)}`}
                              >
                                {record.confidence}%
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => {
                                    setViewingHistoryRecord(record);
                                  }}
                                  className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                  title="Xem chi tiết"
                                >
                                  <Eye className="size-4" />
                                </button>
                                <button
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Tải xuống"
                                >
                                  <Download className="size-4" />
                                </button>
                                <button
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Xóa"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-gray-600"></p>
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="size-5" />
                      </button>
                      <button className="px-3 py-1 bg-gray-900 text-white rounded-lg font-medium">
                        1
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-800">
                        <ChevronRight className="size-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Chi tiết kết quả đã phân tích */}
                {viewingHistoryRecord &&
                  diseaseDetails[viewingHistoryRecord.result] && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="font-bold text-lg">
                          Chi tiết kết quả đã phân tích
                        </h2>
                        <button
                          onClick={() => setViewingHistoryRecord(null)}
                          className="text-sm text-gray-600 hover:text-gray-900"
                        >
                          Đóng
                        </button>
                      </div>

                      <div className="space-y-6">
                        {/* Ảnh đã phân tích */}
                        <div>
                          <div className="p-2 bg-white rounded-xl shadow-sm border-4 border-gray-300">
                            {viewingHistoryRecord.image ? (
                              <img
                                src={viewingHistoryRecord.image}
                                alt="Ảnh phân tích"
                                className="w-full rounded-lg object-cover aspect-video"
                              />
                            ) : (
                              <div className="w-full bg-gray-900 rounded-lg flex items-center justify-center aspect-video">
                                <span className="text-white text-2xl font-bold">
                                  IMAGE
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Tên bệnh chính */}
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {diseaseDetails[viewingHistoryRecord.result].name}
                          </h3>
                        </div>

                        {/* Độ tin cậy */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">
                              Độ tin cậy (Confidence):
                            </span>
                            <span className="font-bold text-xl text-gray-900">
                              {viewingHistoryRecord.confidence}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="h-3 rounded-full transition-all duration-100 bg-red-500"
                              style={{
                                width: `${viewingHistoryRecord.confidence}%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Tất cả thông tin trong 1 ô xám */}
                        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                          <div>
                            <h4 className="font-bold text-gray-900 mb-2">
                              Mô tả
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {
                                diseaseDetails[viewingHistoryRecord.result]
                                  .description
                              }
                            </p>
                          </div>

                          <div className="border-t border-gray-200 pt-4">
                            <h4 className="font-bold text-gray-900 mb-2">
                              Triệu chứng
                            </h4>

                            <ul className="space-y-1.5">
                              {diseaseDetails[
                                viewingHistoryRecord.result
                              ].symptoms.map((symptom, index) => (
                                <li
                                  key={index}
                                  className="text-sm text-gray-700 flex items-start gap-2"
                                >
                                  <span className="text-gray-500 mt-1">•</span>
                                  <span>{symptom}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="border-t border-gray-200 pt-4">
                            <h4 className="font-bold text-gray-900 mb-2">
                              Nguyên nhân
                            </h4>

                            <ul className="space-y-1.5">
                              {diseaseDetails[
                                viewingHistoryRecord.result
                              ].causes.map((cause, index) => (
                                <li
                                  key={index}
                                  className="text-sm text-gray-700 flex items-start gap-2"
                                >
                                  <span className="text-gray-500 mt-1">•</span>
                                  <span>{cause}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="border-t border-gray-200 pt-4">
                            <h4 className="font-bold text-gray-900 mb-2">
                              Đối tượng dễ mắc
                            </h4>

                            <ul className="space-y-1.5">
                              {diseaseDetails[
                                viewingHistoryRecord.result
                              ].riskGroups.map((group, index) => (
                                <li
                                  key={index}
                                  className="text-sm text-gray-700 flex items-start gap-2"
                                >
                                  <span className="text-gray-500 mt-1">•</span>
                                  <span>{group}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="border-t border-gray-200 pt-4">
                            <h4 className="font-bold text-gray-900 mb-2">
                              Cách phòng chống
                            </h4>
                            <ul className="space-y-1.5">
                              {diseaseDetails[
                                viewingHistoryRecord.result
                              ].prevention.map((prevention, index) => (
                                <li
                                  key={index}
                                  className="text-sm text-gray-700 flex items-start gap-2"
                                >
                                  <span className="text-gray-500 mt-1">•</span>
                                  <span>{prevention}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Product Detail Modal */}
      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowProductModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 z-10">
            {/* Close button */}
            <button
              onClick={() => setShowProductModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="size-6" />
            </button>

            {/* Product Image */}
            <div className="w-full aspect-square bg-gray-50 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Product Name */}
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              {selectedProduct.name}
            </h2>

            {/* Product Price */}
            <p className="text-3xl font-bold text-red-600 text-center mb-6">
              {selectedProduct.price.toLocaleString("vi-VN")}đ
            </p>

            {/* Variant Selection */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-900 mb-3">
                Phân loại:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setProductVariant("Vĩ")}
                  className={`py-3 rounded-lg font-medium transition-colors ${
                    productVariant === "Vĩ"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Vĩ
                </button>
                <button
                  onClick={() => setProductVariant("Hộp")}
                  className={`py-3 rounded-lg font-medium transition-colors ${
                    productVariant === "Hộp"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Hộp
                </button>
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-900 mb-3">
                Số lượng:
              </p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() =>
                    setProductQuantity(Math.max(1, productQuantity - 1))
                  }
                  className="size-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-gray-700 font-bold transition-colors"
                >
                  −
                </button>
                <div className="w-20 py-3 border-2 border-gray-300 rounded-lg text-center font-bold text-gray-900">
                  {productQuantity}
                </div>
                <button
                  onClick={() => setProductQuantity(productQuantity + 1)}
                  className="size-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-gray-700 font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={() => {
                const cartItem = {
                  id: `${selectedProduct.id}-${productVariant}-${Date.now()}`,
                  name: selectedProduct.name,
                  image: selectedProduct.image,
                  variant: `${productQuantity} ${productVariant} x 10 Viên`,
                  quantity: productQuantity,
                  unitPrice: selectedProduct.price,
                };
                setCart([...cart, cartItem]);
                setShowProductModal(false);
              }}
              className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-bold text-lg transition-colors"
            >
              THÊM VÀO GIỎ
            </button>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCartModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 z-10 max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                Giỏ hàng của bạn
              </h2>
              <button
                onClick={() => setShowCartModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="size-6" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="py-12 text-center">
                <ShoppingCart className="size-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Giỏ hàng trống</p>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cart.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 bg-gray-50 rounded-lg p-4"
                    >
                      {/* Product Image */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="size-20 object-contain bg-white rounded-lg"
                      />

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {item.variant}
                        </p>
                        <p className="font-bold text-red-600">
                          {item.unitPrice.toLocaleString("vi-VN")}đ
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            const newCart = [...cart];
                            if (newCart[index].quantity > 1) {
                              newCart[index].quantity--;
                              setCart(newCart);
                            }
                          }}
                          className="size-8 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg flex items-center justify-center text-gray-700 font-bold transition-colors"
                        >
                          −
                        </button>
                        <div className="w-12 py-2 text-center font-bold text-gray-900">
                          {item.quantity}
                        </div>
                        <button
                          onClick={() => {
                            const newCart = [...cart];
                            newCart[index].quantity++;
                            setCart(newCart);
                          }}
                          className="size-8 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg flex items-center justify-center text-gray-700 font-bold transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right min-w-[100px]">
                        <p className="text-xs text-gray-600 mb-1">Thành tiền</p>
                        <p className="font-bold text-gray-900">
                          {(item.unitPrice * item.quantity).toLocaleString(
                            "vi-VN",
                          )}
                          đ
                        </p>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => {
                          setCart(cart.filter((_, i) => i !== index));
                        }}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="size-5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="border-t pt-4 space-y-2 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Tổng số lượng:</span>
                    <span className="font-bold text-gray-900">
                      {cart.length} sản phẩm
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">
                      Tổng tiền:
                    </span>
                    <span className="text-2xl font-bold text-red-600">
                      {cart
                        .reduce(
                          (total, item) =>
                            total + item.unitPrice * item.quantity,
                          0,
                        )
                        .toLocaleString("vi-VN")}
                      đ
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => {
                    setShowCartModal(false);
                    setShowCheckout(true);
                  }}
                  className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-bold text-lg transition-colors"
                >
                  Tiến hành thanh toán
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              © 2026 SkinCare System. Hệ thống Quản lý và Phân tích Hình ảnh Da
              Liễu.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-gray-600 hover:underline">
                Điều khoản sử dụng
              </a>
              <a href="#" className="text-sm text-gray-600 hover:underline">
                Chính sách bảo mật
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
