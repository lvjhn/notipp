<script setup> 
import ClientInfo from "@/components/sections/ClientInfo.vue"
import ServerListing from "../components/sections/ServerListing.vue";
import { currentPage } from "../composables/useUI";

currentPage.value = "Servers"

</script>

<template>
    <div class="servers-page">
        <ClientInfo />
        <ServerListing />
    </div>
</template>

<style lang="scss">
    .client-info-component {
        margin-top: 80px;
    }

    .server-listing-component {
        margin-top: 20px;
    }
</style>