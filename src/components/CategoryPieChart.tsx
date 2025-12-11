import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  type PieLabelRenderProps,
} from "recharts";

// COLORS FOR PIE SLICES
const COLORS = ["#22c55e", "#0ea5e9", "#facc15", "#ef4444", "#a855f7"];

// TypeScript type for a single data item
export interface CategoryData {
  name: string;
  value: number;
  [key: string]: string | number;
}

// Props type for the component
interface CategoryPieChartProps {
  data: CategoryData[];
}

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={110}
          label={(props: PieLabelRenderProps) =>
            `${props.name || "Unknown"}: $${props.value}`
          }
        >
          {data.map((_entry: CategoryData, index: number) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryPieChart;
