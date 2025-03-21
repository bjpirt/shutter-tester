import { ProcessedThreePointMeasurement, ThreePointMeasurement } from "../types/Measurement";
import compensateMeasurement from "./compensateMeasurement";

const processThreePointMeasurement = (measurement: ThreePointMeasurement, compensate: boolean = false, width: number = 32): ProcessedThreePointMeasurement => {
  const output =  {
    sensor1: measurement.sensor1.close - measurement.sensor1.open,
    sensor2: measurement.sensor2.close - measurement.sensor2.open,
    sensor3: measurement.sensor3.close - measurement.sensor3.open,
    shutter1: { 
      side1: Math.abs(measurement.sensor2.open - measurement.sensor1.open), 
      side2: Math.abs(measurement.sensor3.open - measurement.sensor2.open) 
    },
    shutter2: { 
      side1: Math.abs(measurement.sensor2.close - measurement.sensor1.close), 
      side2: Math.abs(measurement.sensor3.close - measurement.sensor2.close) 
    }
  }

  return compensate ? compensateMeasurement(output, width) : output
}

export default processThreePointMeasurement
