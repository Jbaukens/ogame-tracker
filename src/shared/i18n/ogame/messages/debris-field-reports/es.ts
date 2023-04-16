import { DebrisFieldReportMessages } from "./types";

export const es: DebrisFieldReportMessages = {
    regex: [
        /Recolectas (?<metal>.+) de metal y (?<crystal>.+) de cristal/i,
        /Recolectas (?<metal>.+) de metal y (?<crystal>.+) de cristal, así como (?<deuterium>.+) de deuterio/i,
    ],
};