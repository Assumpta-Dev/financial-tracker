import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

interface ChartData {
  month: string;
  income: number;
  expense: number;
}

interface Props {
  data: ChartData[];
}

const IncomeExpenseChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow w-full h-[350px]">
      <h2 className="text-xl font-bold mb-3 text-gray-900">
        Income vs Expense
      </h2>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />
          <YAxis />

          <Tooltip
            formatter={(value: number, key) => [
              `$${value.toLocaleString()}`,
              key,
            ]}
          />

          <Legend />

          <Bar dataKey="income" fill="#16a34a" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" fill="#dc2626" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeExpenseChart;
