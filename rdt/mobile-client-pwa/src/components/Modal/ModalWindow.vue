<script setup> 
    const props = defineProps([ "title", "buttons" ])
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
                    {{ props.button }}
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

        .header {
            padding: 5px 5px;
            background-color: rgb(8, 69, 77);
            font-weight: bold;
            color: white;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
        }

        .content {
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
            padding: 10px;
        }
    }
</style>