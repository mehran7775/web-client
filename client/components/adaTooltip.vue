<script lang="ts">
import { useSlots, onMounted, onUnmounted, h, defineComponent, ref, Ref, computed } from "#app"
import { VNode } from "vue";

export default defineComponent({
    props: {
        left: Boolean,
        right: Boolean
    },
    setup(props) {
        const slots = useSlots();
        const tooltip: Ref<VNode | null> = ref(null)
        const activator: VNode = h('div', { staticClass: 'ada-tooltip-container' })

        //const act = computed(() => activator.elm as HTMLElement)

        onMounted(() => {
            if (document && tooltip.value?.elm) {
                document.getElementsByTagName('body')[0].appendChild(tooltip.value.elm as Node);
            }
        })
        function show(node: VNode) {
            console.log(node)
        }
        return () => {
            const children = []
            if (slots.activator) {
                children.push(...slots.activator().map(node => {
                    node.elm?.addEventListener('hover', () => show(node))
                    return node
                }))
            }

            const tooltipChildren = [];
            if (slots.default) tooltipChildren.push(...slots.default())
            tooltip.value = h('span', {
                staticClass: "ada-tooltip",
                style: {
                    top: 0,
                    left: 0,
                    right: 0
                }
            }, tooltipChildren)
            //children.push(tooltip.value)
            activator.children = children
            return activator;
        }
    }
})

</script>
<style lang="postcss" scoped>
.ada-tooltip-container {
    position: relative;

    .ada-tooltip {
        @apply tw-absolute tw-flex tw-justify-center tw-items-center;
        min-height: calc(var(--row-height) - 8px);
        min-width: 75px;
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: var(--border-radius-root);
        z-index: 1000;
        color: white;
    }
}
</style>

