<script setup> 
    const props = defineProps([ "title", "buttons" ])
    const emit = defineEmits([ "onButtonTap" ])

    function onButtonTap(buttonLabel) {
        emit("onButtonTap", buttonLabel)
    }
</script>

<template>
    <div class="modal-window"> 
        <div class="header">
            <div class="title">
                <slot name="title">
                    {{ props.title }}
                </slot>
            </div>
            <div class="buttons"> 
                <slot name="buttons">
                    <div v-for="buttonLabel in buttons">
                        <img 
                            :src="'/icons/' + buttonLabel + '.png'" 
                            height="30"
                            class="button"
                            @click="() => onButtonTap(buttonLabel)"
                        />
                    </div>
                </slot>
            </div>
        </div>
        <div class="content">
            <slot name="content">
                Enter content here...
            </slot>
        </div>
    </div>
</template>

<style lang="scss">
    .modal-window {
        background-color: white;
        opacity: 1;
        z-index: 10;
        min-width: 300px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        max-width: 80%;
        height: auto;
        margin: 0 auto;

        .header {
            padding: 0px 10px;
            background-color: rgb(8, 69, 77);
            font-weight: bold;
            color: white;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            display: flex; 

            > .title {
                flex: 1;
                display: flex; 
                align-items: center;
                justify-content: start;
            }

            > .buttons {
                display: flex; 
                align-items:  center;
                justify-content: center;

                img {
                    margin-top: 5px;
                }
                
                img:active {
                    opacity: 0.4;
                }
            }
        }

        > .content {
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
            padding: 10px;
        }
    }
</style>