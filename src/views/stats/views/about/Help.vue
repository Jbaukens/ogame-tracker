<template>
    <div class="help">
        <tabs :tabs="tabs">
            <template #tab-content-faq>
                <grid-table v-for="(item, i) in itemsFaq" :key="i" :columns="getColumnsFaq(item)" :items="[item]" class="faq-table" />
            </template>

            <template #tab-content-tips>
                <div class="tip" v-text="$i18n.$t.extension.about.faqHelp.tips.rightClickDefaultRoute" />
                <div class="tip" v-text="$i18n.$t.extension.about.faqHelp.tips.numbersKeyboardNavigation" />
                <div class="tip">
                    <span v-text="$i18n.$t.extension.about.faqHelp.tips.amortizationTable.part1" />
                    <router-link :to="{ name: 'empire/amortization' }" v-text="$i18n.$t.extension.about.faqHelp.tips.amortizationTable.name" />
                    <span v-text="$i18n.$t.extension.about.faqHelp.tips.amortizationTable.part2" />
                </div>
                <div class="tip" v-text="$i18n.$t.extension.about.faqHelp.tips.inlineSettings" />
                <div class="tip" v-html="$i18n.$t.extension.about.faqHelp.tips.switchAccountHtml" />
            </template>
        </tabs>

        <div class="discord-message">
            <span v-text="$i18n.$t.extension.about.faqHelp.messageDiscord.part1" />
            <a :href="discordInviteLink" v-text="$i18n.$t.extension.about.faqHelp.messageDiscord.discordServer" />
            <span v-text="$i18n.$t.extension.about.faqHelp.messageDiscord.part2" />
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { GridTableColumn } from '../../components/common/GridTable.vue';
    import { Tab } from '../../components/common/Tabs.vue';
    import { _constants } from '../../_constants';

    interface FaqItem {
        header: string;
        text: string;
    }

    @Component({})
    export default class Help extends Vue {

        private readonly discordInviteLink = _constants.discordInviteLink;

        private getColumnsFaq(item: FaqItem): GridTableColumn<keyof FaqItem>[] {
            return [{
                key: 'text',
                label: item.header,
            }];
        }

        private get itemsFaq(): FaqItem[] {
            return [
                {
                    header: this.$i18n.$t.extension.about.faqHelp.faq.fleetLostOnExpedition.header,
                    text: this.$i18n.$t.extension.about.faqHelp.faq.fleetLostOnExpedition.text,
                },
                {
                    header: this.$i18n.$t.extension.about.faqHelp.faq.syncBetweenDevices.header,
                    text: this.$i18n.$t.extension.about.faqHelp.faq.syncBetweenDevices.text,
                },
                {
                    header: this.$i18n.$t.extension.about.faqHelp.faq.productionInResourceBalance.header,
                    text: this.$i18n.$t.extension.about.faqHelp.faq.productionInResourceBalance.text,
                },
                {
                    header: this.$i18n.$t.extension.about.faqHelp.faq.whatAreAverages.header,
                    text: this.$i18n.$t.extension.about.faqHelp.faq.whatAreAverages.text,
                },
            ];
        }

        private get tabs(): Tab[] {
            return [
                {
                    key: 'faq',
                    label: this.$i18n.$t.extension.about.faqHelp.faq.header,
                },
                {
                    key: 'tips',
                    label: this.$i18n.$t.extension.about.faqHelp.tips.header,
                },
            ];
        }
    }
</script>
<style lang="scss" scoped>
    .faq-table {
        width: 450px;

        &::v-deep {
            .grid-table-cell {
                text-align: left;
                justify-content: flex-start;
            }
        }

        + .faq-table {
            margin-top: 4px;
        }
    }

    .tip {
        margin-top: 4px;
        width: 450px;
        border: 1px solid rgba(var(--color), 0.5);
        border-radius: 4px;
        box-shadow: 0 0 6px 0 rgba(black, 0.333);
        background: rgba(var(--color), 0.1);
        padding: 8px 16px;
    }

    .discord-message {
        font-weight: bold;
        width: 450px;
        background-color: black;
        background-image: linear-gradient(0deg, rgba(var(--color), 0.5), rgba(var(--color), 0.7));
        border: 1px solid rgba(var(--color), 0.5);
        border-radius: 4px;
        box-shadow: 0 0 6px 0 rgba(black, 0.333);
        padding: 8px 16px;
    }

    .help {
        display: grid;
        height: 100%;
        max-height: 100%;
        grid-template-rows: 1fr auto;
        gap: 8px;
    }
</style>