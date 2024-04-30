import { writeFileSync } from 'node:fs'
import { Contest } from './contest'
import { render } from './renderer'
import { grow_rate, sum } from './utils'

const contestIds = [
    '2023_p', '2023_r', '2023_t',
    '2024_p', '2024_r', '2024_t',
]

const contests: Record<string, Contest> = {}

for (const id of contestIds) contests[id] = new Contest(`data/${id}.csv`)

writeFileSync('dist/result.typ', [
    render('header.typ', {}),
    render('summary.typ', {
        ...Object.fromEntries(contestIds.map((id) => [`${id}.user_count`, contests[id].user_count])),
        ...Object.fromEntries(contestIds.filter((id) => id.startsWith('2024'))
            .map((id) => [`${id}.user_grow_rate`, grow_rate(contests[id.replace('2024', '2023')].user_count, contests[id].user_count)])),
        '2024.user_count': sum(contestIds.filter((id) => id.startsWith('2024')).map((id) => contests[id].user_count)),
        '2023.user_count': sum(contestIds.filter((id) => id.startsWith('2023')).map((id) => contests[id].user_count)),
        '2024.user_grow_rate': grow_rate(
            sum(contestIds.filter((id) => id.startsWith('2023')).map((id) => contests[id].user_count)),
            sum(contestIds.filter((id) => id.startsWith('2024')).map((id) => contests[id].user_count)),
        ),
    }),
].join('\n'))
