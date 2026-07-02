export type { Coord, SiteStatus, InstrumentoAveriado } from "@features/map/types/interfaces";

export interface MenuInstrumentOption {
  event: string;
  instrumento: string;
}

export interface MenuComplementOption {
  option: string;
  onClick: () => void;
}

export interface ViewOptionMenuProps {
  instruments: MenuInstrumentOption[];
  selectedInstrument: string | number | null;
  onSelectInstrument: (instrument: string) => void;
}

export interface ViewComplementMenuProps {
  complements: MenuComplementOption[];
}