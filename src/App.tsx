import { useState } from 'react';
import CheckpointModal from './components/CheckpointModal';
import ExperimentStep from './components/ExperimentStep';
import KartePanel from './components/KartePanel';
import { QUESTIONS, type Level } from './data/questions';
import type { KarteSummary } from './lib/karte';

type Phase = 'question' | 'experiment' | 'finished';

interface AnswerLog {
  level: Level;
  selectedIndex: number;
  isCorrect: boolean;
}

/**
 * 成績カルテの表示例で用いるサンプル値。
 * 実際のシステムでは、プレ／ポストテストの結果と操作ログを
 * データベースから集計した実際の値が入る。
 */
const SAMPLE_SUMMARY: KarteSummary = {
  pre: { score: 3, durationSec: 420 },
  post: { score: 8, durationSec: 150 },
};

export default function App() {
  const [level, setLevel] = useState<Level>('prediction');
  const [phase, setPhase] = useState<Phase>('question');
  const [logs, setLogs] = useState<AnswerLog[]>([]);

  const handleAnswered = (selectedIndex: number, isCorrect: boolean) => {
    setLogs((prev) => [...prev, { level, selectedIndex, isCorrect }]);

    // 実験を挟むのは予測クイズの直後のみ
    if (level === 'prediction') {
      setPhase('experiment');
    } else {
      setPhase('finished');
    }
  };

  /** 実験後は、予測が当たったかどうかで次の問題を分ける */
  const handleExperimentComplete = () => {
    const first = logs[0];
    setLevel(first.isCorrect ? 'advanced' : 'review');
    setPhase('question');
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6">
      <div className="mx-auto max-w-xl space-y-4">
        <header>
          <h1 className="text-lg font-bold text-slate-800">
            遠隔実験システム ― 予測してから確かめる学習ステップ
          </h1>
          <p className="text-xs text-slate-500">降圧・昇圧コンバータ／太陽光発電の遠隔実験</p>
        </header>

        {phase === 'question' && (
          <CheckpointModal
            key={level}
            question={QUESTIONS[level]}
            onAnswered={handleAnswered}
          />
        )}

        {phase === 'experiment' && <ExperimentStep onComplete={handleExperimentComplete} />}

        {phase === 'finished' && (
          <>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="mb-3 text-base font-bold text-slate-800">学習を終了しました</h2>
              <ul className="mb-4 space-y-2 text-sm">
                {logs.map((log, i) => (
                  <li key={i} className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-600">{QUESTIONS[log.level].label}</span>
                    <span className={log.isCorrect ? 'text-green-600' : 'text-amber-600'}>
                      {log.isCorrect ? '正解' : 'もう一歩'}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-sm leading-relaxed text-slate-600">
                予測と実測を照らし合わせることで、デューティ比の変化が動作点をどう動かすかを確認できました。
              </p>
            </div>

            <KartePanel summary={SAMPLE_SUMMARY} />
          </>
        )}
      </div>
    </div>
  );
}