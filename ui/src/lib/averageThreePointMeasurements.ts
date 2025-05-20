import { ProcessedThreePointMeasurement, ThreePointMeasurement } from "../types/Measurement";
import processThreePointMeasurement from "./processThreePointMeasurement";

const average = (input: number[]): number =>
  input.reduce((sum, currentValue) => sum + currentValue, 0) / input.length;

const averageThreePointMeasurements = (measurements: ThreePointMeasurement[], compensate: boolean = false, sensorSeparation: number = 20): ProcessedThreePointMeasurement | undefined => {
  if(measurements.length === 0){
    return undefined
  }
  
  const processedMeasurements = measurements.map(m => processThreePointMeasurement(m, compensate, sensorSeparation))

  return {
    sensor1: average(processedMeasurements.map(m => m.sensor1)),
    sensor2: average(processedMeasurements.map(m => m.sensor2)),
    sensor3: average(processedMeasurements.map(m => m.sensor3)),
    shutter1: {side1: average(processedMeasurements.map(m => m.shutter1.side1)), side2: average(processedMeasurements.map(m => m.shutter1.side2))},
    shutter2: {side1: average(processedMeasurements.map(m => m.shutter2.side1)), side2: average(processedMeasurements.map(m => m.shutter2.side2))}
  }
}

export default averageThreePointMeasurements
