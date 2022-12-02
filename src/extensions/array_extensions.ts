export {}
declare global {
    interface Array<T> {
        /**
         * Resizes an array, returning the result of the operation.
         * @param size New size of the array
         * @param generator Generator for new elements
         */
        resize(size: number, generator: (index: number) => T) : ResizeResult<T>;
    }
}

export enum ResizeOperation {
    Shrunk,
    Expanded,
    None
}

export type ResizeResult<T> = { operation: ResizeOperation, delta: T[] };

if(!Array.prototype.resize) {
    Array.prototype.resize = function(size, generator) {
        let initialLength = this.length;

        if(size == initialLength) {
            return { operation: ResizeOperation.None, delta: [] };
        } else if(size > initialLength) {
            for(let i = initialLength; i < size; i++) {
                this.push(generator(i));
            }
            return { operation: ResizeOperation.Expanded, delta: this.slice(initialLength) };
        } else {
            return { operation: ResizeOperation.Shrunk, delta: this.splice(size) };
        }
    };
}