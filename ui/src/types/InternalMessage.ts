import { z } from "zod";
import { singlePointMeasurementSchema, threePointMeasurementSchema } from "./Measurement";

export enum InternalMessageType {
  ThreePointMeasurement = "ThreePointMeasurement",
  SinglePointMeasurement = "SinglePointMeasurement",
  Reset = "Reset",
  SelectSpeed = "SelectSpeed"
}

const threePointInternalMessageSchema = z.object({
  type: z.literal(InternalMessageType.ThreePointMeasurement),
  data: threePointMeasurementSchema
})

export type ThreePointInternalMessage = z.infer<typeof threePointInternalMessageSchema>

const singlePointInternalMessageSchema = z.object({
  type: z.literal(InternalMessageType.SinglePointMeasurement),
  data: singlePointMeasurementSchema
})

export type SinglePointInternalMessage = z.infer<typeof singlePointInternalMessageSchema>

const resetInternalMessageSchema = z.object({
  type: z.literal(InternalMessageType.Reset)
})

export type ResetInternalMessage = z.infer<typeof resetInternalMessageSchema>

const selectSpeedInternalMessageSchema = z.object({
  type: z.literal(InternalMessageType.SelectSpeed),
  data: z.string()
})

export type SelectSpeedInternalMessage = z.infer<typeof selectSpeedInternalMessageSchema>

const internalMessageSchema = z.discriminatedUnion(
  "type",
  [
    threePointInternalMessageSchema,
    singlePointInternalMessageSchema,
    resetInternalMessageSchema,
    selectSpeedInternalMessageSchema
  ]
)

export type InternalMessage = z.infer<typeof internalMessageSchema>
