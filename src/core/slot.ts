import { writable, type Writable } from "svelte/store";
import type { CellType } from "@core/cells/cellType";
import { Registry } from "./registry";

export class Slot {
    items: CellType[];
    index: number = 0;
    menu = false;

    get currentItem() {
        return this.items[this.index];
    }

    constructor(items: CellType[]) {
        this.items = items;
    }

    next() {
        this.index = (this.index + 1) % this.items.length;
    }

    static add(...t: (CellType | CellType[])[]): void {
        Registry.registerSlot(new Slot(t.flatMap(t => Array.isArray(t) ? t : [t])));
    }
}

export class SlotHandler {
    public slots: Writable<SlotData[]>;
    public currentCell: Writable<CellType>;
    public currentSlot = 0;
    private _containedSlots!: Slot[];

    constructor(slots: Slot[]) {
        this.slots = writable([]);
        this.currentCell = writable(slots[0].currentItem);
        this._containedSlots = slots;
        this._reload();
    }

    public get containedSlots() {
        return this._containedSlots;
    }
    public set containedSlots(slots: Slot[]) {
        this._containedSlots = slots;
        this.currentSlot = Math.min(this.currentSlot, this.containedSlots.length);
        this._reload();
    }

    public getSlotData() {
        return this.containedSlots.map((slot, index) => ({
            index,
            currentItem: slot.currentItem,
            isActive: index == this.currentSlot,
            slot,
            openMenu: slot.menu,
        }));
    }

    public next() {
        this.currentSlot = (this.currentSlot + 1) % this.containedSlots.length;
        this._reload();
    }

    public prev() {
        this.currentSlot = (this.currentSlot - 1 + this.containedSlots.length) % this.containedSlots.length;
        this._reload();
    }

    public to(index: number) {
        this.currentSlot = index % this.containedSlots.length;
        this._reload();
    }

    public toCell(index: number) {
        this.containedSlots[this.currentSlot].index = index;
        this._reload();
    }

    public menu(open: boolean) {
        this.containedSlots.forEach(slot => slot.menu = false);
        if (this.containedSlots[this.currentSlot].items.length > 1) {
            this.containedSlots[this.currentSlot].menu = open;
        }
        this._reload();
    }

    private _reload() {
        this.currentCell.set(this.containedSlots[this.currentSlot].currentItem);
        this.slots.set(this.getSlotData());
    }
}

export type SlotData = {
    index: number,
    currentItem: CellType,
    isActive: boolean,
    slot: Slot,
    openMenu: boolean,
};
