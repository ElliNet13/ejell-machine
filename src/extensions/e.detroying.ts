import { Cell } from "@core/cells/cell";
import { CellType } from "@core/cells/cellType";
import { Direction } from "@core/cells/direction";
import { UpdateType } from "@core/grid/cellUpdates";
import { Slot } from "@core/slot";
import { playSound, getRandomDirection } from "@utils/custom";
import nukeSound from "/sounds/nuke-bomb.mp3?blob";

export function load() {
    const drill = CellType.create({
        id: "e.detroying.drill",
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
        id: "e.detroying.nuke",
        __rawId: 101,
        name: "The SuperNuke",
        description: "The trash cell and nuke cell mixed together, when you try to push it it clears the grid.",
        behavior: class Supernuke extends Cell {
            override push(dir: Direction, bias: number) {
                if (this.disabled) return super.push(dir, bias);
                this.grid.clear(this.grid.size);
                playSound(nukeSound)
                return null;
            }
        },
        textureName: "supernuke",
    });

    const cat = CellType.create({
        id: "e.detroying.cat",
        __rawId: 102,
        name: "Cat",
        description: "Moves forward one random direction cell and deletes all cells in the way. (Might delete itself, its a little glichy)",
        behavior: class MoverCell extends Cell {
            override update() {
                this.direction = getRandomDirection();
                const movePos = this.pos.mi(this.direction);
                if (movePos !== this.pos) {
                    this.grid.cells.delete(movePos);
                }
                super.push(this.direction, 1);
            }

            override push(dir: Direction, bias: number) {
                if (this.disabled) return super.push(dir, bias);
                return null;
            }
        },
        textureName: "cat",

        updateOrder: 3,
        updateType: UpdateType.Directional,
    });

    Slot.add(drill, supernuke, cat);
}