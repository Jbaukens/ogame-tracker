import LanguageKey from '@/i18n/languageKey';
import Resource from '@/models/Resource';
import de from './de';
import en from './en';
import dk from './dk';
import cz from './cz';
import hr from './hr';
import { I18nFullMessageMap } from '@/i18n/types';

export interface I18nOgameResources {
    [Resource.metal]: string;
    [Resource.crystal]: string;
    [Resource.deuterium]: string;
}

const messages: I18nFullMessageMap<I18nOgameResources> = {
    [LanguageKey.de]: de,
    [LanguageKey.en]: en,
    [LanguageKey.dk]: dk,
    [LanguageKey.cz]: cz,
    [LanguageKey.hr]: hr,
};
export default messages;