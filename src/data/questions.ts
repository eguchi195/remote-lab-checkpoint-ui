export type Level = 'prediction' | 'review' | 'advanced';

export interface Question {
  level: Level;
  /** 学習者に表示するラベル */
  label: string;
  text: string;
  choices: string[];
  correctIndex: number;
}

export const QUESTIONS: Record<Level, Question> = {
  prediction: {
    level: 'prediction',
    label: '予測クイズ',
    text: '降圧コンバータのデューティ比を上げると、出力電圧はどうなると予想しますか？',
    choices: ['上がる', '下がる', '変わらない'],
    correctIndex: 0,
  },
  review: {
    level: 'review',
    label: '確認問題',
    text: 'デューティ比を上げていくと、出力電圧はどのように変化すると考えられますか？',
    choices: [
      'デューティ比にほぼ比例して変化する',
      'デューティ比に関係なくほぼ一定である',
      'デューティ比を上げるとかえって下がっていく',
    ],
    correctIndex: 0,
  },
  advanced: {
    level: 'advanced',
    label: '応用問題',
    text: 'デューティ比を上げると出力電圧は上がりますが、太陽電池の発電量（電力）も必ず増えるとは限りません。その理由として最も近いものはどれですか？',
    choices: [
      '発電量は、最大電力点を超えると逆に減ることがあるから',
      '発電量は光の強さだけで決まり、電圧には関係しないから',
      '発電量は温度だけで変化するから',
    ],
    correctIndex: 0,
  },
};