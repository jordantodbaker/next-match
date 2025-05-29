import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSunday() {
  var d = new Date(); // duplicate start date
  d.setDate(d.getDate() - d.getDay()); // move to last sunday
  //d.setDate(d.getDate() - 7);

  return d;
}
