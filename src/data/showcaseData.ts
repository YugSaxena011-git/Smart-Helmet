import { SceneData, SubsystemSpec } from '../types';

export const SCENES: SceneData[] = [
  {
    id: 1,
    title: 'Macro Engineering Assembly',
    subtitle: 'Industrial Technology Laboratory',
    startSec: 0,
    endSec: 7,
    image: '/src/assets/images/scene1_macro_assembly_1793809526802.jpg',
    description:
      'Extreme macro dolly shot across an ESD precision workbench. Gloved technician hands mount miniaturized multi-zone temperature sensors, impact detection modules, microcontrollers, wiring harnesses, solder joints, and high-density battery cell into the reinforced helmet chassis.',
    cameraMovement: 'Slow macro dolly-in with smooth rack focus to sensor contact point',
    focusTarget: 'Precision temperature sensor solder pads & STMicroelectronics core',
    audioCues: [
      'Soft precision mechanical clicks',
      'ESD tool metallic contact',
      'Subtle laboratory laminar flow ambient hum'
    ]
  },
  {
    id: 2,
    title: 'Component Initialization & Diagnostics',
    subtitle: 'Internal Electronic Power-On',
    startSec: 7,
    endSec: 13,
    image: '/src/assets/images/scene2_interior_circuit_1793809527522.jpg',
    description:
      'The internal subsystems power on sequentially. Micro-LED status indicators illuminate across the circuit board. Animated data telemetry pulses through transparent schematics, connecting thermal nodes and impact sensors directly to the central processing unit.',
    cameraMovement: 'Internal technical inspection track across substrate traces',
    focusTarget: 'Pulsing data bus & illuminated dual-state LED diagnostic array',
    audioCues: [
      'Subtle harmonic electronic startup tone',
      'Diagnostic telemetry blips',
      'Low internal circuit carrier hum'
    ]
  },
  {
    id: 3,
    title: 'Worker Integration',
    subtitle: 'Automated Manufacturing Facility',
    startSec: 13,
    endSec: 19,
    image: '/src/assets/images/scene3_worker_factory_1793809529125.jpg',
    description:
      'Seamless transition into a pristine modern automated production facility. A faceless, anonymous industrial technician stands ready, wearing the completed Smart Industrial Safety Helmet, technical workwear, gloves, and high-visibility vest.',
    cameraMovement: 'Subtle vertical slider lift with depth isolation',
    focusTarget: 'Production-ready rugged helmet profile & obscured darkened visor',
    audioCues: [
      'Transition sweep to industrial acoustic space',
      'Low facility ventilation resonance',
      'Distant pneumatic actuation sounds'
    ]
  },
  {
    id: 4,
    title: 'Visor HUD Activation',
    subtitle: 'First-Person Operator Telemetry',
    startSec: 19,
    endSec: 26,
    image: '/src/assets/images/scene4_visor_hud_view_1793809529242.jpg',
    description:
      'The helmet initializes with a soft internal glow. From the operator’s perspective, a clean micro-waveguide visor HUD projects real-time environmental metrics with restrained cyan and white typography over the automated work cell.',
    cameraMovement: 'Operator perspective with subtle natural micro-head sway',
    focusTarget: 'Visor optical plane & live environmental telemetry indicators',
    audioCues: [
      'HUD projection frequency tone',
      'Subtle telemetry ping',
      'Clean respiratory acoustic chamber'
    ]
  },
  {
    id: 5,
    title: 'Safety Alert: Critical Temperature',
    subtitle: 'Thermal Threshold Breach & Evacuation Prompt',
    startSec: 26,
    endSec: 32,
    image: '/src/assets/images/scene4_visor_hud_view_1793809529242.jpg',
    description:
      'Ambient temperature readings surge rapidly past safe limits. The visor HUD instantly shifts into critical emergency mode: pulsing amber and warning red indicators broadcast TEMPERATURE CRITICAL, EVACUATE AREA, and SAFETY ALERT ACTIVE.',
    cameraMovement: 'Slight rapid focus re-lock with urgent HUD state pulsation',
    focusTarget: 'Pulsing emergency HUD warning banners & flashing temperature readouts',
    audioCues: [
      'Controlled rhythmic warning pulse (amber/red alert sound)',
      'Urgent two-tone acoustic beacon',
      'Rapid telemetry escalation chirp'
    ]
  },
  {
    id: 6,
    title: 'Automated Factory Pullback',
    subtitle: 'Wide Cinematic High-Tech Environment',
    startSec: 32,
    endSec: 40,
    image: '/src/assets/images/scene5_factory_wide_1793809530081.jpg',
    description:
      'The camera smoothly pulls back from the worker and visor into a sweeping wide view of the modern smart factory floor. Articulated robotic arms, conveyor tracks, precision machining cells, and inspection stations operate in harmony.',
    cameraMovement: 'Smooth cinematic crane pullback and upward pedestal boom',
    focusTarget: 'Expansive automated industrial ecosystem with continuous telemetry line',
    audioCues: [
      'Full factory acoustic floor reveal',
      'Rhythmic conveyor motor hum',
      'Precision robotic servo whines'
    ]
  },
  {
    id: 7,
    title: 'Stabilized Hero Showcase',
    subtitle: 'Production Design & Architecture Callouts',
    startSec: 40,
    endSec: 45,
    image: '/src/assets/images/scene6_hero_helmet_1793809530431.jpg',
    description:
      'Refined stabilized hero shot of the Smart Industrial Safety Helmet in the foreground against the softly blurred automated factory. Six subtle technical callouts pinpoint the core subsystems that power the platform.',
    cameraMovement: 'Slow stabilized 360-degree micro-orbit with rack focus across callouts',
    focusTarget: 'Sculpted polymer helmet shell, visor waveguide, and sensor housings',
    audioCues: [
      'Resolving harmonic drone',
      'Subtle soft mechanical lock-in click',
      'Gentle high-frequency callout pin chimes'
    ]
  }
];

