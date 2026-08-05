import { useState } from 'react';
import type { Question } from '../data/questions';
import { generateFeedback } from '../lib/feedback';

interface Props {
  question: Question;
  onAnswered: (selectedIndex: number, isCorrect: boolean) => void;
}

export default function CheckpointModal({ question, onAnswered }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ correct: boolean; feedback: string } | null>(null);

  const handleSubmit = async () => {
    if (selected === null || submitting) return;
    setSubmitting(true);

    const correct = selected === question.correctIndex;
    const feedback = correct
      ? 'その通りです。よく理解できています。'
      : await generateFeedback(question, selected);

    setResult({ correct, feedback });
    setSubmitting(false);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="mb-1 text-xs font-bold tracking-wide text-blue-600">{question.label}</p>
      <p className="mb-4 text-base font-bold leading-relaxed text-slate-800">{question.text}</p>

      <div className="space-y-2">
        {question.choices.map((choice, i) => (
          <button
            key={i}
            onClick={() => !result && setSelected(i)}
            disabled={result !== null}
            className={[
              'w-full rounded border px-4 py-3 text-left text-sm transition',
              result !== null && i === question.correctIndex
                ? 'border-green-500 bg-green-50 font-bold'
                : selected === i
                  ? 'border-blue-500 bg-blue-50 font-bold'
                  : 'border-slate-200',
              result === null ? 'hover:border-blue-300' : '',
            ].join(' ')}
          >
            {choice}
          </button>
        ))}
      </div>

      {result === null ? (
        <button
          onClick={handleSubmit}
          disabled={selected === null || submitting}
          className="mt-4 w-full rounded bg-blue-600 py-3 font-bold text-white disabled:bg-slate-300"
        >
          {submitting ? '判定中…' : '回答する'}
        </button>
      ) : (
        <div className="mt-4 space-y-3">
          <p className="text-lg font-bold">
            {result.correct ? '✅ 正解です！' : '🤔 もう一歩！考え方を確認しましょう'}
          </p>
          <p className="rounded bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
            {result.feedback}
          </p>
          <button
            onClick={() => onAnswered(selected!, result.correct)}
            className="w-full rounded bg-slate-800 py-3 font-bold text-white"
          >
            {question.level === 'prediction' ? '実験して確かめる' : '結果を見る'}
          </button>
        </div>
      )}
    </div>
  );
}