import type { Responsive } from "../props";

function mapResponsiveProp<Input extends string, Output>(propValue: Responsive<Input> | undefined, mapValue: (value: Input) => Output): Responsive<Output> | undefined {
  if (propValue === undefined) return undefined;
  if (typeof propValue === "string") {
    return mapValue(propValue);
  }
  return Object.fromEntries(Object.entries(propValue).map(([key, value]) => [key, mapValue(value)]));
}

export { mapResponsiveProp };
