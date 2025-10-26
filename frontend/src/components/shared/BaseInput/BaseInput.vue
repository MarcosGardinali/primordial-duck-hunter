<template>
  <div class="base-input">
    <label v-if="label" :for="id">
      {{ label }}
      <span v-if="required" class="required-indicator">*</span>
    </label>
    <select
      v-if="type === 'select'"
      :id="id"
      :value="modelValue"
      @change="handleSelectChange"
      :required="required"
      :disabled="disabled"
      class="form-input"
    >
      <slot></slot>
    </select>
    <textarea
      v-else-if="type === 'textarea'"
      :id="id"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :required="required"
      :rows="rows"
      class="form-input"
    ></textarea>
    <div v-else-if="type === 'password'" class="password-input-wrapper">
      <input
        :id="id"
        :type="showPassword ? 'text' : 'password'"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :required="required"
        class="form-input"
      />
      <button
        type="button"
        @click="togglePassword"
        class="password-toggle"
      >
        <i v-if="showPassword" class="pi pi-eye"></i>
        <i v-else class="pi pi-eye-slash"></i>
      </button>
    </div>
    <input
      v-else
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :required="required"
      :min="min"
      :step="step"
      class="form-input"
    />
  </div>
</template>

<script>
export default {
  name: 'BaseInput',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      required: true
    },
    rows: {
      type: [String, Number],
      default: 4
    },
    min: {
      type: [String, Number],
      default: null
    },
    step: {
      type: [String, Number],
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'change'],
  data() {
    return {
      showPassword: false
    }
  },
  methods: {
    handleSelectChange(event) {
      this.$emit('update:modelValue', event.target.value)
      this.$emit('change', event)
    },
    togglePassword() {
      this.showPassword = !this.showPassword
    }
  }
}
</script>

<style scoped lang="scss">
@import 'BaseInput.scss';
</style>