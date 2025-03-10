<template>
    <div class="scrollable-chart" :style="`--chart-x-translation: ${-leftX * width}px`">
        <div class="chart-container" :class="{ 'no-legend': noLegend }">
            <div class="chart-content" v-if="isReady">
                <div class="svg-container" ref="svg-container" @mouseleave="activeXNormalized = null">
                    <scrollable-chart-svg
                        v-if="internalDatasets.length > 0"
                        :width="width"
                        :height="height"
                        :activeXNormalized.sync="activeXNormalized"
                        :xValuesNormalized="xValuesNormalized"
                        :xAxisTicksNormalized="xAxisTicksNormalized"
                        :maxXNormalized="maxXNormalized"
                        :yGridLines="yGridLines"
                        :reversedDatasets="reversedDatasets"
                        :showXValuesInGrid="showXValuesInGrid"
                    />

                    <div
                        class="chart-tooltip"
                        v-if="activeXNormalized != null"
                        :style="{
                            '--x': activeXNormalized - leftX,
                        }"
                    >
                        <div v-text="xValueTooltipFormatter(activeX)" class="chart-tooltip-header" />

                        <div
                            v-for="dataset in internalDatasets"
                            v-show="dataset.visible"
                            :key="`tooltip-${dataset.key}`"
                            class="chart-tooltip-item"
                            :class="{
                                zero: getLastValue(dataset, activeXNormalized) == 0,
                            }"
                        >
                            <span class="chart-tooltip-item-color" :style="{ color: dataset.color }" />
                            <span class="chart-tooltip-item-value" v-text="tooltipValueFormatter(getLastValue(dataset, activeXNormalized))" />
                            <span class="chart-tooltip-item-label" v-text="dataset.label" />
                        </div>

                        <div class="chart-tooltip-footer" v-if="hasTooltipFooter">
                            <template v-if="tooltipFooterProvider != null">
                                <div v-for="(footer, i) in footerTexts" :key="`footer-texts-${i}`" v-text="footer" />
                            </template>
                            <slot v-else name="tooltip-footer" :datasets="footerSlotDatasets" />
                        </div>
                    </div>
                </div>

                <div class="chart-y-axis">
                    <div
                        v-for="(yData, y) in yGridLines"
                        :key="`y-grid-label-${y}`"
                        class="y-axis-label"
                        :style="{ bottom: `${yData.fraction * 100}%` }"
                        v-text="$i18n.$n(y)"
                    />
                </div>

                <scrollable-chart-x-axis-labels
                    :width="width"
                    :maxXNormalized="maxXNormalized"
                    :xAxisTicks="xAxisTicks"
                    :xAxisTicksNormalized="xAxisTicksNormalized"
                    :xLabelFormatter="xLabelFormatter"
                />
            </div>

            <div class="chart-legend" v-if="!noLegend">
                <div
                    v-for="dataset in internalDatasets"
                    :key="`legend-item-${dataset.key}`"
                    class="legend-item"
                    :class="{
                        'legend-item-hidden': !dataset.visible,
                    }"
                    @click="toggleVisibility(dataset)"
                >
                    <div class="legend-item-color" :style="{ color: dataset.color }" />
                    <div class="legend-item-label" v-text="dataset.label" />
                </div>
            </div>

            <div class="scrollbar-container" ref="scrollbar-container" @scroll="updateTickOffset()">
                <div
                    :style="{
                        width: `${(100 * (xRange.max - xRange.min)) / (tickInterval * visibleTickCount)}%`,
                    }"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { $i18n } from '@/shared/i18n/extension/$i18n';
    import { _throw } from '@/shared/utils/_throw';
    import { PropType } from 'vue';
    import { Component, Prop, PropSync, Ref, Vue, Watch } from 'vue-property-decorator';
    import ScrollableChartSvg from './ScrollableChartSvg.vue';
    import ScrollableChartXAxisLabels from './ScrollableChartXAxisLabels.vue';

    function findPrevious<T>(array: T[], maxIndex: number, predicate: (item: T) => boolean): T | null {
        for (let i = Math.min(maxIndex, array.length - 1); i >= 0; i--) {
            const item = array[i];
            if (predicate(item)) {
                return item;
            }
        }

        return null;
    }

    export interface ScrollableChartDataset {
        key: string | number;
        values: Point[];
        color: string;
        label: string;
        filled: boolean;
        stack: boolean;
        hidePoints: boolean;
        average?: number;
    }

    export interface ScrollableChartInternalDataset extends ScrollableChartDataset {
        visible: boolean;
        internalValues: Point[];
        originalValuesByX: Record<number, number>;
        originalValuesByNormalizedX: Record<number, number>;
        valuesByX: Record<number, number>;
        valuesByNormalizedX: Record<number, number>;
        normalizedValues: Point[];
        normalizedValuesByNormalizedX: Record<number, number>;
        normalizedAverage: number | null;
        paths: {
            line: string;
            averageLine: string;
            background: string;
        };
    }

    export type YGridLineData = Record<number, { svg: number; fraction: number }>;

    export interface ScollableChartFooterDataset {
        key: string | number;
        label: string;
        visible: boolean;
        color: string;
        value: number;
    }

    interface Point {
        x: number;
        y: number;
    }

    @Component({
        components: {
            ScrollableChartSvg,
            ScrollableChartXAxisLabels,
        },
    })
    export default class ScrollableChart extends Vue {
        @Ref('svg-container')
        private svgContainer!: HTMLElement | null;

        @Ref('scrollbar-container')
        private scrollbarContainer!: HTMLElement | null;

        @Prop({ required: true, type: Array as PropType<ScrollableChartDataset[]> })
        private datasets!: ScrollableChartDataset[];

        @Prop({ required: false, type: Boolean })
        private noLegend!: boolean;

        @Prop({ required: false, type: Boolean })
        private showXValuesInGrid!: boolean;

        @Prop({ required: false, type: Boolean })
        private continueLastValue!: boolean;


        @Prop({ required: false, type: Boolean, default: () => true })
        private showZeroY!: boolean;


        @Prop({ required: false, type: Number, default: () => 1 })
        private tickInterval!: number;

        @Prop({ required: false, type: Number, default: () => 30 })
        private ticks!: number;

        @Prop({ required: false, type: Number, default: () => null })
        private minTick!: number | null;

        @Prop({ required: false, type: Number, default: () => null })
        private maxTick!: number | null;

        @Prop({ required: false, type: Array as PropType<number[]>, default: () => null })
        private tickList!: number[] | null;


        @Prop({ required: false, type: Function as PropType<(value: number) => string>, default: (value: number) => $i18n.$n(value) })
        private xLabelFormatter!: (value: number) => string;

        @Prop({ required: false, type: Function as PropType<(value: number) => string>, default: (value: number) => $i18n.$n(value) })
        private tooltipValueFormatter!: (value: number) => string;

        @Prop({ required: false, type: Function as PropType<(values: Record<string, number>) => string | string[]>, default: null })
        private tooltipFooterProvider!: ((values: Record<string, number>) => string | string[]) | null;

        @Prop({ required: false, type: Boolean, default: () => false })
        private hideTooltipFooter!: boolean;

        @Prop({ required: false, type: Function as PropType<(value: number) => string>, default: null })
        private xLabelTooltipFormatter!: (value: number) => string;


        private internalDatasets: ScrollableChartInternalDataset[] = [];
        private xRange = { min: 0, max: 0 };
        private yRange = { min: 0, max: 0 };
        private leftX = 0;

        private activeXNormalized: number | null = null;
        private yGridRange = { min: 0, max: 0 };
        private yGridLines: YGridLineData = {};
        private isReady = false;

        private readonly resizeObserver = new ResizeObserver(() => this.onResize());

        private get hasTooltipFooter() {
            if (this.hideTooltipFooter) {
                return false;
            }

            return this.tooltipFooterProvider != null
                || (this.footerSlotDatasets.length > 0 && this.$scopedSlots['tooltip-footer'] != null);
        }

        private getLastValue(dataset: ScrollableChartInternalDataset, xNormalized: number): number {
            const xs = this.xValuesNormalized;
            const index = xs.indexOf(xNormalized);

            for (let i = index; i >= 0; i--) {
                const value = dataset.originalValuesByNormalizedX[xs[i]];
                if (value != null) {
                    return value;
                }
            }
            return 0;
        }

        private get xValueTooltipFormatter() {
            return this.xLabelTooltipFormatter ?? this.xLabelFormatter;
        }

        private get activeX() {
            if (this.activeXNormalized == null) {
                return null;
            }

            return this.xValuesByXNormalized[this.activeXNormalized];
        }

        private get footerTexts(): string[] {
            const x = this.activeXNormalized;
            if (this.tooltipFooterProvider == null || x == null) {
                return [];
            }

            const values: Record<string, number> = this.internalDatasets.reduce((acc, dataset) => {
                const y = dataset.originalValuesByNormalizedX[x];
                if (y != null) {
                    acc[dataset.key] = y;
                }
                return acc;
            }, {} as Record<string, number>);

            const footer = this.tooltipFooterProvider(values);
            if (footer instanceof Array) {
                return footer;
            }

            return [footer];
        }

        private get footerSlotDatasets(): ScollableChartFooterDataset[] {
            return this.internalDatasets.map(dataset => ({
                key: dataset.key,
                label: dataset.label,
                visible: dataset.visible,
                color: dataset.color,
                value: dataset.originalValuesByNormalizedX[this.activeXNormalized ?? this.minTick ?? 0],
            }));
        }

        @Watch('datasets', { immediate: true })
        private async onDatasetsChanged(newValue: ScrollableChartDataset[], oldValue: ScrollableChartDataset[]) {
            const internalDatasets: ScrollableChartInternalDataset[] = this.datasets.map((dataset, i) => ({
                ...dataset,
                originalValuesByX: {},
                originalValuesByNormalizedX: {},
                valuesByX: {},
                valuesByNormalizedX: {},
                internalValues: [],
                normalizedValues: [],
                normalizedValuesByNormalizedX: {},
                normalizedAverage: null,
                paths: {
                    line: '',
                    averageLine: '',
                    background: '',
                },
                visible: true,
            }));


            this.internalDatasets = internalDatasets;
            if (this.internalDatasets.length == 0) {
                return;
            }

            this.updateValues();

            this.updateXAndYRange();
            this.updateYGridLines();

            this.updateNormalizedValues();
            this.updatePaths();
        }

        private get xAxisTicks(): number[] {
            if (this.tickList != null) {
                return this.tickList;
            }

            const { min, max } = this.xRange;
            const result: number[] = [];

            for (let x = min; x <= max; x += this.tickInterval) {
                result.push(x);
            }
            return result;
        }

        private get xAxisTicksNormalized(): number[] {
            const { min } = this.xRange;
            return this.xAxisTicks.map(x => (x - min) / (this.tickInterval * this.visibleTickCount));
        }

        private get xValues() {
            const result = new Set(this.internalDatasets.flatMap(d => d.internalValues.map(p => p.x)));
            return [...result].sort((a, b) => a - b);
        }

        private get xValuesNormalized() {
            return this.xValues.map(x => (x - this.xRange.min) / (this.tickInterval * this.visibleTickCount));
        }

        private get xValuesByXNormalized(): Record<number, number> {
            const result: Record<number, number> = {};

            const x = this.xValues;
            const xNormalized = this.xValuesNormalized;
            for (let i = 0; i < x.length; i++) {
                result[xNormalized[i]] = x[i];
            }

            return result;
        }

        private get width() {
            return this.svgContainer?.clientWidth ?? 0;
        }

        private get height() {
            return this.svgContainer?.clientHeight ?? 0;
        }

        private updateYGridLines() {
            const maxY = this.yRange.max;
            const minY = this.yRange.min;
            if (minY == maxY) {
                return;
            }
            const yGridConfig = this.internalConfig.grid.y;
            let step = 0;
            let stepCount = {
                positive: 0,
                negative: 0,
            };

            outerLoop:
            for (let stepFactor = 1; ; stepFactor *= yGridConfig.stepFactor) {
                for (let stepBase of yGridConfig.stepBases) {
                    let curStep = stepBase * stepFactor;

                    const positiveSteps = Math.ceil(maxY / curStep);
                    const negativeSteps = Math.ceil(-minY / curStep);
                    const steps = positiveSteps + negativeSteps;

                    if (steps >= yGridConfig.minLines && steps <= yGridConfig.maxLines) {
                        step = curStep;
                        stepCount = {
                            positive: positiveSteps,
                            negative: negativeSteps,
                        };
                        break outerLoop;
                    }
                }
            }


            const height = this.height;
            const lines: YGridLineData = {};
            const count = stepCount.positive + stepCount.negative;
            for (let c = 0; c <= count; c++) {
                const relativeC = (c - stepCount.negative);
                const y = step * relativeC;
                lines[y] = {
                    svg: height - height * c / count,
                    fraction: c / count,
                };
            }

            this.yGridLines = lines;
            this.yGridRange = {
                min: -stepCount.negative * step,
                max: stepCount.positive * step,
            };

            this.yRange = {
                min: Math.min(this.yRange.min, this.yGridRange.min),
                max: Math.max(this.yRange.max, this.yGridRange.max),
            };
        }

        private updateXAndYRange() {
            const xRange = {
                min: this.minTick ?? Number.MAX_SAFE_INTEGER,
                max: this.maxTick ?? Number.MIN_SAFE_INTEGER
            };
            const yRange = {
                min: this.showZeroY ? 0 : Number.MAX_SAFE_INTEGER,
                max: Number.MIN_SAFE_INTEGER
            };

            this.internalDatasets.forEach(dataset => {
                dataset.internalValues.forEach(point => {
                    xRange.min = Math.min(point.x, xRange.min);
                    xRange.max = Math.max(point.x, xRange.max);

                    yRange.min = Math.min(point.y, yRange.min);
                    yRange.max = Math.max(point.y, yRange.max);
                });
            });

            this.xRange = xRange;
            this.yRange = yRange;

            if ((this.yRange.max - this.yRange.min) < this.internalConfig.grid.y.minLines) {
                this.yRange.max = this.yRange.min + this.internalConfig.grid.y.minLines;
            }
        }

        private get reversedDatasets() {
            return [...this.internalDatasets].reverse();
        }

        private get visibleTickCount() {
            return Math.min(this.ticks, Math.ceil((this.xRange.max - this.xRange.min) / this.tickInterval));
        }

        private get maxXNormalized() {
            return (this.xRange.max - this.xRange.min) / (this.tickInterval * this.visibleTickCount);
        }

        private updateValues() {
            this.internalDatasets.forEach((internalDataset) => {
                internalDataset.values.forEach(point => internalDataset.valuesByX[point.x] = point.y);
            });

            this.internalDatasets.forEach((internalDataset, i, internalDatasets) => {
                const previousVisibleAndStackedDataset = findPrevious(internalDatasets, i - 1, d => d.visible && d.stack);

                internalDataset.values.forEach(point => internalDataset.originalValuesByX[point.x] = point.y);

                const values = internalDataset.values.map((point, i) => {
                    let { x, y } = point;
                    if (internalDataset.stack) {
                        y += previousVisibleAndStackedDataset?.valuesByX[x] ?? 0;
                    }
                    return { x, y };
                });
                internalDataset.internalValues = values;
                internalDataset.valuesByX = values.reduce((acc, point) => {
                    acc[point.x] = point.y;
                    return acc;
                }, internalDataset.valuesByX);
            });
        }

        private updateNormalizedValues() {
            this.internalDatasets.forEach((internalDataset, i, internalDatasets) => {
                const normalizedValues = internalDataset.internalValues.map((point, i) => {
                    let { x, y } = point;
                    x = (x - this.xRange.min) / (this.tickInterval * this.visibleTickCount);
                    y = (y - this.yRange.min) / (this.yRange.max - this.yRange.min);

                    return {
                        xNormalized: x,
                        yNormalized: y,
                        y: point.y,
                    };
                });
                internalDataset.normalizedValues = normalizedValues.map(p => ({ x: p.xNormalized, y: p.yNormalized }));

                if (internalDataset.average != null) {
                    internalDataset.normalizedAverage = (internalDataset.average - this.yRange.min) / (this.yRange.max - this.yRange.min);
                }

                internalDataset.valuesByNormalizedX = {};
                internalDataset.normalizedValuesByNormalizedX = {};
                normalizedValues.forEach(point => {
                    internalDataset.valuesByNormalizedX[point.xNormalized] = point.y;
                    internalDataset.normalizedValuesByNormalizedX[point.xNormalized] = point.yNormalized;
                });

                Object.keys(internalDataset.originalValuesByX)
                    .map(x => parseFloat(x))
                    .forEach(x => {
                        const normalizedX = (x - this.xRange.min) / (this.tickInterval * this.visibleTickCount);
                        const y = internalDataset.originalValuesByX[x];
                        internalDataset.originalValuesByNormalizedX[normalizedX] = y;
                    });
            });
        }

        private toggleVisibility(dataset: ScrollableChartInternalDataset) {
            dataset.visible = !dataset.visible;

            if (dataset.stack) {
                this.updateValues();
                this.updateNormalizedValues();
                this.updatePaths();
            }
        }

        private onResize() {
            this.$forceCompute('width');
            this.$forceCompute('height');

            this.updateYGridLines();
            this.updatePaths();

            this.scrollbarContainer!.scrollLeft = this.scrolledFraction * (this.scrollbarContainer!.scrollWidth - this.scrollbarContainer!.clientWidth);
        }

        private updatePaths() {
            const width = this.width;

            const normalizedZeroY = -this.yRange.min / (this.yRange.max - this.yRange.min);
            const zeroY = this.computeSvgPathSegments([{ x: 0, y: normalizedZeroY }], [{ x: 0, y: normalizedZeroY }], false)[0][0].y;

            this.internalDatasets = this.internalDatasets.map(dataset => {
                const svgPathSegments = this.computeSvgPathSegments(dataset.normalizedValues, dataset.internalValues);
                if (this.continueLastValue && dataset.normalizedValues[dataset.normalizedValues.length - 1].x < this.maxXNormalized) {
                    const lastSegment = svgPathSegments[svgPathSegments.length - 1];
                    lastSegment.push({
                        x: this.maxXNormalized * width,
                        y: lastSegment[lastSegment.length - 1].y,
                    });
                }
                const linePath = this.getSvgPath(svgPathSegments);

                const bgPath = `M 0 ${zeroY} `
                    + `L${linePath.substring(1)} `
                    + `L ${width * this.maxXNormalized} ${zeroY}`;

                let avgLinePath = '';
                if (dataset.normalizedAverage != null) {
                    const avgSvgValue = this.computeSvgPathSegments([{ x: 0, y: dataset.normalizedAverage }], [{ x: 0, y: normalizedZeroY }], false)[0][0].y;
                    avgLinePath = `M 0 ${avgSvgValue} L ${width * this.maxXNormalized} ${avgSvgValue}`;
                }

                const internalDataset: ScrollableChartInternalDataset = {
                    ...dataset,

                    paths: {
                        line: linePath,
                        averageLine: avgLinePath,
                        background: bgPath,
                    },
                };
                return internalDataset;
            });
        }

        private async mounted() {
            this.isReady = true;

            await this.$nextTick();
            this.resizeObserver.observe(this.svgContainer ?? _throw('svgContainer is null'));
            this.scrollbarContainer!.scrollLeft = this.scrollbarContainer!.scrollWidth - this.scrollbarContainer!.clientWidth;
        }

        private destroyed() {
            this.resizeObserver.disconnect();
        }

        private getSvgPath(segments: Point[][]) {
            const svgCommands = segments.map(
                points => points.map(
                    (point, i) => `${i == 0 ? 'M' : 'L'} ${point.x} ${point.y}`
                ).join(' ')
            );
            return svgCommands.join(' ');
        }

        private computeSvgPathSegments(normalizedValues: Point[], values: Point[], splitSegmentsOnConsecutiveZeros = true): Point[][] {
            const width = this.width;
            const height = this.height;

            const segments: Point[][] = [];
            let currentSegment: Point[] = [];
            for (let i = 0; i < normalizedValues.length; i++) {
                const normalizedValue = normalizedValues[i];
                const value = values[i];
                const nextValue: Point | undefined = values[i + 1];
                const prevValue: Point | undefined = values[i - 1];

                if (value.y == 0 && splitSegmentsOnConsecutiveZeros) {
                    if (prevValue?.y == 0 || (nextValue?.y ?? 0) == 0) {
                        if (currentSegment.length > 0) {
                            currentSegment.push(normalizedValue);
                            segments.push(currentSegment);
                            currentSegment = [];
                        }
                    }
                }

                if (value.y != 0 || (nextValue?.y ?? 0) != 0 || !splitSegmentsOnConsecutiveZeros) {
                    currentSegment.push(normalizedValue);
                }
            }
            if (currentSegment.length) {
                segments.push(currentSegment);
            }

            return segments.map(segment =>
                segment.map(point => {
                    const x = width * point.x;
                    const y = height * (1 - point.y);
                    return { x, y };
                })
            );
        }

        private readonly internalConfig = {
            grid: {
                y: {
                    minLines: 5,
                    maxLines: 10,

                    stepBases: [1, 2, 5],
                    stepFactor: 10,
                },
            },
        };

        private scrolledFraction = 1;
        private updateTickOffset() {
            if (this.scrollbarContainer == null) {
                throw new Error('scrollbar container is null');
            }
            this.scrolledFraction = this.scrollbarContainer.scrollLeft / (this.scrollbarContainer.scrollWidth - this.scrollbarContainer.clientWidth);
            this.leftX = (this.maxXNormalized - 1) * this.scrolledFraction;
        }
    }
