<template>
    <tab-view :tabs="tabs" root-route-name="expeditions/dark-matter/sizes" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { Tab } from '@stats/components/common/TabView.vue';

    @Component({})
    export default class Index extends Vue {
        private get tabs(): Tab[] {
            return [
                {
                    to: { name: 'expeditions/dark-matter/sizes/chart' },
                    label: this.$i18n.$t.extension.common.chart,
                },
                {
                    to: { name: 'expeditions/dark-matter/sizes/table' },
                    label: this.$i18n.$t.extension.common.table,
                },
            ];
        }
    }
</script>