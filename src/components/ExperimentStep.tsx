import { useState } from 'react';
import PvChart from './PvChart';
import { measure, REQUIRED_DUTIES, type Measurement } from '../data/simulation';

interface Props {
  onComplete: () => void;
}

export default function ExperimentStep({ onComplete }: Props) {
  const [duty, setDuty] = useState(50);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);

  const measured = measurements.map((m) => m.duty);
  const remaining = REQUIRED_DUTIES.filter((d) => !measured.includes(d));
  const current = measure(duty);
  const alreadyMeasured = measured.includes(duty);

  const handleMeasure = () => {
    if (alreadyMeasured) return;
    setMeasurements((prev) => [...prev, current].sort((a, b) => a.voltage - b.voltage));
  };

  const changeDuty = (delta: number) => {
    setDuty((d) => Math.min(100, Math.max(0, d + delta)));
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
        デューティ比を10%刻みで0%〜100%まで動かしながら、都度「1点計測」で測定してグラフを完成させましょう。
        <span className="font-bold">（あと{remaining.length}点）</span>
      </div>

      <PvChart measurements={measurements} />

      <div className="rounded-lg border border-slate-200 p-4">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-sm text-slate-600">デューティ比</span>
          <span className="text-2xl font-bold tabular-nums text-slate-800">{duty}%</span>
        </div>

        <div className="mb-3 flex gap-2">
          <button
            onClick={() => changeDuty(-10)}
            className="flex-1 rounded border border-slate-300 py-2 text-sm hover:bg-slate-50"
          >
            −10%
          </button>
          <button
            onClick={() => changeDuty(10)}
            className="flex-1 rounded border border-slate-300 py-2 text-sm hover:bg-slate-50"
          >
            +10%
          </button>
        </div>

        <dl className="mb-3 grid grid-cols-3 gap-2 text-center text-xs text-slate-600">
          <div>
            <dt>電圧</dt>
            <dd className="text-base font-bold tabular-nums text-slate-800">
              {current.voltage} V
            </dd>
          </div>
          <div>
            <dt>電流</dt>
            <dd className="text-base font-bold tabular-nums text-slate-800">
              {current.current} A
            </dd>
          </div>
          <div>
            <dt>電力</dt>
            <dd className="text-base font-bold tabular-nums text-slate-800">
              {current.power} W
            </dd>
          </div>
        </dl>

        <button
          onClick={handleMeasure}
          disabled={alreadyMeasured}
          className="w-full rounded bg-blue-600 py-3 font-bold text-white disabled:bg-slate-300"
        >
          {alreadyMeasured ? 'この点は計測済みです' : '1点計測'}
        </button>
      </div>

      {remaining.length === 0 && (
        <button
          onClick={onComplete}
          className="w-full rounded bg-slate-800 py-3 font-bold text-white"
        >
          次へ進む
        </button>
      )}
    </div>
  );
}