import React from "react";
import { ShieldCheck } from "lucide-react";

const CNSS = () => {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center text-center space-y-6">
      <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center animate-bounce shadow-xl shadow-blue-500/10">
        <ShieldCheck size={48} />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight animate-pulse">
          Déclaration CNSS
        </h1>
        <p className="text-xl font-medium text-slate-500 bg-slate-100 px-6 py-2 rounded-full inline-block">
          Fonctionnalités Disponibles Prochainement
        </p>
      </div>
      <p className="max-w-md text-slate-400 text-sm">
        Nous travaillons sur l'automatisation de vos déclarations trimestrielles et le calcul des cotisations patronales.
      </p>
    </div>
  );
};

export default CNSS;