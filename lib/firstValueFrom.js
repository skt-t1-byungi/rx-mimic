import from from './from'
import { toGenerator } from './Observable'

export default async function firstValueFrom(src) {
    for await (const v of toGenerator(from(src))) {
        return v
    }
}
