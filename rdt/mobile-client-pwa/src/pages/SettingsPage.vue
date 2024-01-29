<script setup> 
import { ref } from "vue";
import { currentPage } from "../composables/useUI";
import { useMainStore } from "../stores/main.store";
import generateDeviceName from "../../../../common/helpers/general/generateDeviceName";
import Switch from "../components/widgets/Switch.vue";
import { setModal, showModal } from "../composables/useModal";
import ResetDataModal from "../modals/ResetDataModal.vue";
import createClient from "../utils/createClient";

currentPage.value = "Settings"

const store = useMainStore()


// client name related functions
const nameInput = ref(store.client.name)
const isNameInputDisabled = ref(true)
const isNameSavedMessageShown = ref(false)

function randomizeName() {
    nameInput.value = generateDeviceName()
    isNameInputDisabled.value = false
}

async function saveName() {
    store.client.name = nameInput.value
    isNameInputDisabled.value = true
    isNameSavedMessageShown.value = true

    for(let server of store.servers) {
        server["client-state"].mustUpdateName = true; 
    }
    
    setTimeout(() => {
        isNameSavedMessageShown.value = false
    }, 1500)
}

function enableNameInput() {
    isNameInputDisabled.value = false
}

// data reset functions
function resetData() {
    setModal(ResetDataModal, {}) 
    showModal()
}

// change timeout 
const timeoutInput = ref(store.meta.connectionTimeout) 
const isTimeoutSavedMessageShown = ref(false)
const isTimeoutInputDisabled = ref(true)

function setDefaultTimeout() {
    timeoutInput.value = 3000 
    enableTimeoutInput()
}

function saveTimeout() {
    store.meta.connectionTimeout = timeoutInput.value
    isTimeoutSavedMessageShown.value = true  
    isTimeoutInputDisabled.value = true

    setTimeout(() => {
        isTimeoutSavedMessageShown.value = false
    }, 1500)
}

function enableTimeoutInput() {
    isTimeoutInputDisabled.value = false
}

function setMetaIsEnabled() {
    store.meta.isEnabled = false;
}

</script>

<template>
    <div class="settings-page">
        <div class="title">
            <h1>Settings</h1>
        </div>
        <div class="options">
            <div class="settings-card change-name">
                <div class="title">
                    Change Client Name
                </div>
                <div class="name-input">
                    <div class="input">
                        <input 
                            class="name-input input" 
                            v-model="nameInput"
                            @keyup="enableNameInput()"
                        />
                    </div> 
                    <div 
                        class="saved-message"
                        v-if="isSavedMessageShown"
                    >
                        Saved.
                    </div>
                    <div class="controls">
                        <button
                            class="generate-random btn"
                            @click="randomizeName()"
                        > 
                            Randomize
                        </button>
                        <button
                            class="generate-random btn btn-primary"
                            @click="saveName()"
                            :disabled="isNameInputDisabled"
                        > 
                            Save
                        </button>
                    </div>
                </div>
            </div>

        
            <div class="settings-card reset-data">
                <div class="title">
                    Enable Alerts 
                    <div class="description">
                        When turned on, the app will display 
                        notification alerts.
                    </div>
                </div>
                <div class="controls">
                    <Switch 
                        :initial="store.meta.isEnabled" 
                        @onChange="(value) => {
                            store.setMetaIsEnabled(value)
                        }"
                    />
                </div>
            </div>

            <div class="settings-card change-timeout">
                <div class="title">
                    Connection Timeout 
                    <div class="description">
                        Change the timeout used when pinging 
                        servers to test connnection availability.
                    </div>
                </div>
                <div class="timeout-input">
                    <div class="input">
                        <input 
                            class="timeout-input input" 
                            v-model="timeoutInput"
                            @keyup="enableTimeoutInput()"
                        />
                    </div> 
                    <div 
                        class="saved-message"
                        v-if="isTimeoutSavedMessageShown"
                    >
                        Saved.
                    </div>
                    <div class="controls">
                        <button
                            class="generate-random btn"
                            @click="setDefaultTimeout()"
                        > 
                            Default
                        </button>
                        <button
                            class="generate-random btn btn-primary"
                            @click="saveTimeout"
                            :disabled="isTimeoutInputDisabled"
                        > 
                            Save
                        </button>
                    </div>
                </div>
            </div>

            <div class="settings-card reset-data">
                <div class="title">
                    Reset Data
                    <div class="description">
                        Clear data of the app and reset 
                        to factory settings.
                    </div>
                </div>
                <div class="controls">
                    <button
                        class="btn btn-primary"
                        @click="resetData()"
                    >   
                        RESET
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss"> 
    .settings-page {
        margin: 20px;

        > .title {
            text-align: center;
        }

        > .options {
            margin-top: 10px;
            display: flex;
            flex-direction: column;
            gap: 10px;

            > .settings-card {
                background-color: rgb(234, 234, 234);
                border: 2px solid grey;
                min-height: 50px;
                border-radius: 5px; 
                padding: 10px;   
                display: flex;
                flex-direction: row;
                gap: 10px;

                > .title {
                    font-weight: bold;
                    font-size: 20px;
                    flex: 1;

                    .description {
                        font-weight: normal;
                        font-size: 14px;
                    }
                }
            }

            > .settings-card.change-name {
                display: flex; 
                flex-direction: column;
                gap: 5px;

                > .name-input {
                    display: flex;
                    flex-direction: column;
                    gap: 5px; 

                    > .input {
                        input {
                            width: 100%;
                            text-align: center; 
                            font-size: 20px;
                        }
                    } 

                    .saved-message {
                        text-align: center;
                        color: green; 
                        font-weight: bold;
                    }

                    .controls {
                        display: flex; 
                        gap: 5px;

                        > button {
                            flex: 1;
                            width: 100%;
                        }
                    }
                }
            }

            > .settings-card.reset-data {
                display: flex; 
                flex-direction: row; 

                .controls {
                    width: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    button {
                        border-radius: 5px;
                        width: 100%;
                    }
                }
            }


            > .settings-card.change-timeout {
                display: flex; 
                flex-direction: column;
                gap: 5px;

                > .timeout-input {
                    display: flex;
                    flex-direction: column;
                    gap: 5px; 

                    > .input {
                        input {
                            width: 100%;
                            text-align: center; 
                            font-size: 20px;
                        }
                    } 

                    .saved-message {
                        text-align: center;
                        color: green; 
                        font-weight: bold;
                    }

                    .controls {
                        display: flex; 
                        gap: 5px;

                        > button {
                            flex: 1;
                            width: 100%;
                        }
                    }
                }
            }

        }
    }
</style>