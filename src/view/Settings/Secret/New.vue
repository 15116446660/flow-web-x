<template>
  <div>
    <v-row>
      <v-col cols="8">
        <v-form ref="nameForm" lazy-validation>
          <text-box label="Name"
                    :rules="nameRules"
                    v-model="name"
          ></text-box>
        </v-form>

        <text-select :items="[CATEGORY_SSH_RSA, CATEGORY_AUTH]"
                     label="Category"
                     v-model="category"
        ></text-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="8" v-if="isSshRsa">
        <v-form ref="sshForm" lazy-validation>
          <ssh-rsa-editor :showHelp="false"
                          :showCreateNew="true"
                          :model="instance"
          ></ssh-rsa-editor>
        </v-form>
      </v-col>

      <v-col cols="8" v-if="isAuth">
        <v-form ref="authForm" lazy-validation>
          <auth-editor :model="instance"></auth-editor>
        </v-form>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="8" class="text-end">
        <v-btn outlined color="warning" @click="onBackClick">{{ $t('back') }}</v-btn>
        <v-btn color="primary" @click="onSaveClick" class="ml-4">{{ $t('save') }}</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import SshRsaEditor from '@/components/Common/SshRsaEditor'
  import AuthEditor from '@/components/Common/AuthEditor'
  import TextBox from '@/components/Common/TextBox'
  import TextSelect from '@/components/Common/TextSelect'
  import actions from '@/store/actions'
  import { CATEGORY_SSH_RSA, CATEGORY_AUTH } from '@/util/secrets'
  import { secretAndConfigNameRules } from '@/util/rules'

  export default {
    name: 'SettingsSecretNew',
    components: {
      TextBox,
      TextSelect,
      SshRsaEditor,
      AuthEditor
    },
    data () {
      return {
        CATEGORY_SSH_RSA,
        CATEGORY_AUTH,
        nameRules: secretAndConfigNameRules(this),

        name: '',
        category: CATEGORY_SSH_RSA,

        credential: {
          [ CATEGORY_SSH_RSA ]: {
            selected: '',
            pair: {
              publicKey: '',
              privateKey: ''
            }
          },

          [ CATEGORY_AUTH ]: {
            selected: '',
            pair: {
              username: '',
              password: ''
            }
          }
        }
      }
    },
    mounted () {
      this.$emit('onConfigNav', {
        navs: this.navs,
        showAddBtn: false
      })
    },
    computed: {
      navs () {
        return [
          {
            text: 'Secrets',
            href: '#/settings/secrets'
          },
          {
            text: 'New'
          }
        ]
      },

      instance () {
        return this.credential[ this.category ]
      },

      isSshRsa () {
        return this.category === CATEGORY_SSH_RSA
      },

      isAuth () {
        return this.category === CATEGORY_AUTH
      }
    },
    methods: {
      onBackClick () {
        this.$router.push('/settings/secrets')
      },

      onSaveClick () {
        if (!this.$refs.nameForm.validate()) {
          return
        }

        if (this.isSshRsa && this.$refs.sshForm.validate()) {
          const param = {
            name: this.name,
            publicKey: this.instance.pair.publicKey,
            privateKey: this.instance.pair.privateKey
          }

          this.$store.dispatch(actions.secrets.createRsa, param).then(() => {
            this.onBackClick()
          })

          return
        }

        if (this.isAuth && this.$refs.authForm.validate()) {
          const param = {
            name: this.name,
            username: this.instance.pair.username,
            password: this.instance.pair.password
          }

          this.$store.dispatch(actions.secrets.createAuth, param).then(() => {
            this.onBackClick()
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>