export const SUBSYSTEMS: SubsystemSpec[] = [
  {
    id: 'temp-sensor',
    name: 'TEMPERATURE SENSORS',
    shortLabel: 'TEMP SENSORS',
    category: 'Environmental Monitoring',
    xPercent: 48,
    yPercent: 17,
    description:
      'Multi-spectral infrared array paired with ambient NTC probes providing instant surface and atmosphere thermal mapping with ±0.1°C accuracy.',
    specs: [
      { label: 'Range', value: '-40°C to +150°C' },
      { label: 'Refresh Rate', value: '20 Hz Real-Time' },
      { label: 'Accuracy', value: '±0.1°C Calibrated' },
      { label: 'Thermal Drift', value: '<0.02%/year' }
    ],
    technicalDetails:
      'Continuous thermal gradient detection detects convective heat spikes, flash-over conditions, and ambient heat-stress risk before bodily exposure.',
    status: 'ONLINE',
    readingValue: '24°C / 27°C'
  },
  {
    id: 'impact-detector',
    name: 'IMPACT DETECTORS',
    shortLabel: 'IMPACT DETECTORS',
    category: 'Structural Integrity',
    xPercent: 68,
    yPercent: 35,
    description:
      'Tri-axial MEMS high-G accelerometer and distributed piezoelectric strain gauges capable of registering dynamic kinetic shock vectors up to 200G.',
    specs: [
      { label: 'Dynamic Range', value: '±200G Tri-Axial' },
      { label: 'Sample Rate', value: '3,200 Hz' },
      { label: 'Trigger Latency', value: '<0.8 ms' },
      { label: 'Standard', value: 'EN 397 & ANSI Z89.1 Type II' }
    ],
    technicalDetails:
      'Instantly differentiates glancing debris deflective impacts from structural concussive trauma, triggering autonomous black-box logging.',
    status: 'ACTIVE',
    readingValue: '0.00G (Nominal)'
  },
  {
    id: 'comm-module',
    name: 'COMMUNICATION MODULE',
    shortLabel: 'COMM MODULE',
    category: 'Telemetry & Mesh',
    xPercent: 64,
    yPercent: 54,
    description:
      'Ultra-wideband (UWB) sub-gigahertz industrial mesh transceiver with AES-256 encrypted relay to facility control centers and adjacent helmets.',
    specs: [
      { label: 'Protocol', value: 'Industrial UWB + 802.15.4 Mesh' },
      { label: 'Range', value: 'Up to 450m Non-Line-of-Sight' },
      { label: 'Encryption', value: 'Hardware AES-256-GCM' },
      { label: 'Positioning', value: 'Sub-15cm Indoor Real-Time' }
    ],
    technicalDetails:
      'Maintains redundant telemetry link even through thick reinforced concrete and metal racking with automated beacon failover.',
    status: 'ONLINE',
    readingValue: 'RSSI: -42 dBm'
  },
  {
    id: 'microcontroller',
    name: 'MICROCONTROLLER',
    shortLabel: 'MICROCONTROLLER',
    category: 'Edge Processing',
    xPercent: 51,
    yPercent: 41,
    description:
      'Dual-core ARM Cortex-M7 real-time computing engine executing on-device edge anomaly detection, sensor fusion, and fail-safe safety logic.',
    specs: [
      { label: 'Core Clock', value: '480 MHz Real-Time' },
      { label: 'Architecture', value: 'ARM Cortex-M7 + M4' },
      { label: 'SRAM Cache', value: '1,024 KB Zero-Wait' },
      { label: 'Operating Temp', value: '-40°C to +105°C' }
    ],
    technicalDetails:
      'Performs localized threshold evaluation within 1.2 milliseconds without dependency on cloud or central network availability.',
    status: 'ONLINE',
    readingValue: 'Load: 14.2%'
  },
  {
    id: 'battery-pack',
    name: 'RECHARGEABLE BATTERY',
    shortLabel: 'RECHARGEABLE BATTERY',
    category: 'Power Management',
    xPercent: 55,
    yPercent: 72,
    description:
      'Solid-electrolyte high-density lithium polymer cell housed in an intrinsically safe explosion-proof aluminum casing with 24-hour shift endurance.',
    specs: [
      { label: 'Capacity', value: '3.7V / 1,900 mAh' },
      { label: 'Shift Life', value: '24 Hours Continuous' },
      { label: 'Fast Charge', value: '80% in 35 Minutes (Qi/Pogo)' },
      { label: 'Chemistry', value: 'Explosion-Proof Li-Polymer' }
    ],
    technicalDetails:
      'Protected by redundant thermal fuses and current limiters certified for ATEX Zone 1 hazardous environments.',
    status: 'READY',
    readingValue: '87% Charged'
  },
  {
    id: 'visor-hud',
    name: 'VISOR HUD',
    shortLabel: 'VISOR HUD',
    category: 'Augmented Display',
    xPercent: 44,
    yPercent: 50,
    description:
      'Diffractive holographic optical wave-guide projecting high-contrast cyan and amber situational overlays across the ballistic polycarbonate visor.',
    specs: [
      { label: 'Luminance', value: '3,000 Nits Sunlight Readable' },
      { label: 'Resolution', value: '1280 x 720 Micro-OLED' },
      { label: 'FOV', value: '38° Diagonal Augmented' },
      { label: 'Transmittance', value: '>88% Optical Clarity' }
    ],
    technicalDetails:
      'High-contrast collimated optics project warnings directly into the worker’s focal plane without causing eye fatigue or peripheral obstruction.',
    status: 'ONLINE',
    readingValue: '3,000 Nits / High Contrast'
  }
];
