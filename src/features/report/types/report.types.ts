// Tipos básicos para reportes

export interface Site {
  id: number;
  nombre: string;
  latitude: number;
  longitude: number;
  zona_id: number;
  event_id: number;
  zona?: {
    id: number;
    locality: string;
  };
}

export interface UnitedMeasure {
  id: number;
  abbreviation: string;
  name: string;
}

export interface SampleChemical {
  ph?: number;
  conductivity?: number;
  Na?: number;
}

export interface SampleIsotopo {
  δ2H?: number;
  '18O'?: number;
}

export interface SampleLevel {
  nivel_freatico?: number;
}

export interface ReportRegular {
  id: number;
  amount: number;
  united_measure?: UnitedMeasure;
  sample_chemical?: SampleChemical;
  sample_isotopo?: SampleIsotopo;
  sample_level?: SampleLevel;
}

export interface BreakageInstrument {
  id: number;
  description_damage: string;
}

export interface Report {
  id: number;
  date: string;
  note?: string;
  image?: string;
  audio?: string;
  type: 'regular' | 'rotura';
  site: Site;
  report_regular?: ReportRegular;
  breakage_instrument?: BreakageInstrument;
}

export interface ReportFormData {
  date: string;
  note: string;
  site_id: string | number;
  zona_id: string | number;
  description_damage?: string;
}
