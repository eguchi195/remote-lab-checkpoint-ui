export type Level = 'basic_a' | 'basic_b' | 'advanced';

export interface Question {
  level: Level;
  theme: string;
  text: string;
  choices: string[];
  correctIndex: number;
}

export const QUESTIONS: Record<Level, Question> = {
  basic_a: {
    level: 'basic_a',
    theme: '降圧昇圧',
    text: '降圧コンバータのデューティ比を上げると、出力電圧はどうなると予想しますか？',
    choices: ['上がる', '下がる', '変わらない'],
    correctIndex: 0,
  },
  basic_b: {
    level: 'basic_b',
    theme: '降圧昇圧',
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
    theme: '降圧昇圧',
    text: 'デューティ比を上げると出力電圧は上がりますが、太陽電池の発電量（電力）も必ず増えるとは限りません。その理由として最も近いものはどれですか？',
    choices: [
      '発電量は、最大電力点を超えると逆に減ることがあるから',
      '発電量は光の強さだけで決まり、電圧には関係しないから',
      '発電量は温度だけで変化するから',
    ],
    correctIndex: 0,
  },
};