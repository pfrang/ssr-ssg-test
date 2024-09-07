export interface YrData  {
  type: string;
  geometry: Geometry;
  properties: Properties;
}


export interface Test {
  type: string;
  geometry: Geometry;
  properties: Properties;
}

export interface Geometry {
  type: string;
  coordinates: number[];
}

export interface Properties {
  meta: Meta;
  timeseries: Timesery[];
}

export interface Meta {
  updated_at: Date;
  units: Units;
}

export interface Units {
  air_pressure_at_sea_level: string;
  air_temperature: string;
  cloud_area_fraction: string;
  precipitation_amount: string;
  relative_humidity: string;
  wind_from_direction: string;
  wind_speed: string;
}

export interface Timesery {
  time: Date;
  data: Data;
}

export interface Data {
  instant: Instant;
  next_12_hours?: Next12_Hours;
  next_1_hours?: NextHours;
  next_6_hours?: NextHours;
}

export interface Instant {
  details: InstantDetails;
}

export interface InstantDetails {
  air_pressure_at_sea_level: number;
  air_temperature: number;
  cloud_area_fraction: number;
  relative_humidity: number;
  wind_from_direction: number;
  wind_speed: number;
}

export interface Next12_Hours {
  summary: Summary;
  details: Next12_HoursDetails;
}

export interface Next12_HoursDetails {
}

export interface Summary {
  symbol_code: SymbolCode;
}

export enum SymbolCode {
  ClearskyDay = "clearsky_day",
  ClearskyNight = "clearsky_night",
  Cloudy = "cloudy",
  FairDay = "fair_day",
  FairNight = "fair_night",
  Heavyrain = "heavyrain",
  Lightrain = "lightrain",
  LightrainshowersDay = "lightrainshowers_day",
  LightrainshowersNight = "lightrainshowers_night",
  PartlycloudyDay = "partlycloudy_day",
  PartlycloudyNight = "partlycloudy_night",
  Rain = "rain",
  RainshowersDay = "rainshowers_day",
  RainshowersNight = "rainshowers_night",
}

export interface NextHours {
  summary: Summary;
  details: Next1_HoursDetails;
}

export interface Next1_HoursDetails {
  precipitation_amount: number;
}
