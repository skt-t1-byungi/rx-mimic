import audit from './audit.js'
import timer from './timer.js'
import { pipe } from './utils.js'

export default function auditTime(ms) {
    return pipe(audit(() => timer(ms)))
}
