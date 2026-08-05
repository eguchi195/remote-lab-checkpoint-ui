/**
 * 成績カルテのフィードバックコメント生成。
 *
 * 実システムでは、MySQL に蓄積されたテスト結果を集計して
 * AWS Bedrock 上の LLM に送り、振り返りコメントを生成している。
 * 本リポジトリは公開デモのため、同じプロンプト構造を保持したうえで
 * 定型文へのフォールバックを行う。
 */

export interface TestResult {
  score: number;
  durationSec: number;
}

export interface KarteSummary {
  pre: TestResult;
  post: TestResult;
}

/** 実システムで使用しているプロンプト */
export function buildKartePrompt(summary: KarteSummary): string {
  return `あなたは学習支援システムのアシスタントです。
以下は、ある学習者の実験データです。これをもとに、学習者への
一言フィードバックコメントを日本語で2〜3文、優しい言葉で書いてください。

【必ず守ること】
・見出しは付けず、本文のみ出力する
・事実にない内容は書かない
・プレテストの点数とポストテストの点数を、両方とも具体的な数字で書く
・所要時間の変化も、具体的な秒数で書く
・所要時間の短縮については、「内容の理解が深まったこと」だけでなく
　「システムの操作に慣れたこと」の両方が考えられる、という書き方にする
　（どちらか一方に断定しない）

・プレテスト: ${summary.pre.score}点（所要時間${summary.pre.durationSec}秒）
・ポストテスト: ${summary.post.score}点（所要時間${summary.post.durationSec}秒）`;
}

export async function generateKarteComment(summary: KarteSummary): Promise<string> {
  await new Promise((r) => setTimeout(r, 800));

  const diff = summary.post.score - summary.pre.score;
  const faster = summary.pre.durationSec - summary.post.durationSec;

  const growth =
    diff > 0
      ? `プレテストの${summary.pre.score}点からポストテストの${summary.post.score}点へと得点が伸びており、学習の成果が表れています。`
      : `プレテスト${summary.pre.score}点、ポストテスト${summary.post.score}点という結果でした。`;

  const time =
    faster > 0
      ? `所要時間も${summary.pre.durationSec}秒から${summary.post.durationSec}秒へと短くなりました。これは内容の理解が深まったことに加えて、システムの操作に慣れたことの両方が考えられます。`
      : `所要時間は${summary.pre.durationSec}秒から${summary.post.durationSec}秒でした。じっくり考えて取り組めています。`;

  return `${growth}${time}`;
}