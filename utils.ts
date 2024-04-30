export function sum(a: number[]) {
    let ret = 0
    for (const v of a) ret += v
    return ret
}

export function average(a: number[]) {
    if (a.length === 0) return 0
    else return sum(a) / a.length
}

export function grow_rate(from: number, to: number) {
    if (from === 0) return `0.00%`
    else return (to / from - 1).toFixed(2) + '%'
}

export function range(l: number, r: number) {
    const ret: number[] = []
    for (let i = l; i <= r; i++)ret.push(i)
    return ret
}
