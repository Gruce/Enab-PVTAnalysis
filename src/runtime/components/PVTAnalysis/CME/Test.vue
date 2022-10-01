<template>
    <h3 text="primary">PV Checks</h3>
    <div flex="~ col gap-1">
        <div v-for="(point, index) in pvPoints" :key="'pv-point-' + index" border="rounded-lg" p="2" bg="secondary dark:secondaryOp dark:opacity-20 opacity-20 hover:dark:opacity-40 hover:opacity-40" flex="~ gap-2" items="center">
            <span p="y-1 x-2">
                {{point.p}} psi
            </span>
            <span p="y-1 x-2">{{point.v}} cc</span>
            <span p="y-1 x-2">»</span>
            <span border="~" :class="[
                point.predicatedVolume == point.v
                ? 'border-secondary dark:border-secondaryOp'
                : 'border-error'
            ]" p="y-1 x-2" rounded="lg">{{point.predicatedVolume.toFixed(3)}} cc</span>
            <span p="y-1 x-2">{{(((point.predicatedVolume - point.v) / point.predicatedVolume) * 100).toFixed(3)}} %</span>
        </div>

    </div>
</template>

<script setup>
import { useCME, useTest } from '../../../composables/useCME'
import { onMounted } from '#imports'

const props = defineProps({
    cme: {
        type: Object,
        required: true,
    }
});

const test = useTest(props.cme)

const pvPoints = test.PV()
</script>