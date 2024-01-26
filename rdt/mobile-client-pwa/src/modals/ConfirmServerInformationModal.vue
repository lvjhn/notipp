<script setup> 

import { ref } from 'vue';
import ModalWindow from '../components/modal/ModalWindow.vue';
import InfoField from '../components/widgets/InfoField.vue';
import { hideModal } from '../composables/useModal';
import addServer from '../utils/addServer';
import { useMainStore } from '../stores/main.store';

const props = defineProps([ "inputs" ])

const store = useMainStore()

function handleButtonTap(buttonLabel) {
    if(buttonLabel == "close") {
        hideModal()
    }
}

const isSubmitting = ref(false)
const hasServerConnectionError = ref(false)

const errorState = ref(false)
const submissionState = ref("Submitting...")

const inputs = props.inputs

async function submit() {
    hasServerConnectionError.value = false
    isSubmitting.value = true;

    console.log("@ Updating server: ", inputs.value)

    try {
        await addServer({ 
            ip: inputs.ip, 
            port: inputs.port, 
            pairSecret: inputs.pairSecret,
            store, 
            submissionState
        })
        isSubmitting.value = false 
    } catch(e) {
        hasServerConnectionError.value = true
        errorState.value = e.message
        isSubmitting.value = false
        throw e 
    }
}


</script>

<template>
    <ModalWindow
        title="Confirm Server Information" 
        class="confirm-server-information-modal"
        :buttons="[ 'close' ]"
        @onButtonTap="handleButtonTap"
    >
        <template v-slot:content>
            <div class="instructions">    
                Confirm scan details
            </div>
            <div class="errors">
                <div 
                    class="error-box connection-error" 
                    v-if="hasServerConnectionError"
                >
                    <b>Error:</b> Cannot Connect to Server <br />
                    <b>Stage:</b> {{ submissionState }} <br />
                    <b>Message: </b> <br /> {{ errorState }}
                </div>
            </div>
            <div class="fields">
                <InfoField
                    label="IP"
                    :value="inputs.ip"
                />
                <InfoField
                    label="PORT"
                    :value="inputs.port"
                />
                <InfoField
                    label="SECRET"
                    :value="inputs.pairSecret"
                    :hideable="true"
                />
            </div> 
            <div class="controls">
                <button 
                    class="btn btn-primary"
                    @click="submit()"
                >
                    Submit
                </button>
            </div>
        </template>
    </ModalWindow>    
</template>

<style lang="scss">
    .confirm-server-information-modal {
        .instructions {
            font-size: 20px;
            text-align: center;
        }

        .errors {
            margin: 0px 10px;
        }

        .fields {
            display: flex; 
            flex-direction: column;
            gap: 10px;
            padding: 10px;
        }

        .controls {
            padding: 10px; 
            
            button {
                width: 100%;
            }
        }
    }   
</style>