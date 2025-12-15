import React from 'react';
import { Calculator } from './components/Calculator';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12">
      <Calculator />
    </div>
  );
};

export default App;