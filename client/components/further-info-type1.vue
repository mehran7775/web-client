<template>
    <div>
        <h4 class="my-2 mx-1"> {{ message.title }} </h4>
        <p class="my-2 mx-1">  {{ message.message.body }} </p>
        <h5 class="text-left"> {{ message.origin }} </h5>
    </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
    props: ['message']
})
</script>
