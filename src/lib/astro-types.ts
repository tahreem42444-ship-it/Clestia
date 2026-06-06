export type BirthLocation = {
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
};

export type AstroProfile = {
  name: string;
  birthDate: string;
  birthTime?: string;
  birthLocation?: BirthLocation;
};

export type PlanetPosition = {
  planet: string;
  sign: string;
  longitude: number;
  degreeInSign: number;
  retrograde?: boolean;
};

export type MoonPhaseInfo = {
  name: string;
  illumination?: number;
  ageDays?: number;
};

export type TransitReport = {
  generatedAt: string;
  source: "astronomy-engine" | "freeastroapi" | "fallback";
  moonPhase: MoonPhaseInfo;
  planets: PlanetPosition[];
  summary: string;
};

export type BirthChartReport = {
  source: "freeastroapi" | "astronomy-engine-lite" | "fallback";
  ascendant?: string;
  moonSign?: string;
  sunSign?: string;
  planets?: PlanetPosition[];
  moonPhase?: MoonPhaseInfo;
  summary?: string;
  houses?: unknown;
  raw?: unknown;
  unavailableReason?: string;
};
