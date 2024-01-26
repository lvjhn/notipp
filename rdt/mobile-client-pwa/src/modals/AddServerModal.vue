<script setup> 

import ModalWindow from '../components/modal/ModalWindow.vue';
import { hideModal, setModal } from '../composables/useModal';

import IpInput from '../components/widgets/IpInput.vue';
import InputItem from '../components/widgets/InputItem.vue';
import { ref, watch } from 'vue';
import { useMainStore } from '../stores/main.store';
import axios from 'axios';
import { storeToRefs } from 'pinia';
import ServerAddedModal from './ServerAddedModal.vue';
import addServer from "@/utils/addServer.js"

const store = useMainStore()

const isSubmitting = ref(false)
const hasServerConnectionError = ref(false)

const errorState = ref(false)
const submissionState = ref("Submitting...")

function handleButtonTap(buttonLabel) {
    if(buttonLabel == "close") {
        hideModal()
    }
}

const inputs = ref({
    ip: "192.168.0.0",
    port: 10443
})

async function submit() {
    hasServerConnectionError.value = false
    isSubmitting.value = true;

    console.log("@ Adding server: ", inputs.value)

    try {
        await addServer({ 
            ip: inputs.value.ip, 
            port: inputs.value.port, 
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
        class="add-server-modal"
        title="Add Server"
        :buttons="[ 'close' ]"
        @onButtonTap="handleButtonTap"
    >
        <template v-slot:content>
            <div class="instructions">
                Enter the details of the target server.
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
            <div class="inputs">
                <InputItem label="IP Address">
                    <IpInput 
                        initial="192.168.1.0"
                        @onChange="(value) => {
                            inputs.ip = value
                        }"
                    />
                </InputItem>
                <InputItem label="Port No.">
                    <input 
                        type="number" 
                        style="
                            outline: none !important;
                            border: none;
                            text-align: center;
                            font-size: 20px;
                            width: 100%;
                        "
                        v-model="inputs.port"
                    />
                </InputItem>
            </div>
            <div class="controls">
                <button 
                    class="btn btn-primary"
                    style="width: 100%;"
                    @click="submit()"
                    :disabled="isSubmitting"
                >
                    <template v-if="!isSubmitting">
                        Submit
                    </template>
                    <template v-else>
                        {{ submissionState }}...
                    </template>
                </button>
            </div>
        </template>
    </ModalWindow>    
</template>

<style lang="scss">
    .add-server-modal {

        > .content {
            padding: 20px;
        }

        .instructions {
            text-align: center;
        }

        .inputs {
            margin-top: 30px;
            display: flex;
            gap: 30px;
            flex-direction: column;

            .input-item {
                width: 70%;
            }
        }

        .errors {
            margin-top: 10px;
        }

        .controls {
            margin-top: 16px;
        }
    }

   
</style>