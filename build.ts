import { writeFileSync } from 'node:fs'
import { Contest } from './contest'
import { render } from './renderer'
import { average, grow_rate, range, sum } from './utils'

const contestIds = [
    '2023_p', '2023_r', '2023_t',
    '2024_p', '2024_r', '2024_t',
]
const submission_status = ['AC', 'WA', 'TLE', 'MLE', 'RE', 'CE']
const contest_startTime: Record<number, number> = { 2023: 1682814600000, 2024: 1682814600000 }

function getYear(year: string | number) {
    return contestIds.filter((id) => id.startsWith(year.toString()))
}

const contests: Record<string, Contest> = {}

for (const id of contestIds) contests[id] = new Contest(`data/${id}.csv`)

writeFileSync('dist/result.typ', [
    render('summary.typ', {
        ...Object.fromEntries(contestIds.map((id) => [`${id}.user_count`, contests[id].user_count])),
        ...Object.fromEntries(getYear(2024)
            .map((id) => [`${id}.user_grow_rate`, grow_rate(contests[id.replace('2024', '2023')].user_count, contests[id].user_count)])),
        '2024.user_count': sum(getYear(2024).map((id) => contests[id].user_count)),
        '2023.user_count': sum(getYear(2023).map((id) => contests[id].user_count)),
        '2024.user_grow_rate': grow_rate(
            sum(getYear(2023).map((id) => contests[id].user_count)),
            sum(getYear(2024).map((id) => contests[id].user_count)),
        ),
    }),
    render('judge.typ', {
        count_submission: sum(getYear(2023).map((id) => contests[id].count_submission(() => true))),
        count_submission_compile_successfully: sum(getYear(2023).map((id) => contests[id].count_submission((doc) => doc.status !== 'CE'))),
        count_submission_ac: sum(getYear(2023).map((id) => contests[id].count_submission((doc) => doc.status === 'AC'))),
        judge_testcase_count: sum(getYear(2023).flatMap((id) => contests[id].submissions.map((doc) => doc.judgedCases))),
        judge_testcase_ignore_count: sum(getYear(2023).flatMap((id) => contests[id].submissions.map((doc) => doc.countCases - doc.judgedCases))),
        judge_sum_time: sum(getYear(2023).flatMap((id) => contests[id].submissions.map((doc) => doc.timeUsage))).toFixed(2),
        ...Object.fromEntries(submission_status.map((status) => [`count_${status}`, sum(getYear(2023).map((id) => contests[id].count_submission((doc) => doc.status === status)))])),
        ...Object.fromEntries(submission_status.map((status) => [`rate_${status}`, (sum(getYear(2023).map((id) => (contests[id].count_submission((doc) => doc.status === status)))) / sum(getYear(2023).map((id) => contests[id].count_submission(() => true))) * 100).toFixed(0)])),
        ...Object.fromEntries([2024, 2023].map((year) => [`${year}.judge_count`, range(0, 180)
            .map((i) => sum(getYear(year).map((id) => contests[id].count_submission((doc) => contest_startTime[year] + (i - 10) * 60 * 1000 <= doc.submitTime && doc.submitTime <= contest_startTime[year] + i * 60 * 1000)))).join(', ')])),
        ...Object.fromEntries([2024, 2023].map((year) => [`${year}.judge_wait`, range(0, 180)
            .map((i) => (average(getYear(year).flatMap((id) => contests[id].submissions.filter((doc) => contest_startTime[year] + (i - 10) * 60 * 1000 <= doc.submitTime && doc.submitTime <= contest_startTime[year] + i * 60 * 1000).map((doc) => doc.judgeTime - doc.submitTime))) / 1000).toFixed(2)).join(', ')])),
    }),
].join('\n#pagebreak()\n\n'))
