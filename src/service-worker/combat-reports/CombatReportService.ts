import { Message, MessageOgameMeta } from '../../shared/messages/Message';
import { MessageType } from '../../shared/messages/MessageType';
import { _throw } from '../../shared/utils/_throw';
import { MessageService } from '../MessageService';
import { CombatReportModule } from './CombatReportModule';
import { broadcastMessage } from '../../shared/communication/broadcastMessage';
import { CombatReportMessage, CombatReportUnknownMessage, NewCombatReportMessage, RequestSingleCombatReportMessage, TrackCombatReportMessage } from '../../shared/messages/tracking/combat-reports';
import { serviceWorkerUuid } from '@/shared/uuid';
import { WillNotBeTrackedMessage } from '@/shared/messages/tracking/misc';
import { _logDebug } from '@/shared/utils/_log';

export class CombatReportService implements MessageService {
    private readonly combatReportModule = new CombatReportModule();

    public async onMessage(message: Message<MessageType, any>): Promise<void> {
        switch (message.type) {
            case MessageType.RequestSingleCombatReport: {
                const { data: id } = message as RequestSingleCombatReportMessage;
                const tryResult = await this.combatReportModule.tryGetSingleReport(message as RequestSingleCombatReportMessage);
                if(!tryResult.success) {
                    const unknownMessage: CombatReportUnknownMessage = {
                        ogameMeta: message.ogameMeta,
                        type: MessageType.CombatReportUnknown,
                        data: id,
                        senderUuid: serviceWorkerUuid,
                    };
                    await broadcastMessage(unknownMessage);
                }
                else {
                    const combatReportMessage: CombatReportMessage = {
                        ogameMeta: message.ogameMeta,
                        type: MessageType.CombatReport,
                        data: tryResult.result,
                        senderUuid: serviceWorkerUuid,
                    };
                    await broadcastMessage(combatReportMessage);
                }
                break;
            }

            case MessageType.TrackCombatReport: {
                const tryResult = await this.combatReportModule.tryTrackCombatReport(message as TrackCombatReportMessage);
                if (!tryResult.success) {
                    _throw('failed to track combat report');
                }

                if(tryResult.result.ignored) {
                    const ignoreMessage: WillNotBeTrackedMessage = {
                        ogameMeta: message.ogameMeta,
                        type: MessageType.WillNotBeTracked,
                        data: tryResult.result.id,
                        senderUuid: serviceWorkerUuid,
                    };
                    await broadcastMessage(ignoreMessage);
                    break;
                }

                // broadcast "new combat report available"
                if (!tryResult.result.isAlreadyTracked) {
                    const newCombatReportMessage: NewCombatReportMessage = {
                        ogameMeta: message.ogameMeta,
                        type: MessageType.NewCombatReport,
                        data: tryResult.result.report,
                        senderUuid: serviceWorkerUuid,
                    };
                    await broadcastMessage(newCombatReportMessage);
                }
                // send data of the specific combat report
                else {
                    const combatReportMessage: CombatReportMessage = {
                        ogameMeta: message.ogameMeta,
                        type: MessageType.CombatReport,
                        data: tryResult.result.report,
                        senderUuid: serviceWorkerUuid,
                    };
                    await broadcastMessage(combatReportMessage);
                }

                break;
            }
        }
    }
}