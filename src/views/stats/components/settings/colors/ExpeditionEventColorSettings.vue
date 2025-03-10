<template>
    <color-settings-table
        :header="$i18n.$t.extension.settings.colors.expeditionEvents"
        :labels="labels"
        :keys="keys"
        :value="colors"
        @input="updateColors($event)"
        @reset="resetColors()"
    />
</template>

<script lang="ts">
    import { LanguageKey } from '@/shared/i18n/LanguageKey';
    import { ExpeditionEventType } from '@/shared/models/expeditions/ExpeditionEventType';
    import { getDefaultSettings } from '@/shared/models/settings/getDefaultSettings';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import ColorSettingsTable from './ColorSettingsTable.vue';

    @Component({
        components: {
            ColorSettingsTable,
        },
    })
    export default class ExpeditionEventColorSettings extends Vue {

        private get labels(): Record<ExpeditionEventType, string> {
            return this.$i18n.$t.extension.expeditions.expeditionEvents;
        }

        private readonly keys: ExpeditionEventType[] = [
            ExpeditionEventType.nothing,
            ExpeditionEventType.resources,
            ExpeditionEventType.fleet,
            ExpeditionEventType.delay,
            ExpeditionEventType.early,
            ExpeditionEventType.darkMatter,
            // legacy: ExpeditionEventType.pirates,
            // legacy: ExpeditionEventType.aliens,
            ExpeditionEventType.combat,
            ExpeditionEventType.item,
            ExpeditionEventType.trader,
            ExpeditionEventType.lostFleet,
        ];

        private get colors() {
            return SettingsDataModule.settings.colors.expeditions.events;
        }

        private updateColors(value: Record<ExpeditionEventType, string>) {
            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                colors: {
                    ...SettingsDataModule.settings.colors,
                    expeditions: {
                        ...SettingsDataModule.settings.colors.expeditions,
                        events: value,
                    },
                },
            });
        }

        private resetColors() {
            const defaultColors = getDefaultSettings(LanguageKey.de).colors.expeditions.events;
            this.updateColors(defaultColors);
        }
    }
</script>