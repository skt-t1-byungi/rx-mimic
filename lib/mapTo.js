import map from './map'

export default function mapTo(value) {
    return map(() => value)
}
