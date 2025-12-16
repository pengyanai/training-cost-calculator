import { GPUPreset } from './types';

// Based on BF16 Tensor Core dense TFLOPS estimates
export const GPU_PRESETS: GPUPreset[] = [
  {
    name: 'L40s',
    flops: 366,
    description: 'NVIDIA L40s 48G'
  },{
    name: 'A100',
    flops: 312,
    description: 'NVIDIA A100 SXM 80G'
  },
  {
    name: 'H800',
    flops: 990,
    description: 'NVIDIA H800 SXM 80G'
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
  gpuFlops: 366,   // L40s default (366 TFLOPS)
  mfu: 20          // 20%
};