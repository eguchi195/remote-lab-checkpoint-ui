/**
 * 太陽電池の模擬測定データ。
 * 実機を持たない再現版のため、太陽電池の等価回路モデルに基づいて
 * 測定値を計算で生成している。
 */

/** 短絡電流 [A] */
const I_SC = 0.45;
/** 開放電圧 [V] */
const V_OC = 5.2;
/** 曲線の膨らみを決める係数（大きいほど角ばる） */
const SHAPE = 22;

/** 太陽電池の I-V 特性。電圧を与えて電流を返す */
export function currentAt(voltage: number): number {
  if (voltage <= 0) return I_SC;
  const i = I_SC * (1 - (Math.exp(voltage / (V_OC / SHAPE)) - 1) / (Math.exp(SHAPE) - 1));
  return Math.max(0, i);
}

/**
 * デューティ比から、太陽電池の動作点（電圧）を求める。
 * 降圧コンバータでは、デューティ比を上げるほど太陽電池側から見た
 * 負荷が軽くなり、動作点は開放電圧側から短絡側へ移動する。
 */
export function operatingVoltage(dutyPercent: number): number {
  const d = dutyPercent / 100;
  return V_OC * (1 - d) + 0.05;
}

export interface Measurement {
  duty: number;
  voltage: number;
  current: number;
  power: number;
  /** 降圧コンバータの出力電圧（デューティ比に比例） */
  outputVoltage: number;
}

/** 指定したデューティ比における測定値を返す */
export function measure(dutyPercent: number): Measurement {
  const voltage = operatingVoltage(dutyPercent);
  const current = currentAt(voltage);
  const power = voltage * current;
  return {
    duty: dutyPercent,
    voltage: round(voltage),
    current: round(current, 3),
    power: round(power, 3),
    outputVoltage: round(voltage * (dutyPercent / 100)),
  };
}

/** 理論上の P-V 曲線（グラフの下敷きとして描く） */
export function theoreticalCurve(): { voltage: number; power: number }[] {
  const points = [];
  for (let v = 0; v <= V_OC; v += V_OC / 60) {
    points.push({ voltage: round(v), power: round(v * currentAt(v), 3) });
  }
  return points;
}

function round(value: number, digits = 2): number {
  const p = 10 ** digits;
  return Math.round(value * p) / p;
}

/** 測定が必要なデューティ比（0〜100%を10%刻み） */
export const REQUIRED_DUTIES = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];