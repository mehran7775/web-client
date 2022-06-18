<script lang="tsx">
import { useSlots, onMounted, onUnmounted, h, defineComponent, ref, Ref } from "#app"
import { VNode } from "vue";

export default defineComponent({
    setup() {
        const slots = useSlots();
        const tooltip: Ref<VNode | null> = ref(null)

        function show(node: VNode) {
            console.log(node)
        }

        onMounted(() => {
            if (document && tooltip.value?.elm) {
                console.log(tooltip.value.elm)
                document.getElementsByTagName('body')[0].appendChild(tooltip.value.elm as Node);
            }
        })

        return () => {
            const children: VNode[] = []
            if (slots.activator)
                children.push(...slots.activator().map(node => {
                    node.elm?.addEventListener('hover', () => show(node))
                    return node
                }))

            const tooltipChildren = [];
            if (slots.default) tooltipChildren.push(...slots.default())
            tooltip.value = h('span', {
                staticClass: "ada-tooltip"
            }, tooltipChildren)

            const activator = h('div', children)
            return activator;
        }
    }
})
</script>
<style lang="postcss" scoped>
.ada-tooltip {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: var(--border-radius-root);
}
</style>