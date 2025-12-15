export interface GPUPreset {
  name: string;
  flops: number; // TFLOPS
  description: string;
}

export interface TrainingConfig {
  paramsB: number;
  tokensB: number;
  gpuCount: number;
  gpuFlops: number;
  mfu: number;
}