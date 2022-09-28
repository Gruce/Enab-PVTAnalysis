import { CME_TYPE, POINT_TYPE, SP_TYPE } from '../types/cme'

export const useCME = (cme: CME_TYPE) => {
    if (cme.points?.length <= 0) return;

    const firstPoint = cme.points[0]

    cme.sp.thermalExpansion = Math.log(firstPoint.v / cme.loading_volume) / ((firstPoint.t - cme.loading_temperature) / 1.8)
    
    // Plot Needs
    cme.yFunction = []

    cme.points.forEach((currentPoint, index) => {
        const previousPoint = cme.points[index - 1]

        if (cme.sp?.p) currentPoint.isBeforeSP = currentPoint.p > cme.sp.p

        // Calculate compressibility
        if (previousPoint && currentPoint.p >= cme.sp.p && currentPoint.p !== 0){
            currentPoint.compressibility = -1 * (1/(previousPoint.p - currentPoint.p)) * Math.log(previousPoint.v / currentPoint.v) 
        }

        // Calculate relative volume
        if (currentPoint.p !== 0){
            currentPoint.relativeVolume = currentPoint.v / cme.sp.v
        }

        // Calculate y function
        if (currentPoint.p < cme.sp.p && currentPoint.p !== 0){
            currentPoint.yFunction = (cme.sp.p - currentPoint.p) / ((currentPoint.p + 14.65) * (currentPoint.v / cme.sp.v - 1))
            cme.yFunction = [...cme.yFunction, { p: currentPoint.p, yFunction: currentPoint.yFunction }]
        }

        // Calculate oil density
        if (previousPoint && currentPoint.compressibility && previousPoint.p >= cme.sp.p){
            currentPoint.oilDensity = cme.oil_density * (firstPoint.relativeVolume / currentPoint.relativeVolume)
        }
    })
}

// TESTS
export const useTest = (cme: CME_TYPE) => {
    // PV
    const PV = () => {
        const points = [...cme.points]
        const pointsBeforeSP = points.filter((point) => point.isBeforeSP)
        const pointsAfterSP = points.filter((point) => !point.isBeforeSP)
        
        if (pointsBeforeSP.length <= 0 || pointsAfterSP.length <= 0) return;
        
        /* Test before SP */
        // Calculate Slope between first and last points
        const slopeBeforeSP = (pointsBeforeSP[pointsBeforeSP.length - 1].v - pointsBeforeSP[0].v) / (pointsBeforeSP[pointsBeforeSP.length - 1].p - pointsBeforeSP[0].p)

        pointsBeforeSP.forEach(point => {
            // Predicate volume using slope
            point.predicatedVolume = pointsBeforeSP[0].v + slopeBeforeSP * (point.p - pointsBeforeSP[0].p)
        })

        return pointsBeforeSP
    }

    return { PV }
}