</script>
<style lang="scss" scoped>
    .scrollable-chart {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-rows: 1fr auto;
    }

    svg {
        width: 100%;
        height: 100%;
        overflow: visible;
    }

    .chart-container {
        display: grid;
        grid-template-columns: 1fr 200px;
        grid-template-rows: 1fr auto;

        &.no-legend {
            grid-template-columns: 1fr;
            padding-right: 16px; // necessary because overflow of last x-axis label will cause a scrollbar if there is no legend
        }
    }

    .chart-content {
        display: grid;
        grid-template-columns: 100px 1fr;
        grid-template-rows: 1fr 100px;
    }

    .svg-container {
        grid-row: 1;
        grid-column: 2;
        min-height: 250px;
        min-width: 500px;
        position: relative;
        overflow: hidden;
        margin-right: 10px;
    }

    .chart-y-axis {
        grid-row: 1;
        grid-column: 1;

        position: relative;

        > .y-axis-label {
            position: absolute;
            right: 0;
            transform: translate(-15px, 50%);
            white-space: pre;
            color: #888;
            font-size: 12px;

            &:last-of-type {
                transform: translate(-15px, 100%);
            }
        }
    }

    .chart-legend {
        grid-row: 1 / span 2;
        grid-column: 2;
        padding: 0 12px;
    }

    .legend-item {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: center;
        cursor: pointer;
        padding: 4px 8px;

        &:hover {
            background-color: rgba(var(--color), 0.1);
            border-radius: 4px;
        }

        &-hidden {
            text-decoration: line-through;
            opacity: 0.4;

            .legend-item-color {
                filter: grayscale(100%);
            }
        }
    }

    .legend-item-color {
        width: 16px;
        height: 16px;
        border-radius: 4px;
        background: currentColor;
        margin-right: 4px;
    }

    .chart-tooltip {
        position: absolute;
        top: 0;
        border: 1px solid rgba(var(--color), 0.5);
        background-color: rgba(black, 0.9);
        background-image: linear-gradient(to right, rgba(var(--color), 0.2), rgba(var(--color), 0.2));

        padding: 12px;
        border-radius: 4px;
        left: calc(100% * var(--x));
        transform: translateX(calc(-100% * var(--x)));
        white-space: pre;
        line-height: 1;

        display: grid;
        grid-template-columns: auto auto 1fr;
        gap: 2px 6px;
        align-items: center;
        width: max-content;
        font-size: 0.75rem;
        pointer-events: none;

        &-item {
            display: contents;

            &.zero > * {
                opacity: 0.4;
            }

            &-color {
                display: inline-block;
                width: 9px;
                height: 9px;
                border-radius: 2px;
                background: currentColor;
            }
            &-value {
                text-align: right;
                font-weight: bold;
            }
        }

        &-header,
        &-footer {
            grid-column: 1 / span 3;
            font-weight: bold;
        }

        &-header {
            margin-bottom: 4px;
        }
        &-footer {
            margin-top: 4px;
            padding-top: 4px;
            border-top: 1px solid rgba(var(--color), 0.5);
        }
    }

    .scrollbar-container {
        margin-left: 100px;
        overflow-x: auto;

        > div {
            height: 1px;
        }
    }
</style>