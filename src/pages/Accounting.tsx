import React from "react";
import { Calculator } from "lucide-react";

const Accounting = () => {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center text-center space-y-6">
      <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center animate-bounce shadow-xl shadow-emerald-500/10">
        <Calculator size={48} />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight animate-pulse">
          Bilan Comptable
        </h1>
        <p className="text-xl font-medium text-slate-500 bg-slate-100 px-6 py-2 rounded-full inline-block">
          Fonctionnalités Disponibles Prochainement
        </p>
      </div>
      <p className="max-w-md text-slate-400 text-sm">
        Génération automatique de vos états financiers, comptes de résultats et bilans annuels simplifiés.
      </p>
    </div>
  );
};

export default Accounting;