<template>
    <div h="full" overflow-y="auto">
        <div h="100px" p="4" flex="~ col gap-2">
            <div flex="~ gap-4">
                <!-- Loading Conditions -->
                <div flex="~ col gap-4" w="full" p="4" border="~ secondary dark:secondaryOp rounded-lg">
                    <h3 text="secondary dark:secondaryOp">Loading Conditions</h3>
                    <div flex="~ gap-2">
                        <UiInput w="full" label="Loading Temperature (°F)" v-model.number="cme.loading_temperature" />
                        <UiInput w="full" label="Loading Volume (°V)" v-model.number="cme.loading_volume" />
                        <UiInput w="full" label="Setpoint Temperature (°F)" v-model.number="cme.temperature_setpoint" />
                    </div>
                </div>

                <!-- Bubble Point -->
                <div flex="~ col gap-4" w="full" p="4" border="~ secondary dark:secondaryOp rounded-lg">
                    <div flex="~" justify="between">
                        <h3 text="secondary dark:secondaryOp">Bubble Point</h3>
                        <UiButton color="warning" :outline="true">✨</UiButton>
                    </div>
                    <div flex="~ gap-2" items="end">
                        <UiInput w="full" label="Pressure (psi)" v-model.number="cme.sp.p" />
                        <UiInput w="full" label="Volume (cc)" v-model.number="cme.sp.v" />
                    </div>
                </div>
            </div>

            <!-- Content -->
            <div flex="~ gap-4">
                <!-- PVT -->
                <div flex="~ col gap-4" p="4" border="~ secondary dark:secondaryOp rounded-lg">
                    <div flex="~" justify="between">
                        <h3 text="secondary dark:secondaryOp">PVT</h3>
                        <UiButton @click="pastePoints()" color="info" :outline="true">
                            <IconClipboard w="4" h="4" />
                        </UiButton>
                    </div>
                    <div flex="~ col gap-2">
                        <div v-for="(point, index) in cme.points" :key="'point-' + index" class="group" flex="~ gap-2" items="center">
                            <UiInput v-model.number="point.p" />
                            <UiInput v-model.number="point.v" />
                            <UiInput v-model.number="point.t" />

                            <IconClose class="invisible group-hover:visible" @click="removePoint(index)" cursor="pointer" text="error" w="6" h="6" />
                        </div>
                    </div>
                </div>

                <!-- Details -->
                <div p="4" w="full" border="~ secondary dark:secondaryOp rounded-lg">

                    <UiTabGroup items="start" h="full" w="full" :col="true" :tabs="['Results Checks', 'PV', 'Y Function']">
                        <template #tab-1>
                            <PVTAnalysisCMETest :cme="cme" />
                            <!-- <h3 text="white">Home Tap Selected</h3> -->
                            <!-- <UiButton @click="useTest(cme).PV()">testPV</UiButton> -->
                        </template>

                        <template #tab-2>
                            <div flex="~ col gap-2" justify="center" items="center">
                                <div style="height:300px; width: 500px;" ref="pvPlot"></div>
                                <UiButton @click="generatePVPlot()">PV Plot</UiButton>
                            </div>
                        </template>

                        <template #tab-3>
                            <div flex="~ col gap-2" justify="center" items="center">
                                <div style="height:300px; width: 500px;" ref="yFunctionPlot"></div>
                                <UiButton @click="generateYFunctionPlot()">Y Function Plot</UiButton>
                            </div>
                        </template>
                    </UiTabGroup>

                </div>
            </div>
        </div>
    </div>
</template>



<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { CME_TYPE } from '../../types/cme'
import { ref, reactive, onMounted, watch } from '#imports'
import Plotly from 'plotly.js-dist/plotly'
import { useCME, useTest } from '../../../composables/useCME'

const yFunctionPlot = ref(null)
const pvPlot = ref(null)

const cme: CME_TYPE = reactive({
    id: 1,

    loading_temperature: 84.74,
    loading_volume: 28.563,

    temperature_setpoint: 172.4,

    points: [
        { t: 172.4, p: 4999, v: 30.030 },
        { t: 172.4, p: 4500, v: 30.219 },
        { t: 172.4, p: 4000, v: 30.403 },
        { t: 172.6, p: 3501, v: 30.600 },
        { t: 172.4, p: 3405, v: 30.640 },
        { t: 172.4, p: 3000, v: 30.811 },
        // { t: 172.4, p: 2500, v: 31.030 },
        { t: 172.4, p: 2400, v: 31.270 },
        { t: 172.4, p: 2300, v: 31.570 },
        { t: 172.6, p: 2200, v: 31.947 },
        { t: 172.4, p: 2100, v: 32.400 },
        { t: 172.4, p: 2001, v: 32.940 },
    ],

    sp: {
        p: 2500,
        v: 31.030
    },

    oil_density: 0.8062
})

// Calculation
watch(() => cme, async(value) => {
    await useCME(value)
}, { deep: true })

const pastePoints = () => {
    navigator.clipboard.readText().then((clipText) => {
        const points: Array = clipText.split('\n')
        cme.points = []
        points.forEach((point, index) => {
            const values: Array = point.split('\t')
            cme.points.push({
                p: parseInt(values[0]),
                v: parseFloat(values[1]),
                t: parseFloat(values[2])
            })
        })
    });
}

const removePoint = (index) => {
    cme.points.splice(index, 1)
}
onMounted(async () => {
    // const pressures = useMap(cme.points, 'p')
    // const volumes = useMap(cme.points, 'v')

    await useCME(cme)
})

// PV Plot
const generatePVPlot = () => {
    // PV Plot
    const pointsBeforeSP = cme.points.filter((point) => point.isBeforeSP)
    const pointsAfterSP = cme.points.filter((point) => !point.isBeforeSP)
    Plotly.newPlot(pvPlot.value, [
        // Before SP
        {
            x: useMap(pointsBeforeSP, 'p'),
            y: useMap(pointsBeforeSP, 'v'),
            mode: 'lines+markers',
            type: 'scatter',
            name: "Before BP"
        },
        // Between
        {
            x: [
                pointsBeforeSP[pointsBeforeSP.length - 1].p,
                cme.sp.p,
                pointsAfterSP[0].p,
            ],
            y: [
                pointsBeforeSP[pointsBeforeSP.length - 1].v,
                cme.sp.v,
                pointsAfterSP[0].v
            ],
            mode: 'lines+markers',
            type: 'scatter',
            // line: {shape: 'spline'},
            name: "Between"
        },
        // After SP
        {
            x: useMap(pointsAfterSP, 'p'),
            y: useMap(pointsAfterSP, 'v'),
            mode: 'lines+markers',
            type: 'scatter',
            line: { shape: 'spline' },
            name: "After BP"
        }
    ], {
        margin: { t: 70, b: 70, r: 70, l: 70 },
        title: 'PV',
        yaxis: {
            title: "Volume (cc)"
        },
        xaxis: {
            title: "Pressure (psi)"
        }
    }, {
        scrollZoom: true,
    });
}

// Y Function Plot
const generateYFunctionPlot = () => {
    // Y Function Plot
    Plotly.newPlot(yFunctionPlot.value, [{
        x: useMap(cme.yFunction, 'p'),
        y: useMap(cme.yFunction, 'yFunction'),
        mode: 'lines+markers',
        type: 'scatter',
        line: { shape: 'spline' },
    }], {
        margin: { t: 70, b: 70, r: 70, l: 70 },
        title: 'Y Function',
        yaxis: {
            title: "Y Function"
        },
        xaxis: {
            title: "Pressure (psi)"
        }
    }, {
        scrollZoom: true,
    });
}
</script>
    