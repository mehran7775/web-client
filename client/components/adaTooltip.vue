<script lang="tsx">
import { useSlots, onUnmounted, h, defineComponent } from "#app"
import { VNode } from "vue";

export default defineComponent({
    setup() {
        const slots = useSlots();

        function show(node: VNode) {
            console.log(node)
        }

        return () => {
            const children: VNode[] = []
            if (slots.activator)
                children.push(...slots.activator().map(node => {
                    node.elm?.addEventListener('hover', () => show(node))
                    return node
                }))

            const tooltipChildren = [];
            if (slots.default) tooltipChildren.push(...slots.default())
            const tooltip = h('span', tooltipChildren, )
            tooltip.data?.class= {}
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