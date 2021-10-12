<template>
    <div>
        <h4 class="my-2 mx-1"> {{ message.title }} </h4>
        <p class="my-2 mx-1">  {{ message.message.body }} </p>
    </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
    props: ['message']
})
</script>
