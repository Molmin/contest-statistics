import { readFileSync } from 'node:fs'

const templates: Record<string, string> = {}

export function render(template: string, data: Record<string, string | number>) {
    console.info(`Rendering: ${template}`)
    console.info(data)
    if (!templates[template]) {
        templates[template] = readFileSync(`template/${template}`).toString()
    }
    return templates[template].replace(/{{ ([a-zA-Z0-9_\.]+?) }}/g, (str) => {
        const key = str.split(' ')[1]
        return (typeof data[key] === 'undefined' ? `Unknown Key: ${key}` : data[key]).toString()
    })
}
