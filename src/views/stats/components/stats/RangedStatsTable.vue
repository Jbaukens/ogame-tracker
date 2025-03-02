<template>
    <grid-table :columns="columns" :items="rows" :footer-items="footerRows" :cell-class-provider="(value) => getCellClass(value)" class="ranged-stats-table">
        <!-- oh god this is ugly -->
        <template v-for="(column, i) in columns" v-slot:[`cell-${column.key}`]="{ value, item }">
            <span :key="column.key" class="ranged-stats-table-cell">
                <template v-if="column.key == 'label'">
                    <slot v-if="column.slotName != null && $scopedSlots[column.slotName] != null" :name="column.slotName" :value="value" />
                    <span v-else :key="i" v-text="value" />
                </template>
                <template v-else-if="column.key == 'subLabel'">
                    <span v-for="(item, i) in item.items" :key="i" :class="item.labelClass">
                        <slot v-if="column.slotName != null && $scopedSlots[column.slotName] != null" :name="column.slotName" :value="item.label" />
                        <span v-else v-text="item.label" />
                    </span>
                </template>
                <template v-else>
                    <span v-for="(item, i) in item.items || [item]" :key="i" :class="[getCellClass(item[column.key]), item.class]">
                        <span v-if="column.formatter != null" v-text="column.formatter(item[column.key])" />
                        <span v-else v-text="item[column.key]" />
                    </span>
                </template>
            </span>
        </template>

        <template v-for="(index, name) in $scopedSlots" v-slot:[name]="data">
            <slot :name="name" v-bind="data" />
        </template>
    </grid-table>
</template>

