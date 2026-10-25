export interface GameState {
  day: number;
  budget: number;
  builds: number;
  sanitation: number;
  agriculture: number;
  education: number;
  waterPumps: number;
  sanitationStations: number;
  damagedPumps: number;
  damagedSanitation: number;
}

export const INITIAL_STATE: GameState = {
  day: 1,
  budget: 100,
  builds: 0,
  sanitation: 0,
  agriculture: 0,
  education: 0,
  waterPumps: 0,
  sanitationStations: 0,
  damagedPumps: 0,
  damagedSanitation: 0,
};

export const COSTS = {
  waterPump: 40,
  sanitationStation: 30,
  advertise: 15,
  educate: 20,
} as const;

export const REWARDS = {
  waterPump: { sanitation: 2, agriculture: 2 },
  sanitationStation: { sanitation: 3 },
  advertise: { budget: 30 },
  educate: { education: 2 },
} as const;

export interface DisruptionEvent {
  id: string;
  facilityType: 'waterPump' | 'sanitationStation';
  title: string;
  cause: string;
  baseCost: number;
}

export const PUMP_DISRUPTIONS: Omit<DisruptionEvent, 'id' | 'facilityType'>[] = [
  {
    title: 'Severe Sand & Silt Intrusion',
    cause: 'Heavy seasonal groundwater shifts deposited fine silt and gravel into the intake cylinder, choking the pump screen.',
    baseCost: 25,
  },
  {
    title: 'Pump Handle Bearing Friction & Rod Wear',
    cause: 'Intense daily community pumping wore down the mechanical fulcrum lever and pump rod couplings.',
    baseCost: 20,
  },
  {
    title: 'Monsoon Apron Subsoil Erosion',
    cause: 'Torrential downpours washed away soil beneath the concrete platform, fracturing the hydraulic seal.',
    baseCost: 25,
  },
  {
    title: 'Piston Gasket & O-Ring Degradation',
    cause: 'Mineral-rich hard aquifer water dried out the rubber pressure seals inside the riser cylinder.',
    baseCost: 20,
  },
];

export const SANITATION_DISRUPTIONS: Omit<DisruptionEvent, 'id' | 'facilityType'>[] = [
  {
    title: 'Flash Runoff Containment Breach',
    cause: 'Sudden seasonal flash floods overflowed the perimeter drainage boundary around the facility.',
    baseCost: 22,
  },
  {
    title: 'Biofilter Gravel Sedimentation',
    cause: 'High community usage caused organic sedimentation to clog the aeration and drainage gravel filter bed.',
    baseCost: 18,
  },
  {
    title: 'High-Wind Ventilation Damage',
    cause: 'Strong savanna wind gusts displaced the solar ventilation exhaust cowl and protective roofing brackets.',
    baseCost: 20,
  },
  {
    title: 'Handwashing Foot-Pump Mechanical Fracture',
    cause: 'Heavy continuous hygiene usage cracked the internal foot-pedal spring and greywater diversion pipe.',
    baseCost: 18,
  },
];
