<template>
    <notification type="info" :title="title" @remove="$emit('remove')" :timeout="10000">
        <template #message>
            <div v-if="notification.count > 0" v-text="message" />

            <template v-if="hasLoot">
                <hr />
                <div class="resources-grid" v-if="showSimplified">
                    <o-resource resource="metal" />
                    <span
                        :class="{
                            'negative-loot': notification.resources.metal < 0,
                            fade: notification.resources.metal == 0,
                        }"
                        v-text="$i18n.$n(notification.resources.metal)"
                    />

                    <o-resource resource="crystal" />
                    <span
                        :class="{
                            'negative-loot': notification.resources.crystal < 0,
                            fade: notification.resources.crystal == 0,
                        }"
                        v-text="$i18n.$n(notification.resources.crystal)"
                    />

                    <o-resource resource="deuterium" />
                    <span
                        :class="{
                            'negative-loot': notification.resources.deuterium < 0,
                            fade: notification.resources.deuterium == 0,
                        }"
                        v-text="$i18n.$n(notification.resources.deuterium)"
                    />

                    <span class="mdi mdi-sigma" />
                    <span
                        :class="{
                            'negative-loot': sum < 0,
                            fade: sum == 0,
                        }"
                        v-text="$i18n.$n(sum)"
                    />
                </div>
                <div class="text-grid" v-else>
                    <span v-text="$i18n.$t.extension.resources[ResourceType.metal]" />
                    <span
                        :class="{
                            'negative-loot': notification.resources.metal < 0,
                            fade: notification.resources.metal == 0,
                        }"
                        v-text="$i18n.$n(notification.resources.metal)"
                    />

                    <span v-text="$i18n.$t.extension.resources[ResourceType.crystal]" />
                    <span
                        :class="{
                            'negative-loot': notification.resources.crystal < 0,
                            fade: notification.resources.crystal == 0,
                        }"
                        v-text="$i18n.$n(notification.resources.crystal)"
                    />

                    <span v-text="$i18n.$t.extension.resources[ResourceType.deuterium]" />
                    <span
                        :class="{
                            'negative-loot': notification.resources.deuterium < 0,
                            fade: notification.resources.deuterium == 0,
                        }"
                        v-text="$i18n.$n(notification.resources.deuterium)"
                    />

                    <span v-text="$i18n.$t.extension.common.sum" />
                    <span
                        :class="{
                            'negative-loot': sum < 0,
                            fade: sum == 0,
                        }"
                        v-text="$i18n.$n(sum)"
                    />
                </div>
            </template>
        </template>
    </notification>
</template>

<script lang="ts">
    import { CombatTrackingNotificationMessageData } from '@/shared/messages/notifications';
import { ResourceType } from '@/shared/models/ogame/resources/ResourceType';
import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import Notification from '../Notification.vue';

    @Component({
        components: {
            Notification,
        }
    })
    export default class CombatTrackingNotification extends Vue {
        @Prop({ required: true, type: Object })
        private notification!: CombatTrackingNotificationMessageData;

        private readonly ResourceType = ResourceType;

        private get showSimplified() {
            return SettingsDataModule.settings.messageTracking.showSimplifiedResults;
        }

        private get title() {
            return this.$i18n.$t.extension.notifications.combatTracking.title(this.$i18n.$n(this.notification.count));
        }

        private get message() {
            return this.$i18n.$t.extension.notifications.combatTracking.message(this.$i18n.$n(this.notification.count));
        }

        private get hasLoot() {
            return Object.values(this.notification.resources).reduce((acc, cur) => acc + cur, 0) > 0;
        }

        private get sum() {
            return this.notification.resources.metal
                + this.notification.resources.crystal
                + this.notification.resources.deuterium;
        }
    }
</script>
<style lang="scss" scoped>
    .negative-loot {
        color: red;
    }

    .fade {
        color: rgba(white, 0.1);
    }

    .resources-grid {
        display: grid;
        grid-template-columns: repeat(2, 32px 1fr);
        row-gap: 4px;
        column-gap: 8px;
        align-items: center;

        .mdi {
            transform: scale(1.5);
            width: 24px;
            text-align: center;
            height: 20px;
        }

        .mdi,
        .o-resource {
            justify-self: center;
        }
    }

    .text-grid {
        display: grid;
        grid-template-columns: auto 1fr;
        row-gap: 4px;
        column-gap: 8px;
        align-items: center;
    }
</style>