<script lang="ts">
    import { PropType } from 'vue';
    import { Prop } from 'vue-property-decorator';
    import { Component, Vue } from 'vue-property-decorator';
    import { GridTableColumn } from '@stats/components/common/GridTable.vue';
    import { isInRange } from '@stats/utils/dateRanges';
    import { _throw } from '@/shared/utils/_throw';
    import startOfDay from 'date-fns/startOfDay/index';
    import { SettingsDataModule } from '../../data/SettingsDataModule';

    interface RangeStatsTableItemWithDate {
        date: number;
    }

    interface SingleRangedStatsTableItem<T extends RangeStatsTableItemWithDate> {
        label: string;
        getValue: (items: T[]) => number;
        class?: string;
        labelClass?: string;
    }

    interface GroupedRangedStatsTableItem<T extends RangeStatsTableItemWithDate> {
        label: string;
        items: SingleRangedStatsTableItem<T>[];
    }

    export type RangedStatsTableItem<T extends RangeStatsTableItemWithDate> = SingleRangedStatsTableItem<T> | GroupedRangedStatsTableItem<T>;

    interface SimpleRangedStatsTableRow {
        label: string;
        percentage?: number | '';
        average?: number;

        [index: number]: number;
    }

    interface GroupedRangedStatsTableRow {
        label: string;
        items: SimpleRangedStatsTableRow[];
    }

    type RangedStatsTableRow = SimpleRangedStatsTableRow | GroupedRangedStatsTableRow;

    interface RangeStatsTableColumn extends GridTableColumn<keyof SimpleRangedStatsTableRow | 'subLabel' | number> {
        slotName?: string;
    }

    @Component({})
    export default class RangedStatsTable<T extends RangeStatsTableItemWithDate> extends Vue {

        @Prop({ required: false, type: Boolean })
        private showPercentage!: boolean;

        @Prop({ required: false, type: Boolean })
        private showAverage!: boolean;

        @Prop({ required: true, type: Array as PropType<RangedStatsTableItem<T>[]> })
        private items!: RangedStatsTableItem<T>[];

        @Prop({ required: false, type: Array as PropType<RangedStatsTableItem<T>[]>, default: () => [] })
        private footerItems!: RangedStatsTableItem<T>[];

        @Prop({ required: false, type: Object as PropType<Intl.NumberFormatOptions>, default: undefined })
        private numberFormatOptions: Intl.NumberFormatOptions | undefined;

        @Prop({ required: false, type: Object as PropType<Intl.NumberFormatOptions>, default: undefined })
        private averageNumberFormatOptions: Intl.NumberFormatOptions | undefined;

        @Prop({ required: true, type: Array as PropType<T[]> })
        private dataItems!: T[];

        private get hasGroupedItems(): boolean {
            return this.items.some(item => 'items' in item);
        }

        private get dateRanges() {
            return SettingsDataModule.settings.dateRanges;
        }

        private get dataItemsByRange(): T[][] {
            const dataItems = this.dataItems;
            const dataItemsByRange: T[][] = this.dateRanges.map(() => []);

            dataItems.forEach(item => {
                this.dateRanges.forEach((range, i) => {
                    if (isInRange(item.date, range)) {
                        dataItemsByRange[i].push(item);
                    }
                });
            });

            return dataItemsByRange;
        }

        private get firstDay() {
            return this.dataItemsByRange.reduce((acc, cur) => Math.min(
                acc,
                Math.min(...cur.map(t => t.date)),
            ), Date.now());
        }

        private get columns(): RangeStatsTableColumn[] {
            const columns: RangeStatsTableColumn[] = [
                {
                    key: 'label',
                    label: '',
                    slotName: 'label',
                }
            ];
            if (this.hasGroupedItems) {
                columns.push({
                    key: 'subLabel',
                    label: '',
                    slotName: 'subLabel',
                });
            }

            columns.push(...this.dateRanges.map((range, i) => ({
                key: i,
                label: range.label ?? this.$i18n.$t.extension.settings.dateRanges.since(this.$i18n.$d(this.firstDay, 'date')),
                formatter: (value: number) => this.$i18n.$n(value, this.numberFormatOptions),
            })));

            if (this.showAverage) {
                columns.push({
                    key: 'average',
                    label: this.$i18n.$t.extension.common.averagePerDay,
                    formatter: (value: number) => this.$i18n.$n(value, this.averageNumberFormatOptions ?? this.numberFormatOptions)
                });
            }

            if (this.showPercentage) {
                columns.push({
                    key: 'percentage',
                    label: '%',
                    formatter: (value: number | '') => value != ''
                        ? this.$i18n.$n(value, {
                            minimumFractionDigits: 3,
                            maximumFractionDigits: 3,
                        })
                        : value
                });
            }

            return columns;
        }

        private get rows(): (RangedStatsTableRow & { class?: string })[] {
            const dataItemsByRange = this.dataItemsByRange;

            const allRangeIndex = this.dateRanges.findIndex(range => range.type == 'all')
                ?? _throw(`failed to find range 'all'`);
            const dataItemDays = dataItemsByRange[allRangeIndex].map(expo => startOfDay(expo.date).getTime());
            const daysWithDataItems = new Set(dataItemDays).size;

            const totalValue = Math.max(1, this.items
                .map(item => 'getValue' in item
                    ? item.getValue(dataItemsByRange[allRangeIndex])
                    : item.items.reduce((acc, i) => acc + i.getValue(dataItemsByRange[allRangeIndex]), 0)
                )
                .reduce((acc, cur) => acc + cur, 0)
            );

            return this.items.map(item => this.mapItemToRow(item, dataItemsByRange, allRangeIndex, daysWithDataItems, totalValue));
        }

        private mapItemToRow(item: RangedStatsTableItem<T>, dataItemsByRange: T[][], allRangeIndex: number, daysWithDataItems: number, totalValue: number): (RangedStatsTableRow & { class?: string; labelClass?: string }) {
            if ('getValue' in item) {
                const row: SimpleRangedStatsTableRow & { class?: string; labelClass?: string } = {
                    label: item.label,
                    class: item.class,
                    labelClass: item.labelClass,

                    ...this.dateRanges.map((_, rangeIndex) => item.getValue(dataItemsByRange[rangeIndex])),
                };

                const allRangeValue = row[allRangeIndex];

                if (this.showAverage) {
                    row.average = allRangeValue / Math.max(1, daysWithDataItems);
                }

                if (this.showPercentage) {
                    row.percentage = 100 * allRangeValue / totalValue;
                }
                return row;
            }

            return {
                label: item.label,
                items: item.items.map(subitem => this.mapItemToRow(subitem, dataItemsByRange, allRangeIndex, daysWithDataItems, totalValue) as SimpleRangedStatsTableRow & { class?: string; labelClass?: string }),
            };
        }

        private get footerRows(): RangedStatsTableRow[] {
            const dataItemsByRange = this.dataItemsByRange;

            const allRangeIndex = this.dateRanges.findIndex(range => range.type == 'all')
                ?? _throw(`failed to find range 'all'`);
            const dataItemDays = dataItemsByRange[allRangeIndex].map(expo => startOfDay(expo.date).getTime());
            const daysWithDataItems = new Set(dataItemDays).size;

            return this.footerItems.map(item => {
                const row: RangedStatsTableRow = {
                    label: item.label,
                    ...this.dateRanges.map((_, rangeIndex) => 'getValue' in item
                        ? item.getValue(dataItemsByRange[rangeIndex])
                        : item.items.reduce((acc, i) => acc + i.getValue(dataItemsByRange[rangeIndex]), 0)
                    ),
                    percentage: '',
                };

                if (this.showAverage) {
                    const allRangeValue = row[allRangeIndex];
                    row.average = allRangeValue / Math.max(1, daysWithDataItems);
                }

                return row;
            });
        }

        private getCellClass(value: any): string {
            if (value == 0) {
                return 'fade-value';
            }

            return '';
        }
    }
</script>
<style lang="scss" scoped>
    .grid-table {
        text-align: right;

        &::v-deep .fade-value {
            color: rgba(white, 0.1);
        }
    }

    .ranged-stats-table-cell {
        display: grid;
        height: 100%;
        align-items: center;
    }
</style>