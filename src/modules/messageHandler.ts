import {
    formattedMessage
} from './interfaces'

export async function formatMessage(message: string, prefix: string | string[]): Promise<formattedMessage | false> {
    if (typeof prefix === 'object') {
        var hasPrefix = false
        prefix.forEach(element => {
            if (message.toLowerCase().startsWith(element)) {
                hasPrefix = true
            }

            if (!hasPrefix) return false
        })
    } else {
        if (!message.startsWith(prefix)) return false
    }

    var args: string[]
    var rawArgs: string

    if (typeof prefix === 'object') {
        prefix.forEach(element => {
            if (message.toLowerCase().startsWith(element)) {
                args = message.slice(element.length).trim().split(/ +/g)
                rawArgs = message.slice(element.length).trimStart().replace(element, "")
            }
        })
    } else {
        args = message.slice(prefix.length).trim().split(/ +/g)
        rawArgs = message.slice(prefix.length).trimStart().replace(prefix, "")
    }

    return {
        command: args.shift().toLowerCase(),
        args: args,
        rawArgs: rawArgs
    }
}
