import test from 'ava'
import firstValueFrom from '../lib/firstValueFrom.js'
import of from '../lib/of.js'
import EMPTY from '../lib/EMPTY.js'

test('firstValueFrom', async t => {
    t.is(await firstValueFrom(of(1, 2, 3)), 1)
})

test('firstValueFrom with default', async t => {
    t.is(await firstValueFrom(EMPTY, { defaultValue: 100 }), 100)
})

test('if no value, throw error', async t => {
    await t.throwsAsync(firstValueFrom(EMPTY))
})
