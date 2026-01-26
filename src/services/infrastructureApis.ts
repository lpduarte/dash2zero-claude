/**
 * Infrastructure APIs Service
 *
 * Provides integration with external APIs for municipal infrastructure data.
 * These APIs are used to pre-populate infrastructure data when a new municipality is created.
 */

// Types
export interface ChargingStation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  operator: string;
  connectors: number;
  powerKW: number;
  isOperational: boolean;
  lastUpdated: Date;
}

export interface TransportStop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  routes: string[];
  municipality: string;
}

export interface CyclingPath {
  id: string;
  name: string;
  lengthKm: number;
  municipality: string;
  type: 'dedicated' | 'shared' | 'mixed';
}

export interface AirQualityStation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  municipality: string;
  pollutants: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  source: string;
  timestamp: Date;
  error?: string;
}

// OpenChargeMap API - EV Charging Stations
// Requires API key from https://openchargemap.org/site/develop/api (free registration)
const OPEN_CHARGE_MAP_API = 'https://api.openchargemap.io/v3/poi/';
const OPEN_CHARGE_MAP_KEY = import.meta.env.VITE_OPEN_CHARGE_MAP_API_KEY || '';

export async function fetchChargingStations(municipality: string): Promise<ApiResponse<ChargingStation>> {
  try {
    if (!OPEN_CHARGE_MAP_KEY) {
      return {
        success: false,
        data: [],
        total: 0,
        source: 'Open Charge Map',
        timestamp: new Date(),
        error: 'API key não configurada. Registe-se em openchargemap.org para obter uma chave gratuita.',
      };
    }

    // OpenChargeMap uses country codes and bounding boxes
    const response = await fetch(
      `${OPEN_CHARGE_MAP_API}?countrycode=PT&maxresults=500&compact=true&verbose=false&key=${OPEN_CHARGE_MAP_KEY}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    // Filter by municipality (AddressInfo.Town or AddressInfo.StateOrProvince)
    const municipalityLower = municipality.toLowerCase();
    const filtered = data.filter((station: any) => {
      const town = station.AddressInfo?.Town?.toLowerCase() || '';
      const state = station.AddressInfo?.StateOrProvince?.toLowerCase() || '';
      const address = station.AddressInfo?.AddressLine1?.toLowerCase() || '';
      return town.includes(municipalityLower) ||
             state.includes(municipalityLower) ||
             address.includes(municipalityLower);
    });

    const stations: ChargingStation[] = filtered.map((station: any) => ({
      id: station.ID?.toString() || '',
      name: station.AddressInfo?.Title || 'Posto sem nome',
      address: station.AddressInfo?.AddressLine1 || '',
      latitude: station.AddressInfo?.Latitude || 0,
      longitude: station.AddressInfo?.Longitude || 0,
      operator: station.OperatorInfo?.Title || 'Desconhecido',
      connectors: station.NumberOfPoints || 1,
      powerKW: station.Connections?.[0]?.PowerKW || 0,
      isOperational: station.StatusType?.IsOperational ?? true,
      lastUpdated: new Date(station.DateLastStatusUpdate || Date.now()),
    }));

    return {
      success: true,
      data: stations,
      total: stations.length,
      source: 'Open Charge Map',
      timestamp: new Date(),
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      total: 0,
      source: 'Open Charge Map',
      timestamp: new Date(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Carris Metropolitana API - Transport Stops (AML only)
// Public API, no key required
const CARRIS_API = 'https://api.carrismetropolitana.pt/';

export async function fetchTransportStops(municipality: string): Promise<ApiResponse<TransportStop>> {
  try {
    // Carris Metropolitana covers only the Lisbon Metropolitan Area
    const amlMunicipalities = [
      'alcochete', 'almada', 'amadora', 'barreiro', 'cascais', 'lisboa',
      'loures', 'mafra', 'moita', 'montijo', 'odivelas', 'oeiras',
      'palmela', 'seixal', 'sesimbra', 'setúbal', 'sintra', 'vila franca de xira'
    ];

    const municipalityLower = municipality.toLowerCase();
    const isInAML = amlMunicipalities.some(m =>
      m.includes(municipalityLower) || municipalityLower.includes(m)
    );

    if (!isInAML) {
      return {
        success: true,
        data: [],
        total: 0,
        source: 'Carris Metropolitana',
        timestamp: new Date(),
        error: 'Município fora da Área Metropolitana de Lisboa',
      };
    }

    const response = await fetch(`${CARRIS_API}stops`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    // Filter by municipality_name field
    const filtered = data.filter((stop: any) => {
      const stopMunicipality = stop.municipality_name?.toLowerCase() || '';
      return stopMunicipality.includes(municipalityLower) ||
             municipalityLower.includes(stopMunicipality);
    });

    const stops: TransportStop[] = filtered.map((stop: any) => ({
      id: stop.id || stop.stop_id || '',
      name: stop.name || stop.short_name || 'Paragem sem nome',
      latitude: parseFloat(stop.lat) || 0,
      longitude: parseFloat(stop.lon) || 0,
      routes: stop.routes || [],
      municipality: stop.municipality_name || municipality,
    }));

    return {
      success: true,
      data: stops,
      total: stops.length,
      source: 'Carris Metropolitana',
      timestamp: new Date(),
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      total: 0,
      source: 'Carris Metropolitana',
      timestamp: new Date(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Ciclovias.pt - Cycling Paths (GeoJSON)
const CICLOVIAS_API = 'https://ciclovias.pt/';

export async function fetchCyclingPaths(municipality: string): Promise<ApiResponse<CyclingPath>> {
  // Note: Ciclovias.pt provides GeoJSON data but may require scraping or specific endpoints
  // This is a placeholder implementation that would need to be adapted based on actual API availability

  return {
    success: true,
    data: [],
    total: 0,
    source: 'Ciclovias.pt',
    timestamp: new Date(),
    error: 'API integration pending - requires GeoJSON parsing',
  };
}

// QualAr - Air Quality Stations (WFS service)
export async function fetchAirQualityStations(municipality: string): Promise<ApiResponse<AirQualityStation>> {
  // QualAr (APA) uses WFS/WMS services which require specific handling
  // This is a placeholder that could be expanded with WFS client library

  return {
    success: true,
    data: [],
    total: 0,
    source: 'QualAr (APA)',
    timestamp: new Date(),
    error: 'API integration pending - requires WFS client',
  };
}

// Aggregate function to fetch all available infrastructure data
export interface InfrastructureSyncResult {
  municipality: string;
  timestamp: Date;
  chargingStations: ApiResponse<ChargingStation>;
  transportStops: ApiResponse<TransportStop>;
  cyclingPaths: ApiResponse<CyclingPath>;
  airQualityStations: ApiResponse<AirQualityStation>;
}

export async function syncInfrastructureData(municipality: string): Promise<InfrastructureSyncResult> {
  const [chargingStations, transportStops, cyclingPaths, airQualityStations] = await Promise.all([
    fetchChargingStations(municipality),
    fetchTransportStops(municipality),
    fetchCyclingPaths(municipality),
    fetchAirQualityStations(municipality),
  ]);

  return {
    municipality,
    timestamp: new Date(),
    chargingStations,
    transportStops,
    cyclingPaths,
    airQualityStations,
  };
}

// Summary for display
export interface InfrastructureSummary {
  chargingStations: { count: number; available: boolean; source: string };
  transportStops: { count: number; available: boolean; source: string };
  cyclingPaths: { count: number; available: boolean; source: string };
  airQualityStations: { count: number; available: boolean; source: string };
}

export function createSummary(result: InfrastructureSyncResult): InfrastructureSummary {
  return {
    chargingStations: {
      count: result.chargingStations.total,
      available: result.chargingStations.success && !result.chargingStations.error,
      source: result.chargingStations.source,
    },
    transportStops: {
      count: result.transportStops.total,
      available: result.transportStops.success && !result.transportStops.error,
      source: result.transportStops.source,
    },
    cyclingPaths: {
      count: result.cyclingPaths.total,
      available: result.cyclingPaths.success && !result.cyclingPaths.error,
      source: result.cyclingPaths.source,
    },
    airQualityStations: {
      count: result.airQualityStations.total,
      available: result.airQualityStations.success && !result.airQualityStations.error,
      source: result.airQualityStations.source,
    },
  };
}
