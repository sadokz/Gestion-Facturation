"use client";

/**
 * Liste des clés localStorage utilisées par l'application
 */
const APP_DATA_KEYS = [
  "my_companies",
  "app_users",
  "app_roles",
  "app_view_modes",
  "app_navigation_tabs_per_company",
  "dashboard_preferences",
  "dashboard_kpi_order",
  "dashboard_main_section_order",
  "dashboard_section_widths",
  "app_privacy_mode",
  "selected_year",
  "available_years"
];

/**
 * Exporte toutes les données de configuration en un fichier JSON
 */
export const exportAppData = () => {
  const data: Record<string, any> = {};
  
  APP_DATA_KEYS.forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      try {
        data[key] = JSON.parse(value);
      } catch (e) {
        data[key] = value;
      }
    }
  });

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `backup_erp_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Importe les données depuis un fichier JSON et recharge la page
 */
export const importAppData = (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        // Validation basique
        if (typeof data !== 'object') throw new Error("Format invalide");

        // Mise à jour du localStorage
        Object.entries(data).forEach(([key, value]) => {
          if (APP_DATA_KEYS.includes(key)) {
            localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
          }
        });

        resolve();
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Erreur de lecture du fichier"));
    reader.readAsText(file);
  });
};