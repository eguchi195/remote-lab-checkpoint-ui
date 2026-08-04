import {
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { theoreticalCurve, type Measurement } from '../data/simulation';

interface Props {
  measurements: Measurement[];
}

const curve = theoreticalCurve();

export default function PvChart({ measurements }: Props) {
  const points = measurements.map((m) => ({ voltage: m.voltage, measured: m.power }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart margin={{ top: 8, right: 16, bottom: 24, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            type="number"
            dataKey="voltage"
            domain={[0, 5.5]}
            tickCount={7}
            label={{ value: '太陽電池の出力電圧 [V]', position: 'insideBottom', offset: -12 }}
            stroke="#6b7280"
          />
          <YAxis
            type="number"
            domain={[0, 2]}
            label={{ value: '電力 [W]', angle: -90, position: 'insideLeft' }}
            stroke="#6b7280"
          />
          <Tooltip
            formatter={(value) => `${value} W`}
            labelFormatter={(label) => `${label} V`}
          />
          <Legend verticalAlign="top" height={28} />
          <Line
            data={curve}
            dataKey="power"
            name="P-V曲線（理論値）"
            stroke="#cbd5e1"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          <Scatter
            data={points}
            dataKey="measured"
            name="測定値"
            fill="#2563eb"
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}