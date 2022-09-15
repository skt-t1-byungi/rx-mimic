import map from './map.js'

export default function mapTo(value) {
    return map(() => value)
}
