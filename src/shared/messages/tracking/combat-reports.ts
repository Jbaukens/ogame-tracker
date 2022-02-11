import { CombatReport } from "../../models/v1/combat-reports/CombatReport";
import { Message, NoDataMessage } from "../Message";
import { MessageType } from "../MessageType";
import { OgameCombatReport } from '../../models/v1/ogame/combats/OgameCombatReport';

export interface RawCombatReportData {
    id: number;
    date: number;
    ogameCombatReport: OgameCombatReport;
}

export type TrackCombatReportMessage = Message<MessageType.TrackCombatReport, RawCombatReportData>;
export type CombatReportMessage = Message<MessageType.CombatReport, CombatReport>;
export type NewCombatReportMessage = Message<MessageType.NewCombatReport, CombatReport>;
export type AllCombatReportsMessage = Message<MessageType.AllCombatReports, CombatReport[]>;
export type RequestCombatReportsMessage = NoDataMessage<MessageType.RequestCombatReports>;