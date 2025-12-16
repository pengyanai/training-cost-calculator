import React from 'react';
import { Calculator } from './components/Calculator';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex justify-center px-3 sm:px-5 md:px-6 lg:px-8 py-2 md:py-4 lg:py-6 overflow-x-hidden">
      <Calculator />
    </div>
  );
};

export default App;