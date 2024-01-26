<script setup> 
import { ref } from "vue"

const emit = defineEmits([ "onChange" ])
const props = defineProps([ "initial" ])

props.initial = props.initial ?? "192.168.1.0"

const tokens = props.initial.split(".")

const firstOctet  = ref(tokens[0])
const secondOctet = ref(tokens[1])
const thirdOctet = ref(tokens[2])
const fourthOctet = ref(tokens[3])


function triggerOnChange() {
    const ip = firstOctet.value + "." + secondOctet.value + "." + 
               thirdOctet.value + "." + fourthOctet.value
    emit("onChange", ip)
}

</script>

<template>
    <div class="ip-input-component"> 
            <input 
                type="number"
                min="0" 
                max="1" 
                style="width: 47px;"
                v-model="firstOctet"
                @change="triggerOnChange()"
            />
            .
            <input 
                type="number"
                min="0" 
                max="1" 
                style="width: 47px;"
                v-model="secondOctet"
                @change="triggerOnChange()"
            />
            . 
            <input 
                type="number" 
                min="0" 
                max="255" 
                style="width: 47px;"
                v-model="thirdOctet"
                @change="triggerOnChange()"
            />
            .
            <input 
                type="number" 
                min="0" 
                max="255" 
                style="width: 47px;"
                v-model="fourthOctet"
                @change="triggerOnChange()"
            />
    </div>
</template>

<style lang="scss">
    .ip-input-component {
        font-size: 20px;
        width: 100%;
        text-align: center;
        font-weight: bold;
        font-size: 20px;

        input {
            border-radius: 5px;
            border: 1px solid black;
        }
    }
</style>