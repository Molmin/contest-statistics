import { readFileSync } from 'node:fs'
import { average, sum } from './utils'

export interface Problem {
    id: string
    title: string
    full_score: number
}

export interface Submission {
    submitter: string
    problem: string
    score: number
    status: string
    submitTime: number
    judgeTime: number
    codeSize: number
    maxMemory: number
    maxTime: number
    timeUsage: number
    countCases: number
    judgedCases: number
}

export class Contest {
    problems: Array<Problem> = []
    submissions: Array<Submission> = []
    start_time = 0
    end_time = 0
    user_count = 0
    users: string[] = []

    constructor(file: string) {
        const data = readFileSync(file).toString().split('\n')
        const users = new Set<string>()
        for (const line of data) {
            const values = line.split(',')
            if (values.length === 2) {
                this.start_time = +values[0]
                this.end_time = +values[1]
            }
            if (values.length === 3) {
                this.problems.push({ id: values[0], title: values[1], full_score: +values[2] })
            }
            if (values.length === 12) {
                this.submissions.push({
                    submitter: values[0],
                    problem: values[1],
                    score: +values[2],
                    status: values[3],
                    submitTime: +values[4],
                    judgeTime: this.problems.filter((problem) => problem.id === values[1])[0].title === '海亮学生人脉很广' ? +values[4] : +values[5],
                    codeSize: +values[6],
                    maxMemory: +values[7],
                    maxTime: +values[8],
                    timeUsage: +values[9],
                    countCases: +values[10],
                    judgedCases: +values[11],
                })
            }
        }
        for (const submission of this.submissions) {
            users.add(submission.submitter)
        }
        this.submissions = this.submissions.sort((x, y) => x.submitTime - y.submitTime)
        this.users = Array.from(users)
        this.user_count = users.size
    }

    fullScore(id: string) {
        return this.problems.filter((problem) => problem.id === id)[0].full_score
    }
    get scoreGrad() {
        const full = sum(this.problems.map((problem) => problem.full_score))
        return full > 5000 ? 2000 : 100
    }

    count_submission(fn: (submission: Submission) => boolean) {
        return this.submissions.filter(fn).length
    }

    getScoreTransformation(fn: (scores: number[]) => number) {
        const score: Record<string, Record<string, number>> = {}
        const result: number[] = []
        for (let i = 0, j = 0; i < (this.end_time - this.start_time) / (60 * 1000); i++) {
            while (j < this.submissions.length && this.submissions[j].submitTime <= this.start_time + i * 60 * 1000) {
                const submission = this.submissions[j]
                if (!score[submission.submitter]) score[submission.submitter] = {}
                score[submission.submitter][submission.problem] = Math.max(
                    score[submission.submitter][submission.problem] || 0,
                    submission.score / 100 * this.fullScore(submission.problem),
                )
                j++
            }
            result.push(fn(Object.entries(score).map((doc) => sum(Object.entries(doc[1]).map((x) => x[1])))))
        }
        return result
    }

    getScoreDistribution() {
        const result: Array<Array<string>> = []
        const score: Record<string, Record<string, number>> = {}
        let max_score = 0
        for (let i = 0, j = 0; i < (this.end_time - this.start_time) / (60 * 1000); i++) {
            while (j < this.submissions.length && this.submissions[j].submitTime <= this.start_time + i * 60 * 1000) {
                const submission = this.submissions[j]
                if (!score[submission.submitter]) score[submission.submitter] = {}
                score[submission.submitter][submission.problem] = Math.max(
                    score[submission.submitter][submission.problem] || 0,
                    submission.score / 100 * this.fullScore(submission.problem),
                )
                j++
            }
            for (const user in score) {
                const s = sum(Object.entries(score[user]).map((x) => x[1]))
                while (max_score < Math.ceil(s / this.scoreGrad)) {
                    max_score++
                    result.push([
                        `$[${max_score * this.scoreGrad - (this.scoreGrad - 1)}, ${max_score * this.scoreGrad}]$`,
                        `#text(\"${user}\")`,
                        `#text(\"${i} 分钟\")`,
                        '0',
                    ])
                }
            }
        }
        for (const user in score) {
            const s = sum(Object.entries(score[user]).map((x) => x[1]))
            for (let t = 0; t < Math.ceil(s / this.scoreGrad); t++) result[t][3] = (+result[t][3] + 1).toString()
        }
        return result.reverse()
    }

