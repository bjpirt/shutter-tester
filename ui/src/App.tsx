import { useState } from "react";
import "./App.css";
import AddSpeed from "./components/AddSpeed";
import Connect from "./components/Connect";
import SensorControls from "./components/SensorControls";
import SettingsContext from "./components/SettingsContext";
import ShutterControls from "./components/ShutterControls";
import Measurements from "./components/Measurements";
import TestShot from "./components/TestShot";
import { defaultSpeeds } from "./lib/defaults";
import { useBluetooth } from "./lib/useBluetooth";
import { formatSpeed, sortSpeeds } from "./lib/utils";
import Measurement from "./types/Measurement";

const isTest = (): boolean =>
  new URLSearchParams(window.location.search).get("test") === "true";

function App() {
  const [speeds, setSpeeds] = useState(defaultSpeeds);
  const [selectedSpeed, setSelectedSpeed] = useState<string>(speeds[0]);
  const [measurements, setMeasurements] = useState<
    Record<string, Measurement[]>
  >({});

  const removeSpeed = (speed: string) => {
    setSpeeds(speeds.filter((existingSpeed) => existingSpeed !== speed));
  };

  const addSpeed = (speed: string) => {
    setSpeeds([...speeds, formatSpeed(speed)].sort(sortSpeeds));
  };

  const reset = () => {
    setMeasurements({});
  };

  const selectSpeed = (speed: string) => {
    setSelectedSpeed(speed);
  };

  const removeMeasurement = (speed: string, measurement: Measurement) => {
    setMeasurements({
      ...measurements,
      [speed]: measurements[speed].filter((m) => m != measurement),
    });
  };

  const takeShot = (measurement: Measurement) => {
    console.log(measurement);
    const newMeasurements = structuredClone(measurements);
    if (!Array.isArray(newMeasurements[selectedSpeed])) {
      newMeasurements[selectedSpeed] = [];
    }
    newMeasurements[selectedSpeed].push(measurement);
    setMeasurements(newMeasurements);
  };

  const { subscribe, isConnected } = useBluetooth(takeShot);

  const subscribeBluetooth = () => {
    subscribe();
  };

  return (
    <SettingsContext>
      <header>
        <div className="connect">
          {isTest() ? (
            <TestShot onClick={takeShot} selectedSpeed={selectedSpeed} />
          ) : (
            <Connect onClick={subscribeBluetooth} isConnected={isConnected} />
          )}
        </div>
        <h1>
          <span className="icon">📷</span> Shutter Tester
        </h1>
      </header>
      <div id="controls">
        <SensorControls />
        <ShutterControls />
        <AddSpeed onAddSpeed={addSpeed} />
        <button onClick={reset}>Reset data</button>
      </div>
      <Measurements
        speeds={speeds}
        onRemoveSpeed={removeSpeed}
        selectedSpeed={selectedSpeed}
        onSelectSpeed={selectSpeed}
        measurements={measurements}
        onRemoveMeasurement={removeMeasurement}
      />
    </SettingsContext>
  );
}

export default App;
