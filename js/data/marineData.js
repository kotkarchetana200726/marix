import { PFZ_ZONES as MOCK_PFZ, WEATHER_FORECAST as MOCK_WEATHER, HAZARDS as MOCK_HAZARDS, ROUTE_PRESETS as MOCK_ROUTES } from './mockData.js';

export const PFZ_ZONES = MOCK_PFZ;
export const WEATHER_FORECAST = MOCK_WEATHER;
export const HAZARDS = MOCK_HAZARDS;
export const ROUTE_PRESETS = MOCK_ROUTES;

export const marineData = {
  location: {
    name: "Ratnagiri Coast",
    region: "Arabian Sea — Maharashtra-Goa Coast",
    latitude: 16.99,
    longitude: 73.31
  },

  weather: {
    temperature: 28,
    windSpeed: 18,
    windDirection: "SW",
    rainfallProbability: 35,
    visibility: 7.2
  },

  ocean: {
    seaSurfaceTemperature: 28.4,
    waveHeight: 1.4,
    wavePeriod: 7,
    seaState: "Moderate",
    chlorophyll: 2.8
  },

  tide: {
    nextHighTide: "14:35 (2:35 PM)",
    nextLowTide: "21:10 (9:10 PM)",
    tideHeight: 2.1
  },

  fishingZones: [
    {
      id: "PFZ-01",
      name: "Ratnagiri Southwest Thermal Front",
      distance: 18,
      direction: "Southwest",
      chlorophyll: 4.7,
      sst: 27.9,
      confidence: 87,
      fishPotential: "High",
      targetSpecies: ["Pelagic Fishes", "Indian Mackerel", "Sardinella"],
      depthM: 48,
      latlng: [16.85, 73.18]
    },
    {
      id: "PFZ-02",
      name: "Malvan Offshore Upwelling Shelf",
      distance: 32,
      direction: "South",
      chlorophyll: 3.5,
      sst: 28.1,
      confidence: 76,
      fishPotential: "Moderate",
      targetSpecies: ["Kingfish (Surmai)", "Squid", "Seer Fish"],
      depthM: 54,
      latlng: [16.30, 73.22]
    },
    {
      id: "PFZ-03",
      name: "Dabhol Coastal Front",
      distance: 45,
      direction: "Northwest",
      chlorophyll: 2.1,
      sst: 29.0,
      confidence: 58,
      fishPotential: "Low",
      targetSpecies: ["Coastal Pelagics"],
      depthM: 32,
      latlng: [17.50, 73.05]
    }
  ],

  alerts: [
    {
      id: "ALERT-01",
      title: "Isolated Thunderstorm Risk",
      category: "THUNDERSTORM",
      severity: "MODERATE",
      cycloneAlert: "None (🟢 No active cyclone)",
      lightningRisk: "Low (🟡 Low risk)",
      thunderstormRisk: "Possible later today (🟡)",
      description: "Isolated thunderstorms possible late afternoon over offshore coastal waters. No cyclone threat active."
    }
  ],

  geofencing: {
    nearestRestrictedZone: "Marine Protected Area (Malvan Coral Reserve)",
    distance: 12.4,
    status: "Safe",
    coordinates: "16.05° N, 73.46° E",
    vesselStatus: "Outside Restricted Zone"
  },

  routes: {
    recommended: {
      id: "ROUTE-B",
      name: "Southwest Safe Corridor (Route B)",
      distance: 18,
      risk: "Low–Moderate",
      waveHeight: 1.4,
      restrictedZone: "Avoided",
      waypoints: [[16.99, 73.31], [16.90, 73.25], [16.85, 73.18]]
    },
    direct: {
      id: "ROUTE-A",
      name: "Direct Western Corridor (Route A)",
      distance: 16.5,
      risk: "HIGH",
      waveHeight: 2.8,
      restrictedZone: "Near Restricted Area",
      waypoints: [[16.99, 73.31], [16.88, 73.20], [16.85, 73.18]]
    }
  },

  productivityAnalysis: {
    chlorophyllPrevious: 3.4,
    chlorophyllCurrent: 2.8,
    chlorophyllChange: "-18%",
    sstPrevious: 27.6,
    sstCurrent: 28.4,
    sstChange: "+0.8°C",
    factors: [
      "Reduced chlorophyll concentration",
      "SST variation (+0.8°C rise)",
      "Seasonal ocean upwelling shifts"
    ]
  }
};

// State memory for contextual follow-up questions
export let sessionMemory = {
  lastTopic: null, // e.g. 'PFZ-01'
  lastLocation: 'Ratnagiri Coast',
  lastRole: 'fisherman'
};

export function updateSessionMemory(topic, location, role) {
  if (topic) sessionMemory.lastTopic = topic;
  if (location) sessionMemory.lastLocation = location;
  if (role) sessionMemory.lastRole = role;
}
