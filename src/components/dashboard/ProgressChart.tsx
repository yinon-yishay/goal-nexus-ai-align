
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProgressData {
  month: string;
  progress: number;
}

interface ProgressChartProps {
  data: ProgressData[];
  title: string;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ data, title }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 100]} />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Progress']}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="progress" 
              stroke="#2563EB" 
              strokeWidth={2}
              dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#2563EB', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
