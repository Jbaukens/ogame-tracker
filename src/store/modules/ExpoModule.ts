import { Component, Vue } from 'vue-property-decorator';
import ExpoEvent from "@/models/expeditions/ExpoEvent";
import { startOfDay } from "date-fns";
import ExpoEventCollection from "@/models/expeditions/ExpoEventCollection";
import asyncChromeStorage from "@/utils/asyncChromeStorage";
import OgameMetaData from "@/models/ogame/OgameMetaData";

@Component({})
class ExpoModule extends Vue {
    public readonly expos: ExpoEvent[] = [];
    public get exposById(): ExpoEventCollection {
        const expoEvents: ExpoEventCollection = {};
        this.expos.forEach(expo => expoEvents[expo.id] = expo);

        return expoEvents;
    } 

    private async created() {
        const exposById: ExpoEventCollection = await asyncChromeStorage.get(this.storageKey) ?? {};
        this.expos.push(...Object.values(exposById));
    }

    public get firstExpo(): ExpoEvent | null {
        return this.expos.reduce(
            (acc, cur) => acc == null || (acc.date > cur.date) ? cur : acc,
            null as ExpoEvent | null);
    }

    public get byDay() {
        return this.expos.reduce(
            (acc, expo) => {
                const day = startOfDay(expo.date).getTime();
                if (acc[day] == null) {
                    acc[day] = [];
                }
                acc[day]!.push(expo);
                return acc;
            },
            {} as { [key: number]: ExpoEvent[] | undefined }
        );
    }

    public add(expo: ExpoEvent) {
        this.$set(this.exposById, expo.id, expo);
        this.expos.push(expo);
    }

    public get storageKey(): string {
        return `${OgameMetaData.storageKeyPrefix}-expoEvents`;
    }

    public async save() {
        await asyncChromeStorage.set(this.storageKey, this.exposById);
    }
}

export default new ExpoModule();