
"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

// Mock data, in a real app this would come from props from Firestore
const bidHistory = [
  { name: '3 วันก่อน', price: 4500 },
  { name: '2 วันก่อน', price: 5000 },
  { name: 'เมื่อวาน', price: 5500 },
  { name: 'วันนี้', price: 6250 },
];

const aiEstimatedPrice = 7000;

export default function PriceHistoryChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-headline">
            <TrendingUp className="mr-3 h-6 w-6"/>
            กราฟราคาประมูล
        </CardTitle>
        <CardDescription>ประวัติการเสนอราคาและราคาประเมินโดย AI</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bidHistory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `฿${typeof value === 'number' ? value/1000 : 0}k`} />
                    <Tooltip
                        contentStyle={{
                            background: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "var(--radius)",
                        }}
                        cursor={{ fill: 'hsl(var(--muted))' }}
                    />
                    <Legend wrapperStyle={{fontSize: "14px"}}/>
                    <Bar dataKey="price" name="ราคาเสนอ" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <ReferenceLine 
                        y={aiEstimatedPrice} 
                        label={{ value: "ประเมินโดย AI", position: 'insideTopRight', fill: 'hsl(var(--accent-foreground))', fontSize: 12 }} 
                        stroke="hsl(var(--accent))" 
                        strokeDasharray="3 3" 
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
