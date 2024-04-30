export function sum(a: number[]) {
    let ret = 0
    for (const v of a) ret += v
    return ret
}

export function grow_rate(from: number, to: number) {
    if (from === 0) return `0.00%`
    else return (to / from - 1).toFixed(2) + '%'
}
