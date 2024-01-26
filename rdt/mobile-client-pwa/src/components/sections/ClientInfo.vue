<script setup>
import { ref } from 'vue';
import { useMainStore } from '../../stores/main.store.js';
import InfoField from '../widgets/InfoField.vue';
import isMobile from '../../../../../common/helpers/general/isMobile';
import detectBrowser from '../../../../../common/helpers/general/detectBrowser';
import capitalize from '../../../../../common/helpers/general/capitalize';

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
        <div class="show-details-button">
            <button class="btn" @click="toggleClientDetails">
                {{ isClientDetailsShown ? 'Hide' : 'Show More' }} Details
            </button>
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

       
    }
</style>