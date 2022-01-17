import { LanguageKey } from "../../LanguageKey";
import { de } from './de';
import { en } from './en';
import { dk } from './dk';
import { cz } from './cz';
import { hr } from './hr';
import { PremiumTranslations } from "./types";

const translations: Record<LanguageKey, PremiumTranslations> = {
    de,
    en,
    dk,
    cz,
    hr,
};
export default translations;