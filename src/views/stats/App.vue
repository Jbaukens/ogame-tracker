<template>
    <div
        id="app"
        :style="{
            '--color': getColorVariable(activeColor),
        }"
        :class="activeTab ? activeTab.appClass : ''"
    >
        <nav>
            <floating-menu
                :value="tabWithMenu == tab"
                @input="tabWithMenu = null"
                v-for="tab in tabs"
                :key="tab.key"
                :style="tab.noNavItem ? tab.style : null"
                class="tab_floating-menu"
            >
                <template #activator>
                    <component
                        :is="tab.to != null ? 'router-link' : tab.href != null ? 'a' : 'div'"
                        :target="tab.href != null ? '_blank' : null"
                        v-bind="
                            tab.href != null
                            ? { href: tab.href }
                            : { to: tab.to }
                        "
                        :active-class="tab.to != null ? 'nav-item-active' : null"
                        :class="[
                            {
                                'nav-item': tab.noNavItem != true,
                                'icon-only': tab.label == null && tab.icon != null,
                            },
                            tab.class,
                        ]"
                        :style="[
                            {
                                '--color': getColorVariable(getColor(tab)),
                            },
                            tab.noNavItem ? null : tab.style,
                        ]"
                        @click.left="() => (tab.customAction != null ? tab.customAction() : null)"
                        :ref="`tab-${tab.key}`"
                    >
                        <span v-if="tab.icon != null" class="nav-item-icon" :class="tab.icon" />
                        <span v-if="tab.label != null" class="nav-item-label">
                            <span v-text="tab.label" />
                            <span
                                v-if="tab.keyboardKey != null && tab.keyboardIcon != null"
                                class="nav-item-keyboard-shortcut-icon"
                                :class="tab.keyboardIcon"
                            />
                        </span>
                        <span v-if="isDefaultRoute(tab.to)" class="nav-item-home-icon mdi mdi-home" />
                    </component>
                </template>

                <set-default-route-button v-if="tab.canBeDefault" :label="$i18n.$t.extension.settings.setDefaultRoute" rootRouteName="" :routeName="tab.to.name" />
            </floating-menu>

            <template v-if="isIframeMode">
                <div style="width: 24px" />
                <div class="nav-item icon-only" style="--color: none">
                    <span class="mdi mdi-close close-overlay" @click="closeOverlay()" />
                </div>
            </template>
        </nav>
        <main>
            <router-view />
        </main>
        <footer>
            <router-link :to="{ name: 'donate' }" class="made-with-love">
                <span v-text="$i18n.$t.extension.common.madeWithLove1" class="mr-1" />
                <span class="mdi mdi-heart" style="color: #ff1f1f" />
                <span v-text="$i18n.$t.extension.common.madeWithLove2" class="ml-1" />
            </router-link>

            <span v-text="accountAndServer" />
        </footer>

        <switch-account-dialog v-if="showAccountSwitchDialog" :color="colors.switchAccount" @close="showAccountSwitchDialog = false" />
    </div>
</template>

