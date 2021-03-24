import fakeData from "@/_fakeData.json";

import { Component, Vue } from 'vue-property-decorator';
import ExpoEvent from "@/models/expeditions/ExpoEvent";
import { startOfDay } from "date-fns";
import { migrateExpos_v0_v1 } from "@/migrations/migration_v0_v1";
import ExpoEventCollectionv0 from "@/models/v0/ExpoEventCollection";

@Component({})
class ExpoModule extends Vue {
    public readonly expos: ExpoEvent[] = [];

    private async created() {
        this.expos.splice(0);

        const expos = await new Promise<ExpoEvent[]>(resolve => {
            const migrated = migrateExpos_v0_v1(fakeData as ExpoEventCollectionv0);
            //TODO: load from chrome storage
            resolve(Object.values(migrated) as ExpoEvent[]);
        });
        this.expos.push(...expos);
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
}

export default new ExpoModule();