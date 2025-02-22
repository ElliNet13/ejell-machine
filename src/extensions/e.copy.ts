import { Cell } from "@core/cells/cell";
import { CellType } from "@core/cells/cellType";
import { Direction } from "@core/cells/direction";
import { UpdateType } from "@core/grid/cellUpdates";
import { Slot } from "@core/slot";

export function load() {
    const mover = CellType.create({
        id: "e.copy.mover",
        __rawId: 1001, // Copys start at 1000
        name: "Mover Copy",
        description: "Same as mover but with a green texture.",
        behavior: class MoverCell extends Cell {
            override update() {
                super.push(this.direction, 1);
            }

            override push(dir: Direction, bias: number) {
                if (this.disabled) return super.push(dir, bias);

                if (dir == this.direction) return super.push(dir, bias + 1);
                if (((dir + 2) & 3) == this.direction) return super.push(dir, bias - 1);
                return super.push(dir, bias);
            }
        },
        textureName: "movergreen",

        updateOrder: 3,
        updateType: UpdateType.Directional,
    });

    Slot.add(mover);
}