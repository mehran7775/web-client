<template>
    <div>
        <p class="my-2 mx-1">  {{ message.message.body }} </p>
    </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
    props: ['message']
})
</script>
