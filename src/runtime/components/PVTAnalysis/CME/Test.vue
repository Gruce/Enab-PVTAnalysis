<template>
    <div text="primary">test</div>
    <div flex="~ col gap-2">
        <div v-for="(point, index) in pvPoints" :key="'pv-point-' + index">
            <span>{{point.p}}</span>
            <span>{{point.v}}</span>
            <span>{{point.predicatedVolume}}</span>
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