import { useEffect, useState } from 'react';
import { generateKarteComment, type KarteSummary } from '../lib/karte';

interface Props {
  summary: KarteSummary;
}

export default function KartePanel({ summary }: Props) {
  const [comment, setComment] = useState<string | null>(null);

  useEffect(() => {
    generateKarteComment(summary).then(setComment);
  }, [summary]);

  const diff = summary.post.score - summary.pre.score;

  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-5">
      <div>
        <h2 className="text-base font-bold text-slate-800">成績カルテ（実システムの画面例）</h2>
        <p className="text-xs text-slate-500">あなたの実験結果を振り返りましょう</p>
      </div>

      <div className="rounded-lg bg-slate-100 px-3 py-2 text-xs leading-relaxed text-slate-600">
        実際のシステムでは、学習前後に実施する<strong>プレテスト／ポストテストの得点と所要時間</strong>、
        および<strong>実験中の操作ログ</strong>をデータベースから集計し、
        その結果をもとに振り返りコメントを生成しています。
        本デモではテストを実施しないため、以下はサンプル値です。
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <Stat label="プレテスト" value={`${summary.pre.score}点`} />
        <Stat label="ポストテスト" value={`${summary.post.score}点`} accent />
        <Stat label="伸び" value={`${diff >= 0 ? '+' : ''}${diff}点`} accent />
      </div>

      <div className="grid grid-cols-2 gap-2 text-center">
        <Stat label="プレテスト所要時間" value={`${summary.pre.durationSec}秒`} />
        <Stat label="ポストテスト所要時間" value={`${summary.post.durationSec}秒`} />
      </div>

      

      <div className="rounded-lg bg-emerald-50 p-4">
        <p className="mb-1 text-xs font-bold text-emerald-700">AIからの振り返りコメント</p>
        {comment === null ? (
          <p className="text-sm text-slate-400">生成中…</p>
        ) : (
          <p className="text-sm leading-relaxed text-slate-700">{comment}</p>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded bg-slate-50 px-2 py-3">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className={`text-xl font-bold tabular-nums ${accent ? 'text-emerald-600' : 'text-slate-800'}`}>
        {value}
      </p>
    </div>
  );
}