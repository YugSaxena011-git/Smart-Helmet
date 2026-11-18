export interface SceneData {
  id: number;
  title: string;
  subtitle: string;
  startSec: number;
  endSec: number;
  image: string;
  description: string;
  cameraMovement: string;
  focusTarget: string;
  audioCues: string[];
}

export interface SubsystemSpec {
  id: string;
  name: string;
  shortLabel: string;
  category: string;
  xPercent: number; // For callout coordinates in hero shot
  yPercent: number;
  description: string;
  specs: { label: string; value: string }[];
  technicalDetails: string;
  status: 'ONLINE' | 'ACTIVE' | 'CALIBRATED' | 'READY';
  readingValue?: string;
}

export interface TelemetryState {
  ambientTemp: number; // in °C
  helmetTemp: number; // in °C
  batteryLevel: number; // 87%
  sensorStatus: 'ONLINE' | 'WARNING' | 'CRITICAL';
  workerStatus: 'SAFE' | 'CAUTION' | 'EVACUATE AREA';
  alertActive: boolean;
  alertHeadline: string;
  subAlert: string;
}
