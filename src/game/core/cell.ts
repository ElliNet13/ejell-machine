import type { Position } from "./coord/positions";
import type { UpdateType } from "./cellUpdates";
import { CellGrid } from "./grid";
import { Direction } from "./coord/direction";

let cellid = 0;

export class Cell {
    public deleted = false;
    public disabledIn = -1;
    public get disabled(): boolean {
        return this.disabledIn == this.grid.tickCount;
    }
    public updatedIn = -1;
    public get updated(): boolean {
        return this.updatedIn == this.grid.tickCount;
    }
    id = cellid++;
    readonly initialPosition: Position;
    readonly initialDirection: Direction;

    constructor(public pos: Position, readonly type: CellType, public direction: Direction, readonly grid: CellGrid, readonly generated: boolean) {
        this.initialPosition = pos;
        this.initialDirection = direction;
        grid.cellList.push(this);
    }

    public get options(): CellData {
        return [this.type, this.direction];
    }

    rm() {
        if (this.deleted) return;
        this.grid.cells.delete(this.pos);
        if (this.generated || this.grid.initial) {
            const i = this.grid.cellList.indexOf(this);
            if (i >= 0) this.grid.cellList.splice(i, 1);
        }
        this.deleted = true;
    }

    update() {}

    reset() {
        if (this.generated) {
            const i = this.grid.cellList.indexOf(this);
            if (i >= 0) this.grid.cellList.splice(i, 1);
            this.deleted = true;
        }
        else {
            this.deleted = false;
            this.grid.cells.set(this.initialPosition, this);
            this.pos = this.initialPosition;
            this.direction = this.initialDirection;
        }

        this.disabledIn = -1;
        this.updatedIn = -1;
    }

    setPosition(pos: Position) {
        if (this.deleted) return;
        this.grid.cells.delete(this.pos);
        this.grid.cells.set(pos, this);
        this.pos = pos;
    }

    getCellTo(dir: Direction): Movement | null {
        const pos = this.pos.mi(dir);
        if (!this.grid.isInfinite && !this.grid.size.contains(pos)) return null;
        const cell = this.grid.cells.get(pos);
        if (!cell) return [pos, dir];
        return cell.getPos(dir);
    }

    getPos(dir: Direction): Movement | null {
        return [this.pos, dir];
    }

    push(dir: Direction, bias: number): PushResult {
        if (bias < 1) return false;

        const target = this.getCellTo(dir);
        if (!target) return false;

        const [pos, pushDir] = target;

        const tc = this.grid.cells.get(pos);
        if (tc == null) {
            this.setPosition(pos);
            if (dir != pushDir) this.direction = (this.direction + (pushDir - dir) + 4) % 4;
            return true;
        }

        const res = tc.push(pushDir, bias);
        if (res) {
            this.setPosition(pos);
            if (dir != pushDir) this.direction = (this.direction + (pushDir - dir) + 4) % 4;
            return true;
        }
        if (res === null) {
            this.rm();
            return true;
        }
        return false;
    }

    rotate(amount: number) {
        this.direction = ((this.direction + amount) % 4 + 4) % 4;
    }

    setRotation(amount: number) {
        this.direction = amount % 4;
    }

    disable() {
        this.disabledIn = this.grid.tickCount;
    }
}

export type PushResult = boolean | null;
export type Movement = [Position, Direction];

export class CellType {
    static types: CellType[] = [];

    private constructor(public options: Readonly<CellTypeOptions>) {}

    public get data() {
        return this.options.data;
    }

    public get behavior() {
        return this.options.behavior;
    }

    // onFlip(fn: (cell: CellData, horizontal: boolean) => CellData) {
    //     this.options.flip = fn;
    //     return this;
    // }


    flip(cell: Cell, horizontal: boolean): CellData {
        if (this.options.flip) return this.options.flip([cell.type, cell.direction], horizontal);
        else {
            return [
                cell.type,
                horizontal ?
                    cell.direction == Direction.Right ? Direction.Left
                        : cell.direction == Direction.Left ? Direction.Right : cell.direction
                    : cell.direction == Direction.Up ? Direction.Down
                        : cell.direction == Direction.Down ? Direction.Up : cell.direction
            ];
        }
    }
    merge(self: Cell, other: Cell) {
        if (this.options.merge) return this.options.merge(self.options, other.options);
        else return other.options;
    }

    _newCell(grid: CellGrid, pos: Position, dir: Direction, generated: boolean) {
        return new this.behavior(pos, this, dir, grid, generated);
    }

    static create(options: CellTypeOptions) {
        const t = new CellType(options);
        CellType.types.push(t);
        return t;
    }

    static flipOneWay = (data: CellData, horizontal: boolean) => {
        const [type, dir] = data;
        return [type, horizontal ?
            dir == Direction.Right ? Direction.Left
                : dir == Direction.Left ? Direction.Right : dir
            : dir == Direction.Up ? Direction.Down
                : dir == Direction.Down ? Direction.Up : dir
        ] as CellData;
    }
    static flipTwoWay = (data: CellData, horizontal: boolean) => {
        const horizontalTable = {
            [Direction.Right]: Direction.Down,
            [Direction.Down]: Direction.Right,
            [Direction.Left]: Direction.Up,
            [Direction.Up]: Direction.Left,
        };
        const verticalTable = {
            [Direction.Right]: Direction.Up,
            [Direction.Down]: Direction.Left,
            [Direction.Left]: Direction.Down,
            [Direction.Up]: Direction.Right,
        };
        const [type, dir] = data;
        return [type, horizontal ? horizontalTable[dir] : verticalTable[dir]] as CellData;
    }
}

export interface CellTypeOptions {
    behavior: typeof Cell;
    textureName: string;
    flip?(cell: CellData, horizontal: boolean): CellData;
    merge?(self: CellData, other: CellData): CellData;
    data?: any;
    updateType?: UpdateType;
    updateOrder?: number;
}

export type CellData = [CellType, Direction];
