<template>
    <div class="chart-container">
        <stats-chart :firstDay="firstDay" :itemsPerDay="exposPerDay" :datasets="datasets" stacked show-average>
            <template #tooltip-footer="{ datasets }">
                <template v-if="getVisibleDatasets(datasets).length < datasets.length">
                    <div class="footer-item">
                        <div class="number" v-text="$i18n.$n(getSum(getVisibleDatasets(datasets)))" />
                        <div v-text="$i18n.$t.extension.expeditions.finds" />
                    </div>
                    <hr />
                </template>

                <div class="footer-item">
                    <div class="number" v-text="$i18n.$n(getSum(datasets))" />
                    <div v-text="`${$i18n.$t.extension.expeditions.finds} (${$i18n.$t.extension.common.total})`" />
                </div>
            </template>
        </stats-chart>

        <floating-menu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <expedition-event-size-color-settings />
        </floating-menu>
    </div>
</template>

<script lang="ts">
    import { PropType } from 'vue';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import StatsChart, { StatsChartDataset } from '@stats/components/stats/StatsChart.vue';
    import { ExpeditionEventSizes } from '@/shared/models/expeditions/ExpeditionEventSize';
    import { ScollableChartFooterDataset } from '@/views/stats/components/common/scrollable-chart/ScrollableChart.vue';
    import { DailyExpeditionResult, ExpeditionDataModule } from '@/views/stats/data/ExpeditionDataModule';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import ExpeditionEventSizeColorSettings from '@stats/components/settings/colors/ExpeditionEventSizeColorSettings.vue';
    import { ResourceType, ResourceTypes } from '@/shared/models/ogame/resources/ResourceType';

    @Component({
        components: {
            StatsChart,
            ExpeditionEventSizeColorSettings,
        },
    })
    export default class Charts extends Vue {

        @Prop({ required: true, type: String as PropType<ResourceType>, validator: (value: ResourceType) => ResourceTypes.includes(value) })
        private resource!: ResourceType;

        private showSettings = false;

        private get colors() {
            return SettingsDataModule.settings.colors.expeditions.sizes;
        }

        private get firstDay() {
            return ExpeditionDataModule.firstDay;
        }

        private get exposPerDay() {
            return ExpeditionDataModule.dailyResults;
        }

        private get datasets(): StatsChartDataset<DailyExpeditionResult>[] {
            return ExpeditionEventSizes.map(size => ({
                key: size,
                label: this.$i18n.$t.extension.expeditions.expeditionEventSizes[size],
                color: this.colors[size],
                filled: true,
                getValue: item => item.eventSizes.resourceCount[this.resource][size],
                showAverage: true,
            }));
        }

        private getVisibleDatasets(datasets: ScollableChartFooterDataset[]): ScollableChartFooterDataset[] {
            return datasets.filter(d => d.visible);
        }

        private getSum(datasets: ScollableChartFooterDataset[]): number {
            return datasets.reduce((acc, cur) => acc + cur.value, 0);
        }
    }
</script>
<style lang="scss" scoped>
    .footer-item {
        display: grid;
        grid-template-columns: auto 1fr;
        column-gap: 4px;

        .number {
            text-align: right;
        }
    }

    .chart-container {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: start;
        height: 100%;
    }
</style>