    getRanking() {
        const result: Record<string, number> = {}
        const score: Record<string, Record<string, number>> = {}
        for (const submission of this.submissions) {
            if (!score[submission.submitter]) score[submission.submitter] = {}
            score[submission.submitter][submission.problem] = Math.max(
                score[submission.submitter][submission.problem] || 0,
                submission.score / 100 * this.fullScore(submission.problem),
            )
            result[submission.submitter] = sum(Object.entries(score[submission.submitter]).map((x) => x[1]))
        }
        return Object.entries(result).sort((x, y) => y[1] - x[1]).slice(0, 5)
    }
    getSubmissionCountRanking(id = 'all') {
        const total: Record<string, number> = {}
        for (const submission of this.submissions) {
            if (id !== 'all' && submission.problem !== id) continue
            total[submission.submitter] = (total[submission.submitter] || 0) + 1
        }
        return Object.entries(total).sort((x, y) => y[1] - x[1]).slice(0, 5)
    }
    getSubmissionCodeLengthRanking(id = 'all') {
        const total: Record<string, number> = {}
        for (const submission of this.submissions) {
            if (id !== 'all' && (submission.problem !== id || submission.status !== 'AC')) continue
            if (id === 'all') total[submission.submitter] = (total[submission.submitter] || 0) + submission.codeSize
            else total[submission.submitter] = total[submission.submitter]
                ? Math.min(total[submission.submitter], submission.codeSize)
                : submission.codeSize
        }
        return Object.entries(total).sort((x, y) => id !== 'all' ? x[1] - y[1] : y[1] - x[1]).slice(0, 5)
    }
    getBestAlgorithmRanking(id: string) {
        const total: Record<string, [number, number]> = {}
        for (const submission of this.submissions) {
            if (submission.problem !== id || submission.status !== 'AC') continue
            if (!total[submission.submitter] || total[submission.submitter][0] > submission.maxTime
                || (total[submission.submitter][0] === submission.maxTime && total[submission.submitter][1] > submission.maxMemory)) {
                total[submission.submitter] = [submission.maxTime, submission.maxMemory]
            }
        }
        return Object.entries(total).sort((x, y) => x[1][0] !== y[1][0] ? x[1][0] - y[1][0] : x[1][1] - y[1][1]).slice(0, 5)
    }

    getProblemDatas() {
        return this.problems.map((problem) => '    [' + [
            problem.id, problem.full_score, `#text(\"${problem.title}\")`,
            this.users.filter((user) => this.count_submission((doc) => doc.submitter === user && doc.problem === problem.id && doc.status === 'AC')).length,
            `#text(\"${(this.users.filter((user) => this.count_submission((doc) => doc.submitter === user && doc.problem === problem.id && doc.status === 'AC')).length / this.user_count * 100).toFixed(2)}%\")`,
            `#text(\"${(this.users.filter((user) => {
                const docs = this.submissions.filter((doc) => doc.submitter === user && doc.problem === problem.id)
                return docs.length > 0 && docs[0].status === 'AC'
            }).length / this.user_count * 100).toFixed(2)}%\")`,
            `#text(\"${(this.users.filter((user) => this.count_submission((doc) => doc.submitter === user && doc.problem === problem.id && doc.score > 0)).length / this.user_count * 100).toFixed(2)}%\")`,
            average(this.users.map((user) => Math.max(...this.submissions.filter((doc) => doc.submitter === user && doc.problem === problem.id).map((doc) => doc.score), 0, 0))).toFixed(2),
            Math.max(...this.users.map((user) => Math.max(...this.submissions.filter((doc) => doc.submitter === user && doc.problem === problem.id).map((doc) => doc.score), 0, 0))),
        ].join('], [') + '],').join('\n')
    }
}
