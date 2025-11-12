import { useAuthStore } from "@/store/slices/auth.slice";
import {
  useTeacherChart,
} from "@/hooks/queries/dashboard/useTeacher";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// Interface for chart data
interface MonthlyData {
  month: number;
  year: number;
  revenue: number;
  ordersCount: number;
}

interface TeacherChartData {
  data: {
    monthlyData: MonthlyData[];
    totalRevenue: number;
    averageMonthlyRevenue: number;
  };
  message: string;
}

export default function ChartRevenue() {
  const { isTeacher, user } = useAuthStore();
  const { data: teacherDataChart, isLoading: isLoadingTeacher } = useTeacherChart(user?.id || "", 2025 , isTeacher);

  // Type assertion for the chart data
  const chartResponse = teacherDataChart as TeacherChartData | undefined;

  // Format data for chart
  const chartData = chartResponse?.data?.monthlyData?.map((item: MonthlyData) => ({
    month: item.month,
    monthName: getMonthName(item.month),
    revenue: item.revenue,
    ordersCount: item.ordersCount,
    formattedRevenue: formatCurrency(item.revenue),
  })) || [];

  if (isLoadingTeacher) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-gray-400" size={48} />
        <span className="ml-2 text-gray-500">Loading chart data...</span>
      </div>
    );
  }

  if (!chartResponse?.data?.monthlyData) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-600 mb-2">Total revenue (year)</h3>
          <p className="text-2xl font-bold text-blue-800">
            {formatCurrency(chartResponse.data.totalRevenue)}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-600 mb-2">Average monthly revenue</h3>
          <p className="text-2xl font-bold text-green-800">
            {formatCurrency(chartResponse.data.averageMonthlyRevenue)}
          </p>
        </div>
      </div>

      {/* Revenue Chart (Bar) */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Monthly revenue</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="monthName"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
              />
              <Tooltip
                formatter={(value) => [formatCurrency(value as number), "Revenue"]}
                labelFormatter={(label) => `Month ${label}`}
              />
              <Bar dataKey="revenue" fill="#16A1FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders Count Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Monthly orders</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="monthName" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-semibold text-gray-800">{`Month ${label}`}</p>
                        <p className="text-green-600">
                          {`Orders: ${payload[0].value}`}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="ordersCount" 
                fill="#10B981" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Helper function to get month name
function getMonthName(month: number): string {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return months[month - 1] || "";
}