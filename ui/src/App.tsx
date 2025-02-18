import { useState } from "react";
import "./App.css";
import Summary from "./components/Summary";
import AddSpeed from "./components/AddSpeed";
import { formatSpeed, sortSpeeds } from "./lib/utils";
import { defaultSpeeds } from "./lib/defaults";
import Connect from "./components/Connect";
import TestShot from "./components/TestShot";
import MeasurementDetail from "./components/MeasurementDetail";
import { useBluetooth } from "./lib/useBluetooth";
import Measurement from "./types/Measurement";
import SensorControls from "./components/SensorControls";
import Settings from "./components/Settings";
import ShutterControls from "./components/ShutterControls";

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

  const selectSpeed = (speed: string) => {
    setSelectedSpeed(speed);
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
    <Settings>
      <header>
        {isTest() ? (
          <TestShot onClick={takeShot} selectedSpeed={selectedSpeed} />
        ) : (
          <Connect onClick={subscribeBluetooth} isConnected={isConnected} />
        )}
        <SensorControls />
        <ShutterControls />
      </header>
      <Summary
        speeds={speeds}
        onRemoveSpeed={removeSpeed}
        selectedSpeed={selectedSpeed}
        onSelectSpeed={selectSpeed}
        measurements={measurements}
      />
      <AddSpeed onAddSpeed={addSpeed} />
      <MeasurementDetail
        measurements={measurements[selectedSpeed]}
        selectedSpeed={selectedSpeed}
      />
    </Settings>
  );
}

export default App;
