import React, { useState, useMemo } from 'react';
import { Settings, Server, Cpu, Activity, Clock, Zap, Layers } from 'lucide-react';
import { InputGroup } from './InputGroup';
import { GPU_PRESETS, DEFAULT_CONFIG } from '../constants';

export const Calculator: React.FC = () => {
  const [paramsB, setParamsB] = useState<number>(DEFAULT_CONFIG.paramsB);
  const [tokensB, setTokensB] = useState<number>(DEFAULT_CONFIG.tokensB);
  const [gpuCount, setGpuCount] = useState<number>(DEFAULT_CONFIG.gpuCount);
  const [gpuFlops, setGpuFlops] = useState<number>(DEFAULT_CONFIG.gpuFlops);
  const [mfu, setMfu] = useState<number>(DEFAULT_CONFIG.mfu);
  const [isMoE, setIsMoE] = useState<boolean>(false);

  // Handle MoE Toggle
  const handleMoEToggle = (enabled: boolean) => {
    setIsMoE(enabled);
    if (enabled) {
      setMfu(10);
    } else {
      setMfu(20);
    }
  };

  // Result Calculation
  const resultDays = useMemo(() => {
    // Formula: (6 * P * T) / (N * F * MFU)
    // Units conversion:
    // P (Params) in Billions (10^9)
    // T (Tokens) in Billions (10^9)
    // F (FLOPs) in TFLOPS (10^12)
    // MFU is percentage (0.2)
    
    // Numerator: 6 * (P * 10^9) * (T * 10^9) = 6 * P * T * 10^18
    // Denominator: N * (F * 10^12) * (MFU/100)
    
    // Simplified for calculation to avoid huge numbers:
    // Seconds = (6 * P * T * 10^6) / (N * F * (MFU/100))
    
    if (gpuCount <= 0 || gpuFlops <= 0 || mfu <= 0) return 0;

    const numerator = 6 * paramsB * tokensB * 1_000_000;
    const denominator = gpuCount * gpuFlops * (mfu / 100);
    
    const seconds = numerator / denominator;
    const days = seconds / (24 * 3600);
    
    return days;
  }, [paramsB, tokensB, gpuCount, gpuFlops, mfu]);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
      
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
          AI 模型训练耗时计算器
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          基于业界标准公式估算大语言模型 (LLM) 训练所需时间
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <div className="flex items-center space-x-2 mb-6 border-b border-slate-100 pb-4">
              <Settings className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-slate-800">模型与数据配置</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup 
                label="模型激活参数量" 
                value={paramsB} 
                onChange={setParamsB} 
                unit="B (十亿)"
                description="输入参与计算的参数量"
              />
              <InputGroup 
                label="训练 Tokens 数量" 
                value={tokensB} 
                onChange={setTokensB} 
                unit="B (十亿)"
                description="数据集大小"
              />
            </div>

            {/* MoE Toggle */}
            <div className="mt-6 bg-indigo-50/50 rounded-xl p-4 border border-indigo-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">MoE (混合专家) 模型</h3>
                  <p className="text-xs text-slate-500">启用后算力利用率 (MFU) 默认设为 10%</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={isMoE}
                  onChange={(e) => handleMoEToggle(e.target.checked)}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <div className="flex items-center space-x-2 mb-6 border-b border-slate-100 pb-4">
              <Server className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-slate-800">算力资源配置</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <InputGroup 
                  label="GPU 卡数" 
                  value={gpuCount} 
                  onChange={setGpuCount} 
                  unit="张"
                  min={1}
                />
                
                <div>
                   <InputGroup 
                    label="单卡算力 (FP16/BF16)" 
                    value={gpuFlops} 
                    onChange={setGpuFlops} 
                    unit="TFLOPS"
                  />
                  {/* Quick Select Buttons */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {GPU_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => setGpuFlops(preset.flops)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors border ${
                          gpuFlops === preset.flops
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                        title={preset.description}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                 <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-slate-400" />
                      算力利用率 (MFU)
                    </label>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-indigo-600">{mfu}%</span>
                      {isMoE && mfu === 10 && <span className="text-xs text-slate-400">(MoE 默认)</span>}
                    </div>
                 </div>
                 <input
                  type="range"
                  min="0"
                  max="50"
                  value={mfu}
                  onChange={(e) => setMfu(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-700"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                  <span>0%</span>
                  <span className={isMoE ? "text-indigo-600 font-bold" : ""}>10% (MoE)</span>
                  <span className={!isMoE ? "text-indigo-600 font-bold" : ""}>20% (Dense)</span>
                  <span>50% (Max)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Result */}
        <div className="lg:col-span-5">
          <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 h-full shadow-xl flex flex-col justify-between relative overflow-hidden">
             {/* Background decoration */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

            <div>
              <div className="flex items-center gap-2 mb-6 opacity-80">
                <Clock className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wider">预估训练时间</span>
              </div>
              
              <div className="mb-8">
                 <div className="text-6xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                  {resultDays.toFixed(2)}
                 </div>
                 <div className="text-xl text-slate-400 mt-2 font-medium">天 (Days)</div>
              </div>

              {resultDays > 365 && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm flex items-start gap-2">
                  <span className="mt-0.5">⚠️</span>
                  <span>训练时间过长，建议增加卡数或减少数据量。</span>
                </div>
              )}
            </div>

            <div className="border-t border-slate-700/50 pt-6 mt-6">
              <h3 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                计算公式参考
              </h3>
              <div className="bg-slate-800/50 rounded-lg p-4 font-mono text-xs text-slate-400 leading-relaxed break-all">
                Time = (6 × {paramsB}B × {tokensB}B) / ({gpuCount} × {gpuFlops} TFLOPS × {mfu}%)
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <Zap className="w-3 h-3" />
                <span>总算力需求: {((6 * paramsB * tokensB) / 1000).toFixed(2)} ZettaFLOPS</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};