<template>
    <div class="common-settings">
        <extension-language-settings />
        <conversion-rate-settings />
        <show-converted-resources-in-cells-settings />
        <force-update-server-settings />
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import ConversionRateSettings from '@/views/stats/components/settings/ConversionRateSettings.vue';
    import ExtensionLanguageSettings from '@stats/components/settings/ExtensionLanguageSettings.vue';
    import ShowConvertedResourcesInCellsSettings from '@stats/components/settings/ShowConvertedResourcesInCellsSettings.vue';
    import ForceUpdateServerSettings from '@stats/components/settings/ForceUpdateServerSettings.vue';

    @Component({
        components: {
            ConversionRateSettings,
            ExtensionLanguageSettings,
            ShowConvertedResourcesInCellsSettings,
            ForceUpdateServerSettings,
        },
    })
    export default class Misc extends Vue {
    }
</script>
<style lang="scss" scoped>
    .common-settings {
        display: grid;
        row-gap: 16px;
    }
</style>