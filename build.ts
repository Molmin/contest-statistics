import { writeFileSync } from 'node:fs'
import { Contest } from './contest'
import { render } from './renderer'
import { average, grow_rate, range, sum } from './utils'

const contestIds = [
    '2023_t', '2023_p', '2023_r',
    '2024_t', '2024_p', '2024_r',
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
        submission_code_length: (sum(getYear(2023).flatMap((id) => contests[id].submissions.map((doc) => doc.codeSize))) / 1024 / 1024).toFixed(3),
        count_submission_compile_successfully: sum(getYear(2023).map((id) => contests[id].count_submission((doc) => doc.status !== 'CE'))),
        count_submission_ac: sum(getYear(2023).map((id) => contests[id].count_submission((doc) => doc.status === 'AC'))),
        judge_testcase_count: sum(getYear(2023).flatMap((id) => contests[id].submissions.map((doc) => doc.judgedCases))),
        judge_testcase_ignore_count: sum(getYear(2023).flatMap((id) => contests[id].submissions.map((doc) => doc.countCases - doc.judgedCases))),
        judge_sum_time: (sum(getYear(2023).flatMap((id) => contests[id].submissions.map((doc) => doc.timeUsage))) / 60 / 1000).toFixed(2),
        ...Object.fromEntries(submission_status.map((status) => [`count_${status}`, sum(getYear(2023).map((id) => contests[id].count_submission((doc) => doc.status === status)))])),
        ...Object.fromEntries(submission_status.map((status) => [`rate_${status}`, (sum(getYear(2023).map((id) => (contests[id].count_submission((doc) => doc.status === status)))) / sum(getYear(2023).map((id) => contests[id].count_submission(() => true))) * 100).toFixed(0)])),
        ...Object.fromEntries([2024, 2023].map((year) => [`${year}.judge_count`, range(0, 180)
            .map((i) => sum(getYear(year).map((id) => contests[id].count_submission((doc) => contest_startTime[year] + (i - 10) * 60 * 1000 <= doc.submitTime && doc.submitTime <= contest_startTime[year] + i * 60 * 1000)))).join(', ')])),
        ...Object.fromEntries([2024, 2023].map((year) => [`${year}.judge_wait`, range(0, 180)
            .map((i) => (average(getYear(year).flatMap((id) => contests[id].submissions.filter((doc) => contest_startTime[year] + (i - 10) * 60 * 1000 <= doc.submitTime && doc.submitTime <= contest_startTime[year] + i * 60 * 1000).map((doc) => doc.judgeTime - doc.submitTime))) / 1000).toFixed(2)).join(', ')])),
    }),
    ...getYear(2023).map((contestId) => [contestId, contests[contestId]] as [string, Contest]).flatMap(([contestId, contest]) => {
        const max_score = contest.getScoreTransformation((a: number[]) => Math.max(...a, 0, 0))
        const average_score = contest.getScoreTransformation((a: number[]) => +average(a).toFixed(2))
        const ranking = contest.getRanking()
        return [
            render('level_summary.typ', {
                contest_time_length_hour: (contest.end_time - contest.start_time) / (3600 * 1000),
                contest_time_length: (contest.end_time - contest.start_time) / (60 * 1000),
                level_name: contestId.endsWith('t') ? '提高' : contestId.endsWith('p') ? '普及' : '入门',
                level_problems_count: contest.problems.length,
                best_user: ranking[0][1],
                max_score_value: max_score[max_score.length - 1],
                average_score_value: average_score[average_score.length - 1],
                ranking: ranking.map((line, index) => `    [${index + 1}], [#text(\"${line[0]}\")], [${line[1]}],`).join('\n'),
                user_count: contest.user_count,
                submission_count: contest.submissions.length,
                submission_code_length: (sum(contest.submissions.map((doc) => doc.codeSize)) / 1024 / 1024).toFixed(3),
                count_submission_compile_successfully: contest.count_submission((doc) => doc.status !== 'CE'),
                count_submission_ac: contest.count_submission((doc) => doc.status === 'AC'),
                judge_testcase_count: sum(contest.submissions.map((doc) => doc.judgedCases)),
                judge_testcase_ignore_count: sum(contest.submissions.map((doc) => doc.countCases - doc.judgedCases)),
                judge_sum_time: (sum(contest.submissions.map((doc) => doc.timeUsage)) / 60 / 1000).toFixed(2),
                ...Object.fromEntries(submission_status.map((status) => [`count_${status}`, contest.count_submission((doc) => doc.status === status)])),
                ...Object.fromEntries(submission_status.map((status) => [`rate_${status}`, (contest.count_submission((doc) => doc.status === status) / contest.count_submission(() => true) * 100).toFixed(0)])),
                max_score: max_score.join(', '),
                average_score: average_score.join(', '),
                score_distribution: contest.getScoreDistribution().map((line) => `    ${line.map((column) => `[${column}]`).join(', ')},`).join('\n'),
                submission_count_ranking: contest.getSubmissionCountRanking().map((line, index) => `    [${index + 1}], [#text(\"${line[0]}\")], [${line[1]}],`).join('\n'),
                submission_code_length_ranking: contest.getSubmissionCodeLengthRanking().map((line, index) => `    [${index + 1}], [#text(\"${line[0]}\")], [#text(\"${(line[1] / 1024).toFixed(2)} KiB\")],`).join('\n'),
                problem_datas: contest.getProblemDatas(),
            }),
            ...contest.problems.map((problem) => render('problem.typ', {
                problem_id: problem.id,
                problem_title: problem.title,
                full_score: problem.full_score,
                user_count: contest.users.filter((user) => contest.count_submission((doc) => doc.problem === problem.id && doc.submitter === user)).length,
                code_length: (sum(contest.submissions.filter((doc) => doc.problem === problem.id).map((doc) => doc.codeSize)) / 1024).toFixed(3),
                submission_count: contest.count_submission((doc) => doc.problem === problem.id),
                compile_successfully: contest.count_submission((doc) => doc.problem === problem.id && doc.status !== 'CE'),
                accepted_count: contest.users.filter((user) => contest.count_submission((doc) => doc.problem === problem.id && doc.submitter === user && doc.status === 'AC')).length,
                ac_rate: (contest.users.filter((user) => contest.count_submission((doc) => doc.problem === problem.id && doc.submitter === user && doc.status === 'AC')).length / contest.user_count * 100).toFixed(2),
                once_ac_rate: (contest.users.filter((user) => {
                    const docs = contest.submissions.filter((doc) => doc.problem === problem.id && doc.submitter === user)
                    return docs.length > 0 && docs[0].status === 'AC'
                }).length / contest.user_count * 100).toFixed(2),
                get_score_rate: (contest.users.filter((user) => contest.count_submission((doc) => doc.problem === problem.id && doc.submitter === user && doc.score > 0)).length / contest.user_count * 100).toFixed(2),
                average_score: average(contest.users.map((user) => Math.max(...contest.submissions.filter((doc) => doc.problem === problem.id && doc.submitter === user).map((doc) => doc.score), 0, 0))).toFixed(2),
                max_score: Math.max(...contest.users.map((user) => Math.max(...contest.submissions.filter((doc) => doc.problem === problem.id && doc.submitter === user).map((doc) => doc.score), 0, 0))),
                ...Object.fromEntries(submission_status.map((status) => [`count_${status}`, contest.count_submission((doc) => doc.status === status && doc.problem === problem.id)])),
                ...Object.fromEntries(submission_status.map((status) => [`rate_${status}`, (contest.count_submission((doc) => doc.status === status && doc.problem === problem.id) / contest.count_submission((doc) => doc.problem === problem.id) * 100).toFixed(0)])),
                submission_count_ranking: contest.getSubmissionCountRanking(problem.id).map((line, index) => `    [${index + 1}], [#text(\"${line[0]}\")], [${line[1]}],`).join('\n'),
                code_length_ranking: contest.getSubmissionCodeLengthRanking(problem.id).map((line, index) => `    [${index + 1}], [#text(\"${line[0]}\")], [${(+line[1] / 1024).toFixed(2)} KiB],`).join('\n'),
                best_algo_ranking: contest.getBestAlgorithmRanking(problem.id).map((line, index) => `    [${index + 1}], [#text(\"${line[0]}\")], [${line[1][0].toFixed(2)} ms], [${(+line[1][1] / 1024).toFixed(2)} KiB],`).join('\n'),
            }))
        ]
    })
].join('\n#pagebreak()\n\n'))
