<script setup>
import { ref } from 'vue';

const props = defineProps(["initial"])
const emit = defineEmits([ "onChange" ])

const isOn = ref(props.initial)

function toggle() {
    isOn.value = !isOn.value
    emit("onChange", isOn.value)
}

</script>

<template>
    <div class="switch-component" @click="toggle()">
        <img src="/icons/switch-on.png" width="50" v-if="isOn" />
        <img src="/icons/switch-off.png" width="50" v-else  />
    </div>
</template>

<style lang="scss">
    .switch-component {

    }
</style>