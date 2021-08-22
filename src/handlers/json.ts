import {
    readFileSync,
    writeFileSync
} from 'fs'

export async function readJson(path: string): Promise<Object> {
    const rawData = await readFileSync(path, {
        encoding: 'utf8'
    })
    const jsonData = JSON.parse(rawData)
    return jsonData
}

export async function writeJson(path: string, data: Object) {
    const writeData = JSON.stringify(data, null, 4)
    await writeFileSync(path, writeData, {
        encoding: 'utf8'
    })
}