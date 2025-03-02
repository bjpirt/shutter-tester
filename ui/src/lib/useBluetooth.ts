import * as React from "react";
import Measurement from "../types/Measurement";

var deviceName = "ShutterTester";
var bleService = "42de79f1-7248-4c9b-9279-96509b8a9f5c";
var sensorCharacteristic = "42de79f1-7248-4c9b-9279-96509b8a9f5d";

export interface Bluetooth {
  isConnected: boolean;
  subscribe: () => void;
}

export const useBluetooth = (
  eventHandler: (x: Measurement) => void
): Bluetooth => {
  const [isConnected, setIsConnected] = React.useState(false);
  const eventHandlerRef = React.useRef<(x: Measurement) => void>();

  React.useEffect(() => {
    eventHandlerRef.current = eventHandler;
  });

  const subscribe = async () => {
    try {
      // setCallback(callback);
      const device = await navigator.bluetooth
        .requestDevice({
          filters: [{ name: deviceName }, { services: [bleService] }],
          optionalServices: [bleService],
        })
        .catch((e) => e);
      const server = await device.gatt?.connect().catch((e: Error) => e);

      const service = await server?.getPrimaryService(bleService);

      const characteristic = await service?.getCharacteristic(
        sensorCharacteristic
      );

      characteristic?.addEventListener(
        "characteristicvaluechanged",
        (event: any) => {
          const newValueReceived = new TextDecoder().decode(event.target.value);
          eventHandlerRef.current &&
            eventHandlerRef.current(
              JSON.parse(newValueReceived) as Measurement
            );
        }
      );

      await characteristic?.startNotifications().catch((e: Error) => e);

      setIsConnected(true);
    } catch (e) {
      console.log(e);
    }
  };

  return { subscribe, isConnected };
};
