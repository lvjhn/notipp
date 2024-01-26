<script setup>
import { useMainStore } from '../../stores/main.store';

const store = useMainStore()

function sortedServers() {
    return store.servers.sort(
        (a, b) => a.server.hostname > b.server.hostname ? 1 : -1
    )
}

</script>

<template>
    <div class="server-listing-component">
        <div class="controls">
            <div class="add-btn-ctr">
                <button class="add-btn btn btn-primary">
                    + Add 
                </button>
            </div>
            <div class="pair-via-qr-ctr">
                <button class="add-btn btn btn-primary">
                    + Pair via QR 
                </button>
            </div>
            <div class="remove-all-btn-ctr">
                <button class="remove-all-btn btn" >
                    Remove All
                </button>
            </div>
        </div>
        <div class="servers" v-if="store.servers.length > 0">
            <div class="server-item" v-for="server in sortedServers()">
                <div class="identifier">
                    <div class="name">
                        {{ server.server.hostname }}
                    </div>
                    <div class="address">
                        {{ server.server.ip + ":" + server.server.port }}
                    </div>
                </div>
            </div>
        </div>
        <div class="no-servers" v-else>
            No Servers Added Currently 
        </div>
    </div>
</template>

<style lang="scss">
    .server-listing-component {
        width: 100%;
        display: flex; 
        flex-direction: column;
        gap: 10px;

        .servers {
            display: flex;
            flex-direction: column; 
            gap: 10px; 

            .server-item {
                width: 80%; 
                box-shadow: 0px 0px 2px black; 
                margin: 0 auto;
                padding: 10px 20px;

                .identifier {
                    .name {
                        font-weight: bold;
                        font-size: 20px;
                    }

                    .address {
                        color: grey;
                    }
                }
            }
        }

        .controls {
            width: 80%;
            margin: 0 auto;
            display: flex;
            gap: 5px;
            text-align: center;

            > div {
                flex: 1;

                button {
                    width: 100%;
                }
            }
        }

        .no-servers {
            width: 80%;
            height: 100px;
            margin: 0 auto;
            background-color: rgb(200, 200, 200);
            color: rgb(50, 50, 50);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 5px;
            border: 2px solid grey;
        }
    }
</style>