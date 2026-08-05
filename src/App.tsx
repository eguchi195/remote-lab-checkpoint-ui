import { useState } from 'react';
import CheckpointModal from './components/CheckpointModal';
import ExperimentStep from './components/ExperimentStep';
import { QUESTIONS, type Level } from './data/questions';
import KartePanel from './components/KartePanel';
import type { KarteSummary } from './lib/karte';

/**
 * 成績カルテの表示例で用いるサンプル値。
 * 実際のシステムではプレ／ポストテストの結果と操作ログを
 * データベースから集計した実際の値が入る。
 */
const SAMPLE_SUMMARY: KarteSummary = {
  pre: { score: 3, durationSec: 420 },
  post: { score: 8, durationSec: 150 },
};

type Phase = 'question' | 'experiment' | 'finished';

interface AnswerLog {
  level: Level;
  selectedIndex: number;
  isCorrect: boolean;
}

/** 回答結果から次に進むレベルを決める（不正解なら別角度の問題へ） */
function nextLevel(level: Level, isCorrect: boolean): Level | null {
  if (level === 'basic_a') return isCorrect ? 'advanced' : 'basic_b';
  if (level === 'basic_b') return isCorrect ? 'advanced' : null;
  return null;
}

export default function App() {
  const [level, setLevel] = useState<Level>('basic_a');
  const [phase, setPhase] = useState<Phase>('question');
  const [logs, setLogs] = useState<AnswerLog[]>([]);

  const handleAnswered = (selectedIndex: number, isCorrect: boolean) => {
    setLogs((prev) => [...prev, { level, selectedIndex, isCorrect }]);
    setPhase('experiment');
  };

  const handleExperimentComplete = () => {
    const last = logs[logs.length - 1];
    const next = nextLevel(last.level, last.isCorrect);
    if (next) {
      setLevel(next);
      setPhase('question');
    } else {
      setPhase('finished');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6">
      <div className="mx-auto max-w-xl space-y-4">
        <header>
          <h1 className="text-lg font-bold text-slate-800">
            遠隔実験システム ― 判断ポイント機能
          </h1>
          <p className="text-xs text-slate-500">
            降圧・昇圧コンバータ／予測してから確かめる学習ステップ
          </p>
        </header>

        {phase === 'question' && (
          <CheckpointModal
            key={level}
            question={QUESTIONS[level]}
            onAnswered={handleAnswered}
          />
        )}

        {phase === 'experiment' && (
          <ExperimentStep key={logs.length} onComplete={handleExperimentComplete} />
        )}

        {phase === 'finished' && (
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-base font-bold text-slate-800">学習を終了しました</h2>
            <ul className="mb-4 space-y-2 text-sm">
              {logs.map((log, i) => (
                <li key={i} className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-600">
                    {log.level === 'basic_a' ? '基礎A' : log.level === 'basic_b' ? '基礎B' : '応用'}
                  </span>
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
        )}

        {phase === 'finished' && <KartePanel summary={SAMPLE_SUMMARY} />}
      </div>
    </div>
  );
}