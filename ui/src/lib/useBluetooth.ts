import * as React from "react";
import Message, { messageSchema, Mode } from "../types/Message";

var deviceName = "ShutterTester";
var bleServiceId = "42de79f1-7248-4c9b-9279-96509b8a9f5c";
var sensorCharacteristicId = "42de79f1-7248-4c9b-9279-96509b8a9f5d";
var modeCharacteristicId = "42de79f1-7248-4c9b-9279-96509b8a9f5e";

export interface Bluetooth {
  isConnected: boolean;
  subscribe: () => void;
  setDeviceMode: (mode: Mode) => Promise<void>;
}

export const useBluetooth = (eventHandler: (x: Message) => void): Bluetooth => {
  const [isConnected, setIsConnected] = React.useState(false);
  const [modeCharacteristic, setModeCharacteristic] =
    React.useState<BluetoothRemoteGATTCharacteristic | null>(null);
  const eventHandlerRef = React.useRef<(x: Message) => void>();

  React.useEffect(() => {
    eventHandlerRef.current = eventHandler;
  });

  const subscribe = async () => {
    try {
      const device: BluetoothDevice | Error = await navigator.bluetooth
        .requestDevice({
          filters: [{ name: deviceName }, { services: [bleServiceId] }],
          optionalServices: [bleServiceId],
        })
        .catch((e) => e);

      if (device instanceof Error) {
        throw device;
      }

      device.addEventListener("gattserverdisconnected", () =>
        setIsConnected(false)
      );

      const server = await device.gatt?.connect().catch((e: Error) => e);

      if (server instanceof Error) {
        throw server;
      }

      const service = await server?.getPrimaryService(bleServiceId);

      const characteristic = await service?.getCharacteristic(
        sensorCharacteristicId
      );

      const modeChar = await service?.getCharacteristic(modeCharacteristicId);
      if (modeChar) {
        setModeCharacteristic(modeChar);
      }

      characteristic?.addEventListener(
        "characteristicvaluechanged",
        (event: any) => {
          const newValueReceived = new TextDecoder().decode(event.target.value);
          const data = messageSchema.parse(JSON.parse(newValueReceived));
          eventHandlerRef.current && eventHandlerRef.current(data);
        }
      );

      await characteristic?.startNotifications().catch((e: Error) => e);

      setIsConnected(true);
    } catch (e) {
      console.log(e);
    }
  };

  const setDeviceMode = async (mode: Mode) => {
    const modeValue = [null, Mode.SINGLE_POINT, Mode.THREE_POINT].indexOf(mode);
    if (modeCharacteristic) {
      await modeCharacteristic.writeValue(Uint8Array.of(modeValue));
    }
  };

  return { setDeviceMode, subscribe, isConnected };
};
