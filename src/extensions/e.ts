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

    Slot.add(drill);
}