export function getLifeformLevel(experience: number) {
    for(let level = 0; ; level++) {
        const expForLevel = getExperienceNeededForLevel(level + 1);
        if(expForLevel > experience) {
            return level;
        }
    }
}

export function getExperienceNeededForLevel(level: number) {
    return 5_500 * level * 2 ** (level * 2) + 1;
}