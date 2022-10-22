import test from 'ava'
import partition from '../lib/partition.js'
import of from '../lib/of.js'
import toArray from '../lib/toArray.js'
import firstValueFrom from '../lib/firstValueFrom.js'

test('partition', async t => {
    const [evens, odds] = partition(of(1, 2, 3), v => v % 2 === 0)
    t.deepEqual(await firstValueFrom(evens.pipe(toArray())), [2])
    t.deepEqual(await firstValueFrom(odds.pipe(toArray())), [1, 3])
})
