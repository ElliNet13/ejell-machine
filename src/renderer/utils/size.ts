import { Position } from "./positions";

export class Size {
    width: number;
    height: number;
    bottom: number;
    left: number;

    constructor(wh: number);
    constructor(width: number, height: number);
    constructor(width: number, height: number, bottom: number, left: number);
    constructor(wh: number, height?: number, bottom: number = 0, left: number = 0) {
        if (height == undefined) {
            this.width = wh;
            this.height = wh;
        }
        else {
            this.width = wh;
            this.height = height;
        }

        this.bottom = bottom;
        this.left = left;
    }

    contains(pos: Position) {
        if (this.width == 0 || this.height == 0) {
            return true;
        }
        return pos.x >= this.left &&
               pos.x <  this.left + this.width &&
               pos.y >= this.bottom &&
               pos.y <  this.bottom + this.height;
    }
}
