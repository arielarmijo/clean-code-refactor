export interface EntityData {
    id: number;
}

export abstract class Entity implements EntityData {
    constructor(readonly id: number) {}

    equals(obj?: Entity): boolean {
        if (obj === null || obj === undefined) return false;
        if (obj === this) return true;
        if (!isEntity(obj)) return false;
        return obj.id === this.id;
    }
}

function isEntity(value: unknown): value is Entity {
    return value instanceof Entity;
}
