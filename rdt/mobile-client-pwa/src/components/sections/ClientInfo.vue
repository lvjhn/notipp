<script setup>
import { computed, onMounted, ref } from 'vue';
import { useMainStore } from '../../stores/main.store.js';
import InfoField from '../widgets/InfoField.vue';
import isMobile from '../../../../../common/helpers/general/isMobile';
import detectBrowser from '../../../../../common/helpers/general/detectBrowser';
import capitalize from '../../../../../common/helpers/general/capitalize';
import ReadStateManager from '../../utils/ReadStateManager.js';
import { setModal, showModal } from '../../composables/useModal';
import CAQRInstructionsModal from '@/modals/CAQRInstructionsModal.vue' 

const store = useMainStore();

const isClientDetailsShown = ref(false)


function toggleClientDetails() {
    isClientDetailsShown.value = !isClientDetailsShown.value;
}

function getDeviceImage() {
    const _isMobile = isMobile(navigator.userAgent)

    if(_isMobile) {
        return "/icons/smartphone.png"
    }
    else {
        return "/icons/desktop.png"
    }
}

function getBrowserImage() {
    const browser = detectBrowser(navigator.userAgent) 
    return "/icons/browser-" + browser + ".png"
}

function getBrowser() {
    return capitalize(detectBrowser(navigator.userAgent))
}



function addCACertificate() {
    setModal(CAQRInstructionsModal, {})
    showModal()
}


</script>

<template>
    <div class="client-info-component">
        <div class="image">
            <img class="device-image" :src="getDeviceImage()" />
            <img class="sub-image" :src="getBrowserImage()" />
            

        </div>
        <div class="device-name"> 
            <div class="name-label"> 
                {{ store.client.name }}
            </div>
        </div>


        <div class="unread-messages" v-if="total > 0">
            {{ ReadStateManager.countAll() }} new events!
        </div> 

      
        <div class="show-details-button">
            <div class="btn btn-primary" @click="toggleClientDetails">
                <div class="icon">
                    ℹ️ 
                </div>
                <div class="label">
                    {{ isClientDetailsShown ? 'Hide' : 'Show More' }} Details
                </div>
            </div>
            <div class="btn btn-primary" @click="addCACertificate()">
                <div class="icon">
                    🧾 
                </div>
                <div class="label">
                    Get CA Certificate
                </div>
            </div>
        </div>

        <div class="client-details" v-if="isClientDetailsShown">
            <InfoField 
                label="Client ID"
                :value="store.client.id"
            />
            <InfoField 
                label="Client Secret"
                :value="store.client.secret"
                :hideable="true"
            />
            <InfoField 
                label="Browser"
                :value="getBrowser()"
            />
        </div>
    </div>
</template>

<style lang="scss"> 
    .client-info-component {
        display: flex; 
        width: 100%;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 10px;

        > .image {
            display: flex; 
            flex-direction: column;
            align-items: center;
            justify-content: center;
            
            > .device-image {
                width: 30%;
            }
            
            > .sub-image {
                width: 10%;
                position: relative;
                margin-top: -7%;
                margin-left: 15%;
            }
        }

        .device-name {
            font-size: 25px;
            font-weight: bold;
        }

        .show-details-button {
            width: 80%; 
            margin: 0 auto;
            text-align: center;
            display: flex;
            flex-direction: column;
            gap: 5px;

            > div {
                display: flex; 

                .icon {

                }

                .label {
                    flex: 1;
                    background-color: transparent;
                    color: white; 
                }
            }

        }

        .client-details {
            background-color: rgb(234, 234, 234);
            width: 100%;
            text-align: center;
            padding: 20px 0px;
            display: flex;
            gap: 10px;
            flex-direction: column;

            > .info-field-component {
                width: 85%;
                margin: 0 auto;
            }          
        }

        .unread-messages {
            margin-top: 0px;
            margin-bottom: 20px;
            box-shadow: 0px 0px 2px grey;
            padding: 5px 10px;
            border-radius: 5px;
            font-weight: bold;
            color: rgb(7, 88, 7)
        }

       
    }
</style>