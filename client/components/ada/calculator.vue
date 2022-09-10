<script lang="ts" setup>
const emit = defineEmits(['close'])
const operands: string[] = ["+", "-", "*", "/"];
const numbers: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "."];
const selectedNum = ref<string>("");
const prevNum = ref<string>("");
const selectedOperand = ref<string>("");

const keyPressed = (input: string) => {
  if (input === "=") calculateValues();
  else if (operands.includes(input)) applyOperation(input);
  else if (numbers.includes(input)) appendNumber(input);
};
const applyOperation = (input: string) => {
  prevNum.value = selectedNum.value;
  selectedNum.value = "";
  selectedOperand.value = input;
};
const appendNumber = (input: string) => {
  selectedNum.value = selectedNum.value + input;
};
const calculateValues = () => {
  if (selectedOperand.value === "*") multiply();

  if (selectedOperand.value === "+") sum();

  if (selectedOperand.value === "-") subtract();

  if (selectedOperand.value === "/") divide();
  prevNum.value = "";
};

const multiply = () => {
    console.log(prevNum.value, selectedNum.value)
    console.log(parseFloat(prevNum.value))
  selectedNum.value = (
    parseFloat(prevNum.value) * parseFloat(selectedNum.value)
  ).toString();
};

const divide = () => {
  selectedNum.value = (
    parseFloat(prevNum.value) / parseFloat(selectedNum.value)
  ).toString();
};

const subtract = () => {
  selectedNum.value = (
    parseFloat(prevNum.value) - parseFloat(selectedNum.value)
  ).toString();
};

const sum = () => {
  selectedNum.value = (
    parseFloat(prevNum.value) + parseFloat(selectedNum.value)
  ).toString();
};
const clear = (val: string) => {
  selectedNum.value = "";
  prevNum.value = "";
  selectedOperand.value = "";
};

const delInput = () => {
  selectedNum.value = selectedNum.value.slice(0, -1);
};
</script>

<style lang="postcss" scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.calculator {
  @apply tw-relative tw-w-full tw-px-[15px] tw-pb-[15px] tw-pt-[30px] tw-rounded-xl tw-bg-primary tw-mx-auto tw-bg-opacity-50 tw-opacity-95;
  /* @apply tw-absolute tw-top-0 tw-shadow-2xl tw-z-[99999]; */
  max-width: 430px;
  max-height: 430px;
  .input-wrap {
    @apply tw-w-full tw-relative tw-overflow-x-scroll tw-mb-2 tw-py-0 tw-px-2 tw-text-right tw-shadow-md tw-rounded;
    @apply tw-bg-primary tw-bg-opacity-80;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
    .input {
      @apply tw-h-20 tw-text-4xl tw-text-gray6;
      height: 5rem;
      line-height: 5.5rem;

      &.changing {
        line-height: 6.5rem;
      }
    }

    .smalltext {
      @apply tw-absolute tw-right-[5px] tw-top-0 tw-text-gray4;
    }
  }

  .button-wrap {
    @apply tw-flex tw-w-full tw-flex-wrap tw-justify-between tw-text-center tw-my-[2px] tw-mx-0 tw-text-white;
    @apply tw-rounded tw-cursor-pointer tw-select-none tw-outline-0 tw-bg-primary tw-bg-opacity-20;
    & > button {
        @apply tw-rounded;
      width: calc(25% - 4px);
      line-height: 5rem;
      transition: 0.3s;
    }

    & > button.largeno {
      width: 49%;
    }
    & > button.clear {
      @apply tw-w-1/2;
      width: 50%;
    }

    & > button.number {
      @apply tw-bg-primary tw-bg-opacity-70;
      &:not(.largeno, .dot) {
        @apply tw-mb-1;
      }
    }
    .plus {
        @apply tw-mb-1;
    }

    & > button:hover {
      box-shadow: inset 0px 0px 15px 0px rgba(0, 0, 0, 0.3);
    }

    & > button.result {
      /* @apply tw-text-red; */
    }

    .minus {
        @apply tw-text-2xl;
    }
  }

  .ada-button {
    @apply tw-absolute tw-left-2 tw-top-2 tw-bg-transparent tw-flex tw-justify-center tw-items-center;

    .icon {
      @apply tw-text-primary tw-text-opacity-80 hover:tw-text-opacity-100;
    }
  }
}

</style>

<template>
  <div class="calculator">
    <ada-btn>
      <ada-icon size="1.5rem" @click="$emit('close')">mdi-close</ada-icon>
    </ada-btn>
    <div class="input-wrap">
      <div class="smalltext" v-if="selectedOperand != ''">
        {{ prevNum }} {{ selectedOperand }} {{ selectedNum }}
      </div>
      <div class="input" :class="{ changing: selectedOperand }">
        {{ selectedNum }}
      </div>
    </div>
    <div class="button-wrap">
      <button class="clear" @click="clear('C')">C</button>
      <button class="delete" @click="delInput">del</button>
      <button class="divide" @click="keyPressed('/')">/</button>

      <button class="number" @click="keyPressed('7')">7</button>
      <button class="number" @click="keyPressed('8')">8</button>
      <button class="number" @click="keyPressed('9')">9</button>
      <button class="times" @click="keyPressed('*')">*</button>

      <button class="number" @click="keyPressed('4')">4</button>
      <button class="number" @click="keyPressed('5')">5</button>
      <button class="number" @click="keyPressed('6')">6</button>
      <button class="minus" @click="keyPressed('-')">-</button>

      <button class="number" @click="keyPressed('1')">1</button>
      <button class="number" @click="keyPressed('2')">2</button>
      <button class="number" @click="keyPressed('3')">3</button>
      <button class="plus" @click="keyPressed('+')">+</button>
      <button class="number largeno" @click="keyPressed('0')">0</button>
      <button class="number dot" @click="keyPressed('.')">.</button>
      <button class="result" @click="keyPressed('=')">=</button>
    </div>
  </div>
</template>
