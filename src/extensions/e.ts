import { Cell } from "@core/cells/cell";
import { CellType } from "@core/cells/cellType";
import { Direction } from "@core/cells/direction";
import { UpdateType } from "@core/grid/cellUpdates";
import { Slot } from "@core/slot";

export function load() {
    const drill = CellType.create({
        id: "e.drill",
        __rawId: 100,
        name: "Drill",
        description: "Moves forward one cell and deletes all cells in the way.",
        behavior: class MoverCell extends Cell {
            override update() {
                this.grid.cells.delete(this.pos.mi(this.direction))
                super.push(this.direction, 1);
            }

            override push(dir: Direction, bias: number) {
                if (this.disabled) return super.push(dir, bias);
                return null;
            }
        },
        textureName: "drill",

        updateOrder: 3,
        updateType: UpdateType.Directional,
    });

    const supernuke = CellType.create({
        id: "e.nuke",
        __rawId: 101,
        name: "The SuperNuke",
        description: "The trash cell and nuke cell mixed together, when you try to push it it clears the grid.",
        behavior: class Supernuke extends Cell {
            override push(dir: Direction, bias: number) {
                if (this.disabled) return super.push(dir, bias);
                this.grid.clear(this.grid.size);
                return null;
            }
        },
        textureName: "supernuke",
        flip: d => d,
    });

    Slot.add(drill, supernuke);
}