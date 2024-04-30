import { readFileSync } from 'node:fs'
import { sum } from './utils'

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

    constructor(file: string) {
        const data = readFileSync(file).toString().split('\n')
        const users = new Set()
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
                    judgeTime: +values[5],
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
        this.user_count = users.size
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
                    submission.score,
                )
                j++
            }
            result.push(fn(Object.entries(score).map((doc) => sum(Object.entries(doc[1]).map((x) => x[1])))))
        }
        return result
    }
}
