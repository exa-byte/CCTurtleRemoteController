interface TurtleState {
    id: number,
    label: "",
    loc: Vec,
    rot: number,
    inv: ItemStack[],
    selectedSlot: number,
    view: {
        front: 0,
        top: 0,
        bottom: 0
    },
    fuelLevel: number,
    fuelLimit: number,
    modified?: number,
}

interface SimState {
    turtles: { [id: string]: TurtleState },
    world: { [locString: string]: Block },
}

interface Block {
    name: string,
    metadata: number,
    state?: Object,
    tags?: Object,
    inventory?: Inventory,
    inventorySize?: number,
}

interface ItemStack {
    count: number,
    name: string,
    damage?: number,
}

interface Item {
    name: string,
    damage: number,
}

type Vec = {
    x: number,
    y: number,
    z: number,
}

type Inventory = [{ name: string, count: number }]

export { TurtleState, SimState, Block, ItemStack, Item, Vec, Inventory };