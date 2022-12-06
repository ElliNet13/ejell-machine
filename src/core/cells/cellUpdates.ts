import type { Cell } from "./cell";
import type { CellType } from "./cellType";
import { Extension } from "../extensions";
import type { CellGrid } from "./grid";
import { Direction } from "../coord/direction";

export function doStep(grid: CellGrid, _subtick: boolean) {
    if ((updateOrder as any).eee) {
        (updateOrder as any).eee = false;
        updateOrder.push(...Extension.getUpdateOrder());
    }

    for (const k in grid.cells.__object) {
        const cell = grid.cells.__object[k];
        cell.oldPosition = cell.pos;
        cell.rotationOffset = 0;
    }

    console.time("update");
    for (const updateType of updateOrder) {
        switch (updateType[1]) {
            case UpdateType.Directional:
                for (const dir of directionalUpdateOrder) {
                    // VERSION 1
                    // // linked list
                    // let cells: ListNode<Cell> = null;
                    // for (const cell of grid.cells.values()) {
                    //     if (cell.type == updateType[0] && cell.direction == dir) {
                    //         const cellPosition = order[dir](cell);

                    //         if (cells == null) cells = { e: cell, o: cellPosition, n: null };
                    //         else {
                    //             let p: ListNode<Cell> = null as any;
                    //             let c: ListNode<Cell> = cells as any;

                    //             while (c != null && c.o < cellPosition) {
                    //                 p = c;
                    //                 c = c.n;
                    //             }

                    //             if (p) p.n = { e: cell, o: cellPosition, n: c };
                    //             else cells = { e: cell, o: cellPosition, n: c };
                    //         }
                    //     }
                    // }

                    // while (cells) {
                    //     if (!cells.e.deleted && !cells.e.disabled && !cells.e.updated) {
                    //         cells.e.update();
                    //         cells.e.updatedIn = grid.tickCount;
                    //     }
                    //     cells = cells.n;
                    // }

                    // VERSION 2
                    // const cells: Cell[] = [];
                    // for (const cell of grid.cells.values()) {
                    //     if (cell.type == updateType[0] && cell.direction == dir) {
                    //         cells.push(cell);
                    //     }
                    // }
                    // sortBy(cells, order[dir]);
                    // for (const cell of cells) {
                    //     if (!cell.deleted && !cell.disabled && !cell.updated) {
                    //         cell.update();
                    //         cell.updatedIn = grid.tickCount;
                    //     }
                    // }

                    // VERSION 3
                    // const cells: Cell[] = [];
                    // let i = 0;
                    // for (const cell of grid.cells.values()) {
                    //     if (cell.type == updateType[0] && cell.direction == dir) {
                    //         cells[i++] = cell;
                    //     }
                    // }
                    // cells.length = i;
                    // sortBy(cells, order[dir]);
                    // for (let i = 0; i < cells.length; i++) {
                    //     const cell = cells[i];
                    //     if (!cell.deleted && !cell.disabled && !cell.updated) {
                    //         cell.update();
                    //         cell.updatedIn = grid.tickCount;
                    //     }
                    // }

                    // VERSION 4
                    const cells: Cell[] = [];
                    let i = 0;
                    for (const key in grid.cells.__object) {
                        const cell = grid.cells.__object[key];
                        if (cell.type == updateType[0] && cell.direction == dir) {
                            cells[i++] = cell;
                        }
                    }
                    cells.length = i;

                    switch (dir) {
                        case Direction.Right:
                            cells.sort((a, b) => b.pos.x - a.pos.x);
                            break;
                        case Direction.Down:
                            cells.sort((a, b) => a.pos.y - b.pos.y);
                            break;
                        case Direction.Left:
                            cells.sort((a, b) => a.pos.x - b.pos.x);
                            break;
                        case Direction.Up:
                            cells.sort((a, b) => b.pos.y - a.pos.y);
                            break;
                    }

                    for (let i = 0; i < cells.length; i++) {
                        const cell = cells[i];
                        if (!cell.deleted && !cell.disabled && !cell.updated) {
                            cell.update();
                            cell.updatedIn = grid.tickCount;
                        }
                    }
                }

                break;
            case UpdateType.Random:
                for (const cell of grid.cells.values())
                    if (cell.type == updateType[0] && !cell.deleted && !cell.disabled && !cell.updated) {
                        cell.update();
                        cell.updatedIn = grid.tickCount;
                    }
                break;
        }
    }
    console.timeEnd("update");
}

export enum UpdateType {
    Directional,
    Random,
}

export const directionalUpdateOrder = [
    Direction.Right,
    Direction.Left,
    Direction.Up,
    Direction.Down,
];

export const order = {
    [Direction.Right]: (cell: Cell) => -cell.pos.x,
    [Direction.Down]: (cell: Cell) => cell.pos.y,
    [Direction.Left]: (cell: Cell) => cell.pos.x,
    [Direction.Up]: (cell: Cell) => -cell.pos.y,
};

export const updateOrder: [CellType, UpdateType][] = Object.assign([], { eee: true });

export type ListNode<T> = {
    e: T,
    o: number,
    n: ListNode<T>,
} | null;


// function sortBy<T>(array: T[], mapper: (item: T) => number) {
//     array.sort((a, b) => mapper(a) - mapper(b));
// }
