
import React, { useState } from 'react';
import { analyzePrompt, getIterationAdvice } from './geminiService';
import { AnalysisResult, AnalysisStatus, AppMode, IterationAdvice } from './types';
import { ScoreBar } from './components/ScoreBar';
import { Checklist } from './components/Checklist';

const SAMPLE_PROMPT = `# GOAL
Build a high-fidelity habit tracker dashboard.

# USER
Productivity enthusiasts who want a minimalist way to track daily routines.

# PLATFORM
Web app (React + Tailwind), responsive for mobile.

# FEATURES
- Dashboard showing a 7-day progress grid.
- Modal to add new habits with color labels.
- Weekly summary chart using Recharts.
- Supabase authentication and data persistence.

# UX REQUIREMENTS
- Use a dark mode theme by default.
- Soft animations when toggling habit completion.
- One-click 'Done' status from the main view.

# CONSTRAINTS
- Do not use complex libraries for the grid, just pure CSS/Tailwind.`;

const ComparisonView: React.FC<{ original: string; optimized: string }> = ({ original, optimized }) => {
  const originalLines = original.split('\n').map(l => l.trim());
  const optimizedLines = optimized.split('\n');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Original */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Original Prompt</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 overflow-hidden shadow-sm">
          <div className="text-[13px] font-mono text-slate-400 whitespace-pre-wrap leading-relaxed opacity-70">
            {original || 'No prompt provided.'}
          </div>
        </div>
      </div>

      {/* Right: Optimized */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Lovable-Optimized Prompt</span>
          <button 
            onClick={() => navigator.clipboard.writeText(optimized)}
            className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 hover:bg-indigo-100 transition-all"
          >
            Copy
          </button>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl overflow-hidden">
          <div className="text-[13px] font-mono leading-relaxed overflow-x-auto">
            {optimizedLines.map((line, i) => {
              const trimmed = line.trim();
              const isNew = trimmed !== '' && !originalLines.includes(trimmed);
              return (
                <div 
                  key={i} 
                  className={`min-h-[1.5rem] px-2 -mx-2 rounded ${isNew ? 'bg-indigo-500/10 text-indigo-200 border-l-2 border-indigo-500' : 'text-slate-300'}`}
                >
                  {line || ' '}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyState: React.FC<{ mode: AppMode }> = ({ mode }) => {
  if (mode === 'DEBUG') {
    return (
      <div className="flex flex-col py-12 px-6">
        <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Bridge the Vibe Gap</h3>
          <p className="text-sm text-slate-500 max-w-lg leading-relaxed">
            When Lovable produces unexpected results or code errors, it's usually due to "Vibe Shift"—vague technical constraints in the original prompt.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">How to Debug</h4>
            <ul className="text-xs text-slate-600 space-y-3">
              <li className="flex gap-3">
                <span className="h-5 w-5 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded font-bold shrink-0">1</span>
                <span>Paste your <strong className="text-slate-900">Original Prompt</strong> in the top field.</span>
              </li>
              <li className="flex gap-3">
                <span className="h-5 w-5 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded font-bold shrink-0">2</span>
                <span>Paste the <strong className="text-slate-900">Error or Output</strong> in the bottom field.</span>
              </li>
              <li className="flex gap-3">
                <span className="h-5 w-5 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded font-bold shrink-0">3</span>
                <span>Get a <strong className="text-slate-900">Course Correction</strong> string to steer Lovable back on track.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col py-12 px-6">
      <div className="mb-10">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Optimize for Lovable</h3>
        <p className="text-sm text-slate-500 max-w-lg leading-relaxed">
          PromptSense analyzes your project goals and technical constraints to ensure Lovable generates high-fidelity, production-ready code without hallucinations.
        </p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Weak Prompt</h4>
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm italic text-xs text-slate-400">
              "Build a social media app for sharing photos with friends."
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              <span className="font-bold text-rose-500 uppercase tracking-tighter">Issue:</span> No auth context, missing data schema details, and vague UX requirements lead to generic, broken code.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Improved Vibe</h4>
            <div className="p-4 bg-indigo-600 text-white rounded-xl shadow-lg text-[10px] font-mono leading-tight">
              # GOAL: Photo sharing PWA<br/>
              # FEATURES: Supabase Auth, S3 Storage<br/>
              # UX: Instagram-style grid, soft transitions...
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              <span className="font-bold text-emerald-500 uppercase tracking-tighter">Benefit:</span> Structured headers and technical steering reduce errors and align Lovable's engine with your vision.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('ANALYZE');
  const [prompt, setPrompt] = useState('');
  const [debugOutput, setDebugOutput] = useState('');
  
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [debugResult, setDebugResult] = useState<IterationAdvice | null>(null);
  
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    if (!prompt.trim()) return;
    
    setStatus(AnalysisStatus.LOADING);
    setError(null);
    try {
      if (mode === 'ANALYZE') {
        const data = await analyzePrompt(prompt);
        setResult(data);
      } else {
        const data = await getIterationAdvice(prompt, debugOutput);
        setDebugResult(data);
      }
      setStatus(AnalysisStatus.SUCCESS);
    } catch (err) {
      console.error(err);
      setError('Connection lost. Please check your API key or try again.');
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const handleTryExample = () => {
    setPrompt(SAMPLE_PROMPT);
    setResult(null);
    setDebugResult(null);
    setStatus(AnalysisStatus.IDLE);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50">
      <header className="flex-none bg-white border-b border-slate-200 z-10 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-6 md:py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="absolute -inset-1 bg-indigo-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-indigo-600 h-12 w-12 rounded-xl flex items-center justify-center shadow-xl shadow-indigo-100 ring-1 ring-indigo-700/5">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">PromptSense</h1>
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                Lovable Vibe-Coding Companion
              </p>
            </div>

            <nav className="flex bg-slate-100/80 p-1.5 rounded-xl ml-4 border border-slate-200/60 shadow-inner">
              <button 
                onClick={() => { setMode('ANALYZE'); setStatus(AnalysisStatus.IDLE); }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${mode === 'ANALYZE' ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Vibe Check
              </button>
              <button 
                onClick={() => { setMode('DEBUG'); setStatus(AnalysisStatus.IDLE); }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${mode === 'DEBUG' ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Debug Vibe
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button 
              disabled={status === AnalysisStatus.LOADING || !prompt.trim() || (mode === 'DEBUG' && !debugOutput.trim())}
              onClick={() => handleRun()}
              className={`min-w-[160px] px-8 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-3 active:scale-95 ${
                status === AnalysisStatus.LOADING 
                  ? 'bg-indigo-100 text-indigo-400 cursor-not-allowed border border-indigo-200'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200/50 hover:shadow-indigo-300/50 border border-indigo-500'
              }`}
            >
              {status === AnalysisStatus.LOADING ? (
                <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              <span>{mode === 'ANALYZE' ? (status === AnalysisStatus.LOADING ? 'Checking...' : 'Run Vibe Check') : (status === AnalysisStatus.LOADING ? 'Analyzing...' : 'Get Fix Advice')}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        <section className="w-full md:w-[45%] lg:w-[40%] flex flex-col bg-white border-r border-slate-200 shadow-sm z-0">
          <div className="px-8 py-5 bg-white border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
              {mode === 'ANALYZE' ? 'Your Lovable Prompt' : 'Vibe Context'}
            </h2>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleTryExample}
                className="text-[10px] font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest bg-slate-50 hover:bg-indigo-50 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-indigo-100"
              >
                Try Example
              </button>
              <span className="text-[10px] text-slate-300 font-mono hidden sm:inline">{prompt.length} chars</span>
            </div>
          </div>
          <div className={`flex-1 flex flex-col overflow-hidden ${mode === 'DEBUG' ? 'divide-y divide-slate-100' : ''}`}>
            <div className={`flex-1 relative flex flex-col p-6 ${mode === 'DEBUG' ? 'h-1/2' : 'h-full'}`}>
              <textarea
                className="flex-1 w-full p-8 text-[15px] text-slate-900 placeholder-slate-300 resize-none rounded-2xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all mono leading-relaxed shadow-inner"
                placeholder={`Weak prompt (Don't do this): \n"make a fitness app with a dashboard"\n\nStrong prompt (Do this): \n"Build a fitness dashboard for iPad using Supabase to track workout streaks with interactive charts..."`}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              {mode === 'ANALYZE' && (
                <div className="mt-5 px-3 py-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50 text-[11px] text-slate-600 leading-snug">
                  <span className="font-bold text-indigo-600 uppercase tracking-tighter mr-2">Vibe Tip:</span> Mention <span className="font-semibold text-slate-800">Supabase</span> for data, <span className="font-semibold text-slate-800">User Roles</span> for auth flows, and <span className="font-semibold text-slate-800">Specific UI Components</span> to reduce Lovable hallucinations.
                </div>
              )}
            </div>
            
            {mode === 'DEBUG' && (
              <div className="flex-1 relative flex flex-col p-6 h-1/2">
                <textarea
                  className="flex-1 w-full p-8 text-[15px] text-slate-900 placeholder-slate-300 resize-none rounded-2xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all mono leading-relaxed shadow-inner"
                  placeholder="Paste what Lovable generated (or the error message) to find where the vibe shifted..."
                  value={debugOutput}
                  onChange={(e) => setDebugOutput(e.target.value)}
                />
              </div>
            )}
          </div>
        </section>

        <section className="flex-1 flex flex-col overflow-y-auto bg-slate-50/50">
          <div className="px-8 py-5 bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm/50">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              {mode === 'ANALYZE' ? 'Vibe Quality Report' : 'Vibe Fix Advice'}
            </h2>
          </div>

          <div className="p-8 md:p-12 max-w-[1200px] mx-auto w-full space-y-12 pb-20">
            {((mode === 'ANALYZE' && !result) || (mode === 'DEBUG' && !debugResult)) && status === AnalysisStatus.IDLE && (
              <EmptyState mode={mode} />
            )}

            {status === AnalysisStatus.LOADING && (
              <div className="space-y-8 animate-pulse">
                <div className="h-32 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm"></div>
                <div className="h-[400px] bg-white rounded-3xl border border-slate-200 shadow-sm"></div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="h-64 bg-white rounded-2xl border border-slate-200 shadow-sm"></div>
                  <div className="h-64 bg-white rounded-2xl border border-slate-200 shadow-sm"></div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-sm flex items-start gap-4 shadow-sm">
                <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="py-1">
                  <h4 className="font-bold mb-0.5">Analysis Failed</h4>
                  <p className="opacity-90">{error}</p>
                </div>
              </div>
            )}

            {mode === 'ANALYZE' && result && status !== AnalysisStatus.LOADING && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 overflow-visible">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-visible relative">
                   <div className="absolute top-0 right-0 p-8">
                      <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Assessment ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</div>
                   </div>
                   <ScoreBar score={result.score} />
                   <div className="mt-8 pt-8 border-t border-slate-100">
                    <p className="text-base text-slate-600 leading-relaxed font-medium italic">
                      "{result.summary}"
                    </p>
                   </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                    <span className="h-px w-8 bg-slate-200"></span>
                    Vibe Evolution
                  </h3>
                  <ComparisonView original={prompt} optimized={result.refinedPrompt} />
                </div>

                {result.whatsChanged && result.whatsChanged.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                      <span className="h-px w-8 bg-slate-200"></span>
                      Technical Steering Applied
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {result.whatsChanged.map((change, idx) => (
                        <div key={idx} className="p-4 bg-indigo-50/30 border border-indigo-100/50 rounded-xl text-[12px] text-indigo-700 font-medium flex items-center gap-3">
                          <span className="h-6 w-6 bg-white rounded-lg flex items-center justify-center text-indigo-400 shadow-sm border border-indigo-50">+</span>
                          {change}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Vibe Compliance Audit</h3>
                      <Checklist checklist={result.checklist} />
                    </div>

                    {result.prioritizedActions && result.prioritizedActions.length > 0 && (
                      <div className="space-y-4 p-8 bg-amber-50/50 border border-amber-200 rounded-3xl shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 group-hover:rotate-6 transition-transform">
                          <svg className="w-16 h-16 text-amber-600" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h3 className="text-[11px] font-black text-amber-700 uppercase tracking-widest flex items-center gap-3">
                          <div className="h-6 w-6 rounded-lg bg-amber-200/50 flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          Priority Fixes
                        </h3>
                        <div className="space-y-4 pt-2 relative z-10">
                          {result.prioritizedActions.map((action, idx) => (
                            <div key={idx} className="flex items-start gap-4">
                              <div className="h-6 w-6 rounded-full bg-amber-200/60 text-amber-800 text-[11px] font-black flex items-center justify-center flex-shrink-0 border border-amber-300/30">
                                {idx + 1}
                              </div>
                              <p className="text-[14px] font-bold text-slate-800 leading-tight pt-0.5">{action}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-6">
                    <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm transition-all hover:shadow-md hover:border-slate-300">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                        <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Strength Vectors</h4>
                      </div>
                      <ul className="text-xs text-slate-600 space-y-3">
                        {result.strengths.map((s, i) => (
                          <li key={i} className="flex gap-3">
                            <span className="text-emerald-400 font-bold">✓</span>
                            <span className="font-medium">{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm transition-all hover:shadow-md hover:border-slate-300">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-2 w-2 rounded-full bg-rose-500"></div>
                        <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Hallucination Risks</h4>
                      </div>
                      <ul className="text-xs text-slate-600 space-y-3">
                        {result.weaknesses.map((w, i) => (
                          <li key={i} className="flex gap-3">
                            <span className="text-rose-400 font-bold">!</span>
                            <span className="font-medium">{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {mode === 'DEBUG' && debugResult && status !== AnalysisStatus.LOADING && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm border-l-8 border-l-amber-400 flex flex-col justify-center">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">The Misinterpretation</h3>
                    <p className="text-lg text-slate-800 leading-relaxed font-bold">{debugResult.misunderstanding}</p>
                  </div>

                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Structural Vulnerability</h3>
                    <p className="text-slate-600 leading-relaxed font-medium">{debugResult.rootCause}</p>
                  </div>
                </div>

                <div className="bg-slate-900 p-10 md:p-14 rounded-[40px] shadow-2xl text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                    <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <div className="relative z-10 max-w-3xl">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/40">
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <h3 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.25em]">Master Logic Injection</h3>
                      </div>
                      <button 
                        onClick={() => navigator.clipboard.writeText(debugResult.fix)}
                        className="text-xs font-bold bg-white/10 hover:bg-white/20 px-6 py-2.5 rounded-xl backdrop-blur-md transition-all border border-white/10 flex items-center gap-2 group/btn active:scale-95"
                      >
                        <svg className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Copy Fix String
                      </button>
                    </div>
                    <p className="text-2xl font-black leading-tight mb-8">Force the engine's perspective with this technical constraint:</p>
                    <div className="bg-slate-800/80 p-8 rounded-2xl border border-white/5 font-mono text-indigo-200 text-lg shadow-inner group-hover:bg-slate-800 transition-colors">
                      {debugResult.fix}
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-slate-100/50 border border-slate-200 rounded-3xl border-dashed">
                  <div className="flex items-center gap-3 mb-3">
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest italic">Iteration Protocol</h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Lovable handles complex state logic best when you explicitly describe the user flow transitions. If it gets stuck in a loop, try adding: "Ensure that after [Action], the user is redirected to [Page] and [Data] is refreshed." This creates a clear state-machine for the LLM to follow.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <footer className="flex-none bg-white border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
        <div className="flex items-center gap-6 mb-2 sm:mb-0">
          <span className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${status === AnalysisStatus.IDLE ? 'bg-slate-200' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]'}`}></span>
            Vibe Core Online
          </span>
          <span className="hidden md:inline">Engine: Gemini 3 Flash-Preview</span>
          <span className="hidden lg:inline text-indigo-500/60">Target: Lovable Logic</span>
        </div>
        <div className="flex items-center gap-2">
          <span>PromptSense Protocol</span>
          <span className="text-slate-200">•</span>
          <span className="text-slate-500">v1.4.2</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
