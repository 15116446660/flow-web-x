<template>
  <div class="text-box">
    <v-subheader>{{ label }}</v-subheader>
    <v-text-field
        solo
        dense
        :readonly="readonly"
        v-model="adaptor"
        :rules="rules"
        :type="password ? (showPassword ? 'text' : 'password') : 'text'"
        :append-icon="password ? (showPassword ? 'mdi-eye' : 'mdi-eye-off') : ''"
        @click:append="showPassword = !showPassword"
    ></v-text-field>
  </div>
</template>

<script>
  export default {
    name: 'TextBox',
    props: {
      label: {
        type: String,
        required: true
      },
      value: {
        type: [Number, String]
      },
      readonly: {
        type: Boolean,
        required: false,
        default: false
      },
      rules: {
        type: Array,
        default () {
          return []
        }
      },
      password: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        adaptor: this.value,
        showPassword: false
      }
    },
    watch: {
      adaptor(val) {
        this.$emit('input', val)
      }
    }
  }
</script>

<style lang="scss">
  .text-box {
    .v-subheader {
      padding: 0;
    }

    .v-input {
      font-size: 14px
    }
  }
</style>
