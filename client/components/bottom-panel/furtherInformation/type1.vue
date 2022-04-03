<template>
    <div>
        <p class="my-2 mx-1">  {{ message.message.body }} </p>
    </div>
</template>

<script>
import { defineComponent } from '#app'

export default defineComponent({
    props: ['message']
})
</script>
