<script setup> 

const props = defineProps(["label"])

</script>

<template>
    <div class="input-item-component">
        <div class="label">
            {{ label }}
        </div> 
        <div class="input">
            <slot>
                <input class="default-input" placeholder="Hello" type="text" />
            </slot>
        </div>
    </div>
</template>

<style lang="scss">
    .input-item-component {
        border: 1px solid black;    
        border-radius: 5px;
        
        .default-input {
            width: 100%;
            height: 100%;
            border: none;
            font-size: 20px;
            padding: 0 10px;
        }

        .label {
            position: relative;
            top: -15px;
            left: 10px;
            background-color: white;
            color: black;
            font-weight: bold;
            padding: 5px 5px;
        }
        
        .input {
            margin-top: -22px;
            padding-top: 8px;
            padding-bottom: 10px;
            outline: none;
            border: none;
            
            input {
                text-align: center;
            }

            input:focus {
                outline: none !important;
            }
        }

    }
</style>