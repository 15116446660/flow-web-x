<template>
  <v-card class="full-size pt-0">
    <v-card-title class="title py-0">
      <v-toolbar flat bottom>
        <v-toolbar-title>
          <v-breadcrumbs :items="navItems" class="pa-0">
            <template v-slot:divider>
              <v-icon>mdi-chevron-right</v-icon>
            </template>

            <template v-slot:item="{ item }">
              <v-breadcrumbs-item
                  :href="item.href"
                  class="title font-weight-bold"
              >
                {{ item.text }}
              </v-breadcrumbs-item>
            </template>
          </v-breadcrumbs>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-toolbar-items class="align-baseline" v-if="showFlowAction">
          <v-btn
              text
              color="blue-grey"
              class="white--text"
              @click="onStatisticClick"
          >
            <v-icon class="mr-1">mdi-trending-up</v-icon>
            {{ $t('flow.statistic') }}
          </v-btn>

          <v-btn
              text
              color="blue-grey"
              class="white--text"
              @click="onSettingsClick"
          >
            <v-icon class="mr-1">mdi-settings</v-icon>
            {{ $t('flow.settings') }}
          </v-btn>

          <v-btn
              text
              color="success"
              @click="onRunClick"
          >
            <v-icon class="mr-1">mdi-play</v-icon>
            {{ $t('job.run') }}:
          </v-btn>

          <v-combobox dense
                      outlined
                      prepend-icon="mdi-source-branch"
                      :items="gitBranches"
                      v-model="selectedBranch"
                      label="branch:">
          </v-combobox>
        </v-toolbar-items>
      </v-toolbar>

      <Dialog :dialog="dialog"
              :content="$t('job.hint.missing_agent')"
      ></Dialog>
    </v-card-title>

    <v-card-text class="content px-2">
      <router-view></router-view>
    </v-card-text>
  </v-card>
</template>

<script>
  import actions from '@/store/actions'
  import Dialog from '@/components/Common/Dialog'
  import { mapState } from 'vuex'

  export default {
    name: 'FlowHome',
    components: {
      Dialog
    },
    data () {
      return {
        dialog: false,
        baseItem: {text: 'flows', href: '#/flows'},
        selectedBranch: 'master'
      }
    },
    computed: {
      ...mapState({
        gitBranches: state => state.flows.gitBranches,
        agents: state => state.agents.items
      }),

      navItems () {
        let route = this.$route

        if (route.name === 'Overview') {
          return [ this.baseItem ]
        }

        // flow level
        let href = '#' + route.path
        let flowItem = {text: this.flowName, href}
        this.setCurrentFlow()

        if (route.name === 'Jobs') {
          this.loadBranches()
          return [ this.baseItem, flowItem ]
        }

        flowItem.href = `#/flows/${this.flowName}/jobs`

        if (route.name === 'Settings') {
          return [ this.baseItem, flowItem, {text: 'settings', href} ]
        }

        if (route.name === 'Statistic') {
          return [ this.baseItem, flowItem, {text: 'statistic', href} ]
        }

        if (route.name === 'JobDetail') {
          this.setCurrentJob()
          return [ this.baseItem, flowItem, {text: '#' + this.buildNumber, href} ]
        }

        return []
      },

      showFlowAction () {
        return this.$route.name === 'Jobs'
      },

      flowName () {
        return this.$route.params.id
      },

      buildNumber () {
        return this.$route.params.num
      }
    },

    methods: {
      onSettingsClick () {
        this.$router.push(`/flows/${this.flowName}/settings`)
      },

      onStatisticClick () {
        this.$router.push(`/flows/${this.flowName}/statistic`)
      },

      onRunClick () {
        const payload = {flow: this.flowName, branch: this.selectedBranch}
        this.$store.dispatch(actions.jobs.start, payload).then()
      },

      setCurrentFlow () {
        this.$store.dispatch(actions.flows.select, this.flowName).then()
      },

      setCurrentJob () {
        const payload = {flow: this.flowName, buildNumber: this.buildNumber}
        this.$store.dispatch(actions.jobs.select, payload).then()
      },

      loadBranches () {
        this.$store.dispatch(actions.flows.gitBranches, this.flowName)
          .catch((err) => {
            console.log(err)
          })
      }
    }
  }
</script>

<style scoped>
.title {
  height: 10%;
}

.content {
  height: 90%;
  position: absolute;
}
</style>
