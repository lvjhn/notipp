<script setup>
import { ref } from 'vue';

const props = defineProps(["label", "value", "hideable"])
const isHidden = ref(props.hideable)

</script>

<template>
    <div class="info-field-component">
        <div class="label">
            <div class="text">
                {{ label }}
            </div>
        </div>
        <div class="value">
            <div class="text">
                {{ isHidden ? 
                    "*********************************" : 
                    value }}
            </div>
            <div class="toggle" v-if="hideable" @click="isHidden = !isHidden">
                {{  isHidden ? "SHOW" : "HIDE" }}
            </div>
        </div>
    
    </div>
</template>

<style lang="scss">
    .info-field-component {
        box-shadow: 0px 0px 1px black;
        border-radius: 5px;

        > .label {
            background-color: rgb(200, 200, 200);
            border-bottom: 1px solid grey; 
            color: black;
            font-weight: bold;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            padding: 5px 10px;
            width: 100%;
        }

        > .value {
            background-color: white;
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
            display: flex; 

            .text {
                flex: 1;
                text-align: center;
                padding: 5px 5px;
                overflow-y: scroll;
            }

            .toggle {
                background-color: rgb(234, 234, 234);
                max-width: 80px;
                min-width: 80px;
                display: flex; 
                align-items: center;
                justify-content: center;
                user-select: none;
                font-weight: bold;
            }
        }
    }
</style>