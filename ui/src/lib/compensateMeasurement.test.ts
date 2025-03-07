import { describe, expect, it } from '@jest/globals';
import { ProcessedThreePointMeasurement } from "../types/Measurement";
import compensateMeasurement from "./compensateMeasurement";

describe("compensateMeasurement", () => {
  it("should accurately compensate the measurement", () => {
    const uncompensatedMeasurement: ProcessedThreePointMeasurement = {
      sensor1: 800,
      sensor2: 800,
      sensor3: 800,
      shutter1: {
        side1: 6000,
        side2: 6000
      },
      shutter2: {
        side1: 6000,
        side2: 6000
      }
    }

    const compensatedMeasurement = compensateMeasurement(uncompensatedMeasurement)
    expect(compensatedMeasurement).toStrictEqual({
      "sensor1": 1175,
      "sensor2": 1175,
      "sensor3": 1175,
      "shutter1": {
        "side1": 6000,
        "side2": 6000,
      },
      "shutter2": {
        "side1": 6000,
        "side2": 6000,
      },
    }
    )
  })
})