<script lang="ts">
    import { Component, Vue, Watch } from "vue-property-decorator";
    import { UniversesAndAccountsDataModule } from "./data/UniversesAndAccountsDataModule";
    import { GlobalOgameMetaData } from "./data/global";
    import { getRGBString } from './utils/getRGBString';
    import { delay } from '@/shared/utils/delay';
    import { _throw } from "@/shared/utils/_throw";
    import { SettingsDataModule } from "./data/SettingsDataModule";
    import SetDefaultRouteButton from "@stats/components/settings/SetDefaultRouteButton.vue";
    import SwitchAccountDialog from '@stats/components/SwitchAccountDialog.vue';
    import { _constants } from '@stats/_constants';
    import { ogameTrackerCloseDialogEventName } from "@/shared/messages/communication";

    interface Tab {
        key: string;
        to?: { name: string };
        href?: string;
        icon?: string;
        label?: string;
        style?: string | Record<string, any>;
        noNavItem?: boolean;
        color?: string;
        class?: string;
        appClass?: string;
        customAction?: () => void;
        canBeDefault?: boolean;

        keyboardKey?: string;
        keyboardIcon?: string;
    }

    @Component({
        components: {
            SetDefaultRouteButton,
            SwitchAccountDialog,
        },
    })
    export default class App extends Vue {
        private readonly colors = {
            switchAccount: '#666666',
            discord: '#5865f2',
        };

        private showAccountSwitchDialog = false;
        private accountAndServer = '';

        private get isIframeMode() {
            const params = new URLSearchParams(location.search);
            return params.get('iframe') != null;
        }

        private get activeTab(): Tab | null {
            return this.tabs.find(tab => tab.to != null &&
                this.$route.matched.some(route => route.name == tab.to?.name)
            ) ?? null;
        }

        private tabWithMenu: Tab | null = null;

        private setTabWithMenu(tab: Tab) {
            this.tabWithMenu = tab;
        }

        private isDefaultRoute(to?: { name: string }): boolean {
            if (to == null) {
                return false;
            }

            const defaultRoute = SettingsDataModule.settings.defaultRoutes[''] ?? 'expeditions';
            return defaultRoute == to.name;
        }

        private get tabs(): Tab[] {
            const tabs: Tab[] = [
                {
                    key: 'expeditions',
                    to: { name: 'expeditions' },
                    icon: 'ogti ogti-expedition',
                    label: this.$i18n.$t.extension.expeditions.header,
                    keyboardKey: '1',
                    keyboardIcon: 'mdi mdi-numeric-1',
                    canBeDefault: true,
                },
                {
                    key: 'combats',
                    to: { name: 'combats' },
                    icon: 'ogti ogti-attack',
                    label: this.$i18n.$t.extension.combats.header,
                    keyboardKey: '2',
                    keyboardIcon: 'mdi mdi-numeric-2',
                    canBeDefault: true,
                },
                {
                    key: 'debris-fields',
                    to: { name: 'debris-fields' },
                    icon: 'ogti ogti-debris-field',
                    label: this.$i18n.$t.extension.debrisFields.header,
                    keyboardKey: '3',
                    keyboardIcon: 'mdi mdi-numeric-3',
                    canBeDefault: true,
                },
                {
                    key: 'resource-balance',
                    to: { name: 'resource-balance' },
                    icon: 'ogti ogti-economy',
                    label: this.$i18n.$t.extension.resourceBalance.header,
                    keyboardKey: '4',
                    keyboardIcon: 'mdi mdi-numeric-4',
                    canBeDefault: true,
                },
                {
                    key: 'empire',
                    to: { name: 'empire' },
                    icon: 'ogti ogti-planet-moon',
                    label: this.$i18n.$t.extension.empire.header,
                    keyboardKey: '5',
                    keyboardIcon: 'mdi mdi-numeric-5',
                    canBeDefault: true,
                },
                {
                    key: 'lifeforms',
                    to: { name: 'lifeforms' },
                    icon: 'ogti ogti-dna',
                    label: this.$i18n.$t.extension.empire.lifeforms.header,
                    keyboardKey: '6',
                    keyboardIcon: 'mdi mdi-numeric-6',
                    canBeDefault: true,
                },
                {
                    key: 'universe-history',
                    to: { name: 'universe-history' },
                    icon: 'mdi mdi-update',
                    label: this.$i18n.$t.extension.universeHistory.header,
                    keyboardKey: '7',
                    keyboardIcon: 'mdi mdi-numeric-7',
                    canBeDefault: true,
                },
                // {
                //     key: 'espionage',
                //     to: { name: 'espionage' },
                //     icon: 'mdi mdi-eye-outline',
                //     label: 'LOCA: Espionage',
                //     keyboardKey: '8',
                //     keyboardIcon: 'mdi mdi-numeric-8',
                //     canBeDefault: true,
                // },
                {
                    key: 'space',
                    style: {
                        'flex-grow': 1
                    },
                    noNavItem: true,
                },
                {
                    key: 'settings',
                    to: { name: 'settings' },
                    icon: 'mdi mdi-cog',
                },
                {
                    key: 'tools',
                    to: { name: 'tools' },
                    icon: 'mdi mdi-hammer-wrench',
                },
                {
                    key: 'excel-export',
                    to: { name: 'excel-export' },
                    icon: 'mdi mdi-microsoft-excel',
                },
                {
                    key: 'donate',
                    to: { name: 'donate' },
                    icon: 'mdi mdi-coffee',
                    label: this.$i18n.$t.extension.donate.header,
                    class: 'donate',
                    appClass: 'donate-page',
                },
                {
                    key: 'discord',
                    href: _constants.discordInviteLink,
                    icon: 'ogti ogti-discord',
                    color: this.colors.discord,
                },
                {
                    key: 'about',
                    to: { name: 'about' },
                    icon: 'mdi mdi-help-box',
                },
                {
                    key: 'switch-account',
                    customAction: () => this.showAccountSwitchDialog = true,
                    icon: 'mdi mdi-account-multiple',
                    color: this.colors.switchAccount,
                },
            ];

            return tabs;
        }

        private get activeColor(): string | null {
            const matchedRoutes = this.$route.matched;
            return matchedRoutes.map(route => route.meta?.color)
                .find(color => color != null)
                ?? null;
        }

        private getColor(tab: Tab): string | null {
            if (tab.color != null) {
                return tab.color;
            }

            const routes = this.$router.getRoutes();
            const route = routes.find(route => route.name == tab.to?.name);

            return route?.meta?.color ?? null;
        }

        private getColorVariable(hexColor: string | null): string | null {
            return getRGBString(hexColor);
        }


        private closeOverlay() {
            window.parent.postMessage(ogameTrackerCloseDialogEventName, '*');
        }

        private async mounted() {
            window.addEventListener('keypress', e => {
                if (e.composedPath().some(elem => elem instanceof HTMLInputElement)) {
                    return;
                }

                const selectedTab = this.tabs.find(tab => tab.keyboardKey == e.key);
                const to = selectedTab?.to;
                if (to != null && !this.$route.matched.some(route => route.name == to.name)) {
                    this.$router.push(to);
                }
            });

            await document.fonts.ready;
            await delay(100);

            await this.setWindowTitleAndFooter();

            await this.$nextTick();
            this.onRefsChanged();
            window.focus();

            const splashscreen = document.querySelector('#splashscreen');
            splashscreen?.classList.add('fade');
            setTimeout(() => splashscreen?.remove(), 500);
        }

        private onRefsChanged() {
            // this method exists because @contextmenu does not seem to get passed to dynamic <component>
            const refKeys = Object.keys(this.$refs).filter(key => key.startsWith('tab-'));
            refKeys.forEach(key => {
                const tabKey = key.substring('tab-'.length);
                const tab = this.tabs.find(tab => tab.key == tabKey) ?? _throw(`tab with key '${tabKey}' not found`);

                if (!tab.canBeDefault) {
                    return;
                }

                const refElem = (this.$refs[key] as Vue[])[0];
                refElem.$el.addEventListener('contextmenu', e => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.setTabWithMenu(tab);
                });
            });
        }

        private async setWindowTitleAndFooter() {
            await UniversesAndAccountsDataModule.ready;

            const account = UniversesAndAccountsDataModule.currentAccount;
            const server = UniversesAndAccountsDataModule.currentServer;

            const title = `${account.name} - ${server.language.toUpperCase()} ${server.name}`;
            document.title = title;

            this.accountAndServer = title;
        }
    }
