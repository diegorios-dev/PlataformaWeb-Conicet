// ============================================
// USER FEATURE - TYPE DEFINITIONS
// ============================================

export interface Zona {
  id: number;
  locality: string;
}

export interface Site {
  id: number;
  nombre?: string;
  latitude: string;
  longitude: string;
  zona_id: number;
  zona?: Zona;
}

export interface Instrument {
  id: number;
  name: string;
  brand?: string;
  model?: string;
  tipo_evento?: string;
  unidad_medida?: { name: string; symbol: string };
}

export interface UserType {
  id: number;
  name: string;
  password?: string;
  rol: string;
  site_id?: number;
  zona_id?: number;
  site?: Site;
  zona?: Zona;
}

export interface FormEditUserProps {
  selectedUser: UserType;
  setSelectedUser: (u: UserType) => void;
  setShowEditModal: (v: boolean) => void;
  saveUser: (u: UserType) => Promise<any>;
  onSave?: () => void;
}
