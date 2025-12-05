import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface BalanceData {
  date: string;
  balance: number;
}

interface BalanceChartProps {
  data: BalanceData[];
}

const BalanceChart: React.FC<BalanceChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        {/* X Axis (Date) */}
        <XAxis dataKey="date" />

        {/* Y Axis (with $ sign) */}
        <YAxis tickFormatter={(value) => `$${value}`} />

        {/* Tooltip on hover */}
        <Tooltip
          formatter={(value: number) => [`$${value}`, "Balance"]}
          labelFormatter={(label) => `Date: ${label}`}
        />

        {/* Line */}
        <Line
          type="monotone"
          dataKey="balance"
          stroke="#22c55e"
          strokeWidth={3}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BalanceChart;
