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
  const fractionSeconds = Math.round(1 / seconds);
  return seconds >= 1 ? seconds.toFixed(2) : `1/${fractionSeconds}`;
};

export const formatSpeed = (speed: string): string =>
  speed
    .split("/")
    .map((s) => s.trim())
    .join("/");

export const sortSpeeds = (a: string, b: string) =>
  convertSpeedToFloat(b) - convertSpeedToFloat(a);

export const displaySpeed = (speed?: number): string => {
  if (!speed) {
    return "-";
  }
  return `${(speed / 1000).toFixed(2)} ms (${convertMicrosToFraction(
    speed
  )} s)`;
};
