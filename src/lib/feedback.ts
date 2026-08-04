import type { Question } from '../data/questions';

/**
 * 学習者の回答に対する解説文を生成する。
 *
 * 実システムでは AWS Bedrock の LLM を呼び出しているが、
 * 本リポジトリは公開デモのため API キーを持たない。
 * 環境変数が設定されていない場合は、あらかじめ用意した
 * 解説文にフォールバックする構成としている。
 */

const USE_LLM = import.meta.env.VITE_FEEDBACK_API_URL !== undefined;

/** 実システムで使用しているプロンプトの構造 */
function buildPrompt(question: Question, selectedIndex: number): string {
  return [
    'あなたは電気電子工学の学習支援を行う教員です。',
    '以下の問題に対して学習者が誤った選択をしました。',
    'なぜその考え方が正しくないのかを、2文以内・80字程度で説明してください。',
    '箇条書きや見出しなどの装飾記号は使わないでください。',
    '',
    `問題: ${question.text}`,
    `学習者の解答: ${question.choices[selectedIndex]}`,
    `正解: ${question.choices[question.correctIndex]}`,
  ].join('\n');
}

/** LLM の出力に混ざる装飾記号を取り除く */
export function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`{1,3}([^`]*)`{1,3}/g, '$1')
    .trim();
}

/** デモ用のフォールバック解説 */
const MOCK_FEEDBACK: Record<string, string> = {
  'basic_a-1':
    'デューティ比はスイッチがONになっている時間の割合です。ONの時間が長くなるほど出力側へ電力が送られる時間も増えるため、出力電圧は下がるのではなく上がります。',
  'basic_a-2':
    'デューティ比を変えても出力が変わらないとすると、この回路で電圧を制御する意味がなくなってしまいます。デューティ比は出力電圧を決める主要な要素です。',
  'basic_b-1':
    '出力電圧は入力電圧にデューティ比を掛けた値になります。デューティ比が変われば出力電圧も変わるため、一定にはなりません。',
  'basic_b-2':
    '出力電圧は入力電圧にデューティ比を掛けた値になります。デューティ比を上げれば出力電圧も上がる関係です。',
  'advanced-1':
    '発電量は電圧と電流の積で決まります。光の強さだけでは決まらず、動作点の電圧によって変化します。',
  'advanced-2':
    '温度も影響しますが主要な要因ではありません。発電量は動作点の電圧によって変化し、最大電力点を境に増減が入れ替わります。',
};

export async function generateFeedback(
  question: Question,
  selectedIndex: number
): Promise<string> {
  if (USE_LLM) {
    try {
      const res = await fetch(import.meta.env.VITE_FEEDBACK_API_URL as string, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: buildPrompt(question, selectedIndex) }),
      });
      const data = await res.json();
      return stripMarkdown(data.text);
    } catch {
      // 呼び出しに失敗した場合は用意した解説にフォールバックする
    }
  }

  await new Promise((r) => setTimeout(r, 600));
  return (
    MOCK_FEEDBACK[`${question.level}-${selectedIndex}`] ??
    'もう一度、デューティ比と出力の関係を確認してみましょう。'
  );
}