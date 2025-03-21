import { z } from "zod";

export const sensorMeasurementSchema = z.object({
  open: z.number(),
  close: z.number(),
});

export type SensorMeasurement = z.infer<typeof sensorMeasurementSchema>;


export const threePointMeasurementSchema = z.object({
  sensor1: sensorMeasurementSchema,
  sensor2: sensorMeasurementSchema,
  sensor3: sensorMeasurementSchema,
});

export type ThreePointMeasurement = z.infer<typeof threePointMeasurementSchema>;

export type ShutterMeasurement = {side1: number, side2: number}

export type ProcessedThreePointMeasurement = {
  sensor1: number
  sensor2: number
  sensor3: number
  shutter1: ShutterMeasurement
  shutter2: ShutterMeasurement
}