</script>

<style lang="scss" scoped>
    #app {
        color: white;
        height: 100vh;

        display: grid;
        grid-template-rows: auto 1fr;

        background-color: black;
        background-image: linear-gradient(52deg, rgba(var(--color), 0.02), rgba(var(--color), 0.08));

        overflow: auto;
    }

    nav {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;

        border-bottom: 2px solid rgb(var(--color));
    }

    .nav-item {
        height: 50px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        cursor: pointer;
        text-decoration: none;
        padding: 0 12px 0 6px;

        &.icon-only {
            padding: 0 12px;
        }

        &.nav-item-active,
        &.nav-item-active:hover {
            background: linear-gradient(to bottom, rgba(var(--color), 0.7), rgb(var(--color)));
        }
        &:hover {
            background: linear-gradient(to bottom, rgba(var(--color), 0.25), rgba(var(--color), 0.5));
        }

        &-label {
            position: relative;
        }

        &-keyboard-shortcut-icon {
            font-size: 16px;
            position: absolute;
            top: -14px;
            left: -5px;
        }

        &-home-icon {
            position: absolute;
            left: 2px;
            bottom: -2px;
            font-size: 12px !important;
        }

        > .ogti {
            font-size: 36px;
        }
        > .mdi {
            font-size: 28px;
        }

        > .ogti + *,
        > .mdi + * {
            margin-left: 6px;
        }
    }

    main {
        padding: 16px 16px 0 16px;
        overflow: hidden;
    }
    footer {
        padding: 4px 16px;
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 16px;
    }

    .close-overlay {
        opacity: 0.5;
        cursor: pointer;

        &:hover {
            opacity: 1;
        }
    }

    .nav-item.donate {
        font-weight: bold;

        &:not(:hover):not(.nav-item-active) {
            color: rgb(var(--color));
        }

        &:hover {
            background: rgba(var(--color), 0.5);
            text-shadow: 0 0 3px black, 0 0 8px rgb(var(--color)), 0 0 16px rgb(var(--color)), 0 0 24px rgb(var(--color));
        }

        &.nav-item-active,
        &.nav-item-active:hover {
            background: rgb(var(--color));
            color: black;
            text-shadow: none;
        }
    }

    #app.donate-page {
        background: black linear-gradient(180deg, rgb(var(--color)), #ffc165);

        main {
            color: black;
        }

        footer {
            color: black;
        }

        nav {
            background: black;
        }
    }

    .tab_floating-menu {
        &::v-deep .floating-menu {
            left: 50%;
            top: 50%;
            z-index: 0 !important;
        }
    }

    .made-with-love {
        text-decoration: none;

        &.router-link-active {
            color: black;
        }
    }

    .ogti-planet-moon::before {
        transform: scale(1.2);
    }
</style>
