import test from 'ava'
import lastValueFrom from '../lib/lastValueFrom.js'
import interval from '../lib/interval.js'
import take from '../lib/take.js'

test('lastValueFrom', async t => {
    t.is(await lastValueFrom(interval(1).pipe(take(3))), 2)
})
