import { SensorSettings } from "../components/SettingsContext";

export const convertSpeedToFloat = (speed: string): number => {
  const splitSpeed = speed.split("/").map((s) => s.trim());
  if (splitSpeed.length === 1) {
    return Number(splitSpeed[0]);
  } else {
    return Number(splitSpeed[0]) / Number(splitSpeed[1]);
  }
};

export const convertMicrosToFraction = (microseconds: number): string => {
  const seconds = microseconds / 1000000;
  const fractionSeconds = (1 / seconds).toFixed(1);
  return seconds >= 1 ? seconds.toFixed(2) : `1/${fractionSeconds}`;
};

export const formatSpeed = (speed: string): string =>
  speed
    .split("/")
    .map((s) => s.trim())
    .join("/");

export const sortSpeeds = (a: string, b: string) =>
  convertSpeedToFloat(b) - convertSpeedToFloat(a);

export const evDifference = (speed1: number, speed2: number): number =>
  Math.log2(speed1) - Math.log2(speed2);

export const formatEv = (ev: number): string =>
  `${ev >= 0 ? "+" : "-"}${Math.abs(ev).toFixed(2)}EV`;

export const displaySpeed = (
  settings: SensorSettings,
  speedUs?: number,
  referenceUs?: number
): string => {
  if (!speedUs || !referenceUs) {
    return "-";
  }
  const evDiff = evDifference(speedUs, referenceUs);

  const output: string[] = [];

  if (settings.milliseconds) {
    output.push(`${(speedUs / 1000).toFixed(2)}ms`);
  }
  if (settings.seconds) {
    output.push(`${convertMicrosToFraction(speedUs)}s`);
  }
  if (settings.exposure) {
    output.push(`${formatEv(evDiff)}`);
  }

  return output.join(" ");
};

export const displayInterval = (t1?: number, t2?: number): string => {
  if (t1 === undefined || t2 === undefined) {
    return "-";
  }
  return `${(Math.abs(t2 - t1) / 1000).toFixed(2)}ms`;
};

export const microsToMillis = (input?: number, units?: string): string =>
  input ? `${(input / 1000).toFixed(2)}${units ?? ""}` : "-";
