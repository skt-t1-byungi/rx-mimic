import test from 'ava'
import firstValueFrom from '../lib/firstValueFrom.js'
import of from '../lib/of.js'

test('firstValueFrom', async t => {
    t.is(await firstValueFrom(of(1, 2, 3)), 1)
})
