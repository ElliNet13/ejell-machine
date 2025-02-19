import { Cell } from "@core/cells/cell";
import { CellType } from "@core/cells/cellType";
import { Direction } from "@core/cells/direction";
import { UpdateType } from "@core/grid/cellUpdates";
import { Slot } from "@core/slot";

export function load() {
        const mover2 = CellType.create({
            id: "e.mover2",
            __rawId: 200, // Start with 200
            name: "Mover 2",
            description: "Moves forward two cells and pushes all cells in the way.",
            behavior: class MoverCell extends Cell {
                override update() {
                    super.push(this.direction, 1);
                }
    
                override push(dir: Direction, bias: number) {
                    if (this.disabled) return super.push(dir, bias);
                    for (let i = 0; i < 2; i++) {
                        
                        if (dir == this.direction) return super.push(dir, bias + 1);
                        if (((dir + 2) & 3) == this.direction) return super.push(dir, bias - 1);

                    }
                    return super.push(dir, bias);
                }
            },
            textureName: "mover2",
    
            updateOrder: 3,
            updateType: UpdateType.Directional,
        });

    Slot.add(mover2);
}