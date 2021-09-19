<template>
        <v-card :height="height" width="100%" class="white" elevation="1">
          <v-card-text class="px-2 py-6">
            <v-row class="px-4" justify="space-between">
                <h4 class="font-weight-bold pt-1">{{ title }}</h4>
                <v-btn icon @click="expand()">
                  <v-icon size="1em"> {{ icon }}</v-icon>
                </v-btn>
            </v-row>
            <v-divider class="mt-4 px-0 mx-1"></v-divider>
            <p class="my-2 mx-1">  {{ text }} </p>
          </v-card-text>
        </v-card>
</template>

<script>
import { defineComponent, ref, computed } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
  
    const text = ref('لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.')
    let expanded = ref(true)
    const expand = () => { expanded.value = !expanded.value }
    const icon = computed( () => (expanded.value ? 'mdi-arrow-expand' : 'mdi-arrow-collapse'))
    const title = ref('ناظر بازار')
    const height = computed( () => (expanded.value ? '30vh' : '80vh'))

    return {
      title,
      icon,
      text,
      expanded,
      height,
      expand
    }
  },
})
</script>
