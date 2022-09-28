import { POINT_TYPE } from '../types/cme'

export const useSP = (points: POINT_TYPE[]) => {

    const getSlopes = (points: POINT_TYPE[]) => {
        const slopes: POINT_TYPE[] = []
        for (let i = points.length-1; i > 0 ; i--) {
            const slope = (points[i].v - points[i - 1].v) / (points[i].p - points[i - 1].p)
            slopes.push({ ...points[i], slope: slope })
        }
        return slopes
    }

    // getting slopes
    const slopes = getSlopes(points)

    // get slopes differences
    const slopesDiffs = []
    for (let i = 1; i < slopes.length; i++) {
        slopesDiffs.push({
            p1: slopes[i - 1],
            p2: slopes[i],
            diff: slopes[i].slope - slopes[i - 1].slope
        })
    }


    console.log(slopesDiffs)
    // console.log(useMinBy(slopesDiffs, (o) => o.diff))


}


