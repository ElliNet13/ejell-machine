import { Cell } from "@core/cells/cell";
import { UpdateType } from "@core/grid/cellUpdates";
import { Direction } from "@core/cells/direction";
import { CellType } from "@core/cells/cellType";
import { Slot } from "@core/slot";

export function load() {
    const split4 = CellType.create({
        id: "e.split4",
        __rawId: 200, // I will have my cells start at 200 and go up
        name: "Split4",
        description: "Deletes the incoming cell and duplicates it to all sides.",
        behavior: class Split4Cell extends Cell {
            override update() {
                const source = this.getCellTo(this.direction);
                if (!source) return;
    
                const [sourcePos, _] = source;
                const sourceCell = this.grid.cells.get(sourcePos);
                if (!sourceCell) return;
    
                // Delete the incoming cell
                this.grid.deleteCell(sourcePos);
    
                // Duplicate the incoming cell to all four directions
                const directions = [Direction.Up, Direction.Right, Direction.Down, Direction.Left];
                directions.forEach((dir) => {
                    const [targetPos, targetDir] = this.getCellTo(dir);
                    const targetCell = this.grid.cells.get(targetPos);
    
                    if (targetCell) {
                        targetCell.push(targetDir, 1);
                    }
    
                    const cell = this.grid.loadCell(targetPos, sourceCell.type, sourceCell.direction + targetDir - this.direction);
                    if (cell) cell.oldPosition = this.pos;
                });
            }
        },
        textureName: "split4",
    
        updateOrder: 1,
        updateType: UpdateType.Directional,
    });
    

    Slot.add(split4);
}