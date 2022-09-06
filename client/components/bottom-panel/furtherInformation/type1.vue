<template>
    <div>
        <p class="my-2 mx-1">  {{ message.message.body }} </p>
    </div>
</template>

<script>

export default defineComponent({
    props: ['message']
})
</script>
