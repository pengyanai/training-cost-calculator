import { GPUPreset } from './types';

// Based on BF16 Tensor Core dense TFLOPS estimates
export const GPU_PRESETS: GPUPreset[] = [
  {
    name: 'A100',
    flops: 312,
    description: 'NVIDIA A100 SXM 80G'
  },
  {
    name: 'H100',
    flops: 990,
    description: 'NVIDIA H100 SXM 80G'
  },
  {
    name: '910B2',
    flops: 376,
    description: 'Huawei Ascend 910B2 64G'
  }
];

export const DEFAULT_CONFIG = {
  paramsB: 7,      // 7B Model
  tokensB: 20,     // 20B Tokens (Updated per request)
  gpuCount: 8,     // 1 Node
  gpuFlops: 312,   // A100 default
  mfu: 20          // 20%
};