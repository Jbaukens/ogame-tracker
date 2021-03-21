import VueI18n from "vue-i18n";
import Vue from 'vue';
import messages from "./messages";

Vue.use(VueI18n);

export default new VueI18n({
    locale: 'de',
    fallbackLocale: 'de',
    messages: messages,
    dateTimeFormats: {
        de: {
            short: {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }
        },
    },
});