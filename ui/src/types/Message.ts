import { z } from "zod";

export enum Mode {
  THREE_POINT = "three_point",
  SINGLE_POINT = "single_point",
}

export enum MessageType {
  THREE_POINT = "three_point",
  SINGLE_POINT = "single_point",
  METADATA = "metadata",
}

const sensorMeasurementSchema = z.object({
  open: z.number(),
  close: z.number(),
});

export type SensorMeasurement = z.infer<typeof sensorMeasurementSchema>;

const singlePointMessageSchema = z.object({
  type: z.literal("single_point"),
  sensor2: z.number(),
});

export type SinglePointMessage = z.infer<typeof singlePointMessageSchema>;

const threePointMeasurementSchema = z.object({
  sensor1: sensorMeasurementSchema,
  sensor2: sensorMeasurementSchema,
  sensor3: sensorMeasurementSchema,
});

export type ThreePointMeasurement = z.infer<typeof threePointMeasurementSchema>;

const threePointMessageSchema = threePointMeasurementSchema.extend({
  type: z.literal("three_point"),
});

export type ThreePointMessage = z.infer<typeof threePointMessageSchema>;

const metadataMessageSchema = z.object({
  type: z.literal("metadata"),
  mode: z.nativeEnum(Mode),
  version: z.string(),
});

export type MetadataMessage = z.infer<typeof metadataMessageSchema>;

export const messageSchema = z.discriminatedUnion("type", [
  singlePointMessageSchema,
  threePointMessageSchema,
  metadataMessageSchema,
]);

type Message = z.infer<typeof messageSchema>;

export default Message;
