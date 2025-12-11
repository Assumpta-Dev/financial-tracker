// chart.ts
export interface CategoryData {
  name: string;
  value: number;
}

// If you want some default data to share
export const categoryData: CategoryData[] = [
  { name: "Food", value: 500 },
  { name: "Transport", value: 200 },
  { name: "Shopping", value: 350 },
];
