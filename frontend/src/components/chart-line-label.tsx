"use client"

import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"

interface BookingAnalyticsChartProps {
  data: Array<{ day: string; bookings: number }>;
}

const chartConfig = {
  bookings: {
    label: "Bookings",
    color: "#e63946",
  },
} satisfies ChartConfig

export function ChartLineLabel({ data }: BookingAnalyticsChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          top: 20,
          left: 12,
          right: 12,
          bottom: 12,
        }}
      >
        <CartesianGrid vertical={false} stroke="#374151" strokeWidth={0.5} />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fill: '#9CA3AF', fontSize: 12 }}
          tickFormatter={(value) => value.toUpperCase()}
        />
        <YAxis hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent 
            indicator="line" 
            className="bg-gray-800 border-gray-600 text-white"
          />}
        />
        <Line
          dataKey="bookings"
          type="monotone"
          stroke="#e63946"
          strokeWidth={3}
          dot={{
            fill: "#e63946",
            stroke: "#fff",
            strokeWidth: 2,
            r: 4,
          }}
          activeDot={{
            r: 6,
            fill: "#e63946",
            stroke: "#fff",
            strokeWidth: 2,
          }}
        >
          <LabelList
            position="top"
            offset={12}
            className="fill-white"
            fontSize={10}
          />
        </Line>
      </LineChart>
    </ChartContainer>
  )
}
