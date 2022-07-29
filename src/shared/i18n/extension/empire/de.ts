import { EmpireTranslations } from "./type";

export const de: EmpireTranslations = {
    header: 'Imperium',
    planet: 'Planet',
    production: {
        header: 'Produktion',
        subHeaders: {
            resourceProduction: 'Rohstoffproduktion',
            mineOverview: 'Minenübersicht',
        },
        averagePerHour: '⌀ pro Stunde',
        totalPerHour: 'gesamt pro Stunde',
        totalPerDay: 'gesamt pro Tag',
        totalPerWeek: 'gesamt pro Woche',
        activeProductionSettings: 'aktive Produktionseinstellungen',
        messageProduction100: 'Die angezeigten Werte beziehen sich auf einen Produktionsfaktor von 100% und berücksichtigen einen Energiemangel nicht.',

        mines: {
            crawlersAvailable: 'verfügbar',
        },
        items: 'Aktive Items',
        breakdown: {
            basicIncome: 'Grundproduktion',
            mineProduction: 'Minenproduktion',
            consumption: 'Verbrauch',
            lifeformBuildings: 'Lebensform-Gebäude',
            crawlers: 'Crawler',
            plasmaTechnology: 'Plasmatechnik',
            items: 'Items',
            geologist: 'Geologe',
            commandStaff: 'Kommandostab',
            playerClass: 'Spielerklasse',
            allianceClass: 'Allianzklasse',
            lifeformTechnologies: 'Lebensform-Technologien',
        },
    },
    amortization: {
        header: 'Amortisation',

        table: {
            cost: 'Kosten',
            costMsu: 'Kosten (MSE)',
            productionPlus: 'Produktionsplus',
            productionPlusMsu: 'Produktionsplus (MSE)',
            amortizationTime: 'Amortisationszeit',
        },

        settings: {
            header: 'Einstellungen',
            applyAndClose: 'Einstellungen anwenden und schließen',

            playerSettings: {
                header: 'Spielerweite Einstellungen',
                officers: 'Offiziere',
                playerClass: 'Spielerklasse',
                allianceClass: 'Allianzklasse',
                currentLevelPlasmatech: 'aktuelle Stufe der Plasmatechnik',
                currentLevelAstrophysics: 'aktuelle Stufe der Astrophysik',
            },
            astrophysicsSettings: {
                header: 'Einstellungen zu Astrophysik',
                showAstrophysics: 'Astrophysik + neue Kolonien in Ergebnis anzeigen',
                newColony: 'neue Kolonie',
            },
            plasmatechSettings: {
                header: 'Einstellungen zu Plasmatechnik',
                showPlasmatech: 'Plasmatechnik in Ergebnis anzeigen',
            },
            planetSettings: {
                header: 'Einstellungen der Planeten',

                showInResult: 'in Ergebnis anzeigen',
                position: 'Position',
                maxTemperature: 'Max. Temperatur',
                activeItems: 'Aktive Items',
                crawlers: {
                    title: 'Crawler',
                    overload: '150% Überladung',
                    fixCount: 'Feste Anzahl',
                    maxCount: 'Max. Anzahl',
                },
                mines: 'Aktuelle Minenstufen',
            },
        },
    },
};