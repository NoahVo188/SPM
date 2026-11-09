import {
  Calendar,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Droplet,
  Sparkles,
  Palette,
  Flame,
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const trendData1 = [
  { id: 1, value: 78 },
  { id: 2, value: 76 },
  { id: 3, value: 79 },
  { id: 4, value: 81 },
  { id: 5, value: 80 },
  { id: 6, value: 82 },
];

const trendData2 = [
  { id: 1, value: 12 },
  { id: 2, value: 14 },
  { id: 3, value: 13 },
  { id: 4, value: 15 },
];

const healthTrendData = [
  { id: 1, date: "13/04", score: 65 },
  { id: 2, date: "14/04", score: 70 },
  { id: 3, date: "15/04", score: 75 },
  { id: 4, date: "16/04", score: 78 },
  { id: 5, date: "17/04", score: 74 },
  { id: 6, date: "18/04", score: 80 },
  { id: 7, date: "19/04", score: 82 },
];

interface SkinIndicator {
  name: string;
  value: number;
  status: "Tốt" | "Khá" | "Trung bình" | "Kém";
  color: string;
  icon: React.ElementType;
  iconColor: string;
}

interface HealthOverviewProps {
  savedHealthData: {
    name: string;
    phone: string;
    birthDate: string;
    gender: string;
    email: string;
    address: string;
    skinImage: string | null;
    skinMetrics: {
      moisture: number;
      elasticity: number;
      pigmentation: number;
      oiliness: number;
      acne: number;
      overall: number;
    } | null;
  } | null;
}

export function HealthOverview({ savedHealthData }: HealthOverviewProps) {
  // Show UI but with empty data if no skinMetrics
  const hasData = !!savedHealthData?.skinMetrics;
  const healthScore = hasData ? savedHealthData.skinMetrics.overall : 0;
  const circleCircumference = 2 * Math.PI * 60;
  const circleOffset =
    circleCircumference - (healthScore / 100) * circleCircumference;

  const emptyTrendData = [
    { id: 1, date: "07/05", score: 0 },
    { id: 2, date: "08/05", score: 0 },
    { id: 3, date: "09/05", score: 0 },
    { id: 4, date: "10/05", score: 0 },
    { id: 5, date: "11/05", score: 0 },
    { id: 6, date: "12/05", score: 0 },
    { id: 7, date: "13/05", score: 0 },
  ];

  const filledTrendData = [
    { id: 1, date: "07/05", score: healthScore },
    { id: 2, date: "08/05", score: 0 },
    { id: 3, date: "09/05", score: 0 },
    { id: 4, date: "10/05", score: 0 },
    { id: 5, date: "11/05", score: 0 },
    { id: 6, date: "12/05", score: 0 },
    { id: 7, date: "13/05", score: 0 },
  ];

  const displayTrendData = hasData ? filledTrendData : emptyTrendData;

  const getStatus = (value: number): "Tốt" | "Khá" | "Trung bình" | "Kém" => {
    if (value >= 80) return "Tốt";
    if (value >= 60) return "Khá";
    if (value >= 40) return "Trung bình";
    return "Kém";
  };

  const skinIndicators: SkinIndicator[] = hasData
    ? [
        {
          name: "Độ ẩm",
          value: savedHealthData.skinMetrics.moisture,
          status: getStatus(savedHealthData.skinMetrics.moisture),
          color: "bg-blue-500",
          icon: Droplet,
          iconColor: "text-blue-500",
        },
        {
          name: "Độ đàn hồi",
          value: savedHealthData.skinMetrics.elasticity,
          status: getStatus(savedHealthData.skinMetrics.elasticity),
          color: "bg-purple-500",
          icon: Sparkles,
          iconColor: "text-purple-500",
        },
        {
          name: "Sắc tố da",
          value: savedHealthData.skinMetrics.pigmentation,
          status: "Trung bình",
          color: "bg-yellow-500",
          icon: Palette,
          iconColor: "text-yellow-500",
        },
        {
          name: "Bã nhờn",
          value: savedHealthData.skinMetrics.oiliness,
          status: getStatus(savedHealthData.skinMetrics.oiliness),
          color: "bg-green-500",
          icon: Flame,
          iconColor: "text-green-500",
        },
        {
          name: "Mụn",
          value: savedHealthData.skinMetrics.acne,
          status: getStatus(savedHealthData.skinMetrics.acne),
          color: "bg-red-500",
          icon: Zap,
          iconColor: "text-red-500",
        },
      ]
    : [
        {
          name: "Độ ẩm",
          value: 0,
          status: "Kém",
          color: "bg-blue-500",
          icon: Droplet,
          iconColor: "text-blue-500",
        },
        {
          name: "Độ đàn hồi",
          value: 0,
          status: "Kém",
          color: "bg-purple-500",
          icon: Sparkles,
          iconColor: "text-purple-500",
        },
        {
          name: "Sắc tố da",
          value: 0,
          status: "Kém",
          color: "bg-yellow-500",
          icon: Palette,
          iconColor: "text-yellow-500",
        },
        {
          name: "Bã nhờn",
          value: 0,
          status: "Kém",
          color: "bg-green-500",
          icon: Flame,
          iconColor: "text-green-500",
        },
        {
          name: "Mụn",
          value: 0,
          status: "Kém",
          color: "bg-red-500",
          icon: Zap,
          iconColor: "text-red-500",
        },
      ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        {/* <h2 className="font-bold text-xl">Tổng quan sức khỏe da</h2> */}
        {/* <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
          Xem chi tiết
          <ChevronRight className="size-4" />
        </button> */}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Phân tích gần nhất */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Phân tích gần nhất</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {hasData ? "07/05/2026" : "---"}
          </div>
          <div className="text-xs text-gray-500">
            {hasData ? "10:30 AM" : "---"}
          </div>
        </div>

        {/* Card 2: Điểm da khỏe da */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Điểm sức khỏe da</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {hasData ? `${healthScore}/100` : "---"}
          </div>
          <div className="text-xs text-gray-500 font-medium">
            {hasData
              ? healthScore >= 80
                ? "Khá tốt"
                : healthScore >= 60
                  ? "Trung bình"
                  : "Cần cải thiện"
              : "---"}
          </div>
        </div>

        {/* Card 3: Vấn đề da đa dạy */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Vấn đề cần lưu ý</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {hasData ? "2" : "---"}
          </div>
          <div className="text-xs text-gray-500 font-medium">
            {hasData ? "Cần theo dõi" : "---"}
          </div>
        </div>

        {/* Card 4: Tăng điểm so sánh */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Tiến trình cải thiện</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {hasData ? "+0%" : "---"}
          </div>
          <div className="text-xs text-gray-500 font-medium">
            {hasData ? "So với tuần trước" : "---"}
          </div>
        </div>
      </div>

      {/* Chi số da chi tiết và Xu hướng sức khỏe da */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chi số da chi tiết */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col">
          <h3 className="font-bold text-lg mb-6">Chỉ số sức khỏe da</h3>

          <div className="flex items-center gap-8 flex-1 justify-center">
            {/* Left: Circular Progress */}
            <div className="flex-shrink-0">
              <div className="relative">
                <svg className="size-36 transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    key="bg-circle"
                    cx="72"
                    cy="72"
                    r="60"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                  />
                  {/* Progress circle */}
                  <circle
                    key="progress-circle"
                    cx="72"
                    cy="72"
                    r="60"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="12"
                    strokeDasharray={circleCircumference}
                    strokeDashoffset={circleOffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-gray-900">
                    {hasData ? healthScore : "---"}
                  </div>
                  <div className="text-xs text-green-600 font-medium">
                    {hasData
                      ? healthScore >= 80
                        ? "Khá tốt"
                        : healthScore >= 60
                          ? "Trung bình"
                          : "Cần cải thiện"
                      : "---"}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Progress Bars */}
            <div className="flex-1 space-y-8">
              {skinIndicators.map((indicator) => {
                const Icon = indicator.icon;
                return (
                  <div key={indicator.name} className="flex items-center gap-3">
                    <Icon
                      className={`size-4 ${indicator.iconColor} flex-shrink-0`}
                    />
                    <span className="text-sm font-medium text-gray-700 w-20 flex-shrink-0">
                      {indicator.name}
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-1000 ${indicator.color}`}
                        style={{ width: `${indicator.value}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-900 w-10 text-right flex-shrink-0">
                      {hasData ? `${indicator.value}%` : "---"}
                    </span>
                    <span
                      className={`text-sm font-medium w-20 text-right flex-shrink-0 ${
                        hasData
                          ? indicator.status === "Tốt"
                            ? "text-green-600"
                            : indicator.status === "Khá"
                              ? "text-blue-600"
                              : indicator.status === "Trung bình"
                                ? "text-yellow-600"
                                : "text-red-600"
                          : "text-gray-400"
                      }`}
                    >
                      {hasData ? indicator.status : "---"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Xu hướng sức khỏe da */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Xu hướng sức khỏe da</h3>
            <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>7 ngày qua</option>
              <option>14 ngày qua</option>
              <option>30 ngày qua</option>
            </select>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={displayTrendData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                  key="grid"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  key="xaxis"
                />
                <YAxis
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  key="yaxis"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
                          <p className="text-sm font-medium text-gray-900">
                            Điểm: {payload[0].value}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                  key="tooltip"
                />
                <Bar
                  dataKey="score"
                  fill="#10b981"
                  radius={[8, 8, 0, 0]}
                  key="bar"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-green-500" />
              <span className="text-gray-600">Điểm da khỏe da</span>
            </div>
            <div className="flex items-center gap-2">
              {/* <div className="w-8 h-0.5 bg-gray-400" /> */}
              <span className="text-gray-600">
                Trung bình ({hasData ? healthScore : "---"})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
