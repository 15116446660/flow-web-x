const OS_MAC = 'MAC'
const OS_LINUX = 'LINUX'
const OS_WIN = 'WIN'

const STATUS_OFFLINE = 'OFFLINE'
const STATUS_IDLE = 'IDLE'
const STATUS_BUSY = 'BUSY'

export const icons = {
  [OS_MAC]: 'flow-icon-appleinc',
  [OS_LINUX]: 'flow-icon-linux',
  [OS_WIN]: 'flow-icon-windows8'
}

const colors = {
  [STATUS_BUSY]: 'blue lighten-1',
  [STATUS_IDLE]: 'green lighten-1',
  [STATUS_OFFLINE]: 'grey'
}

const text = {
  [STATUS_BUSY]: 'agent.status.busy',
  [STATUS_IDLE]: 'agent.status.idle',
  [STATUS_OFFLINE]: 'agent.status.offline'
}

export const emptyObject = {
  name: '',
  tags: [],
  status: STATUS_OFFLINE
}

export const util = {
  /**
   * Convert agent list to agent wrapper list
   */
  convert (agents) {
    let list = []
    for (let agent of agents) {
      list.push(new AgentWrapper(agent))
    }
    return list
  }
}

export class AgentWrapper {

  constructor (agent) {
    this.agent = agent ? agent : emptyObject
  }

  get isAgent() {
    return true
  }

  get id () {
    return this.agent.id
  }

  get rawInstance () {
    return this.agent
  }

  get icon () {
    return icons[this.agent.os] || 'flow-icon-agents'
  }

  get name () {
    return this.agent.name
  }

  get tags () {
    return this.agent.tags
  }

  get color () {
    return colors[this.agent.status]
  }

  get text () {
    return text[this.agent.status]
  }

  get token () {
    return this.agent.token
  }

  get url () {
    return this.agent.url ? this.agent.url : 'unknown'
  }

  get hostId () {
    return this.agent.hostId
  }

  get freeMemory () {
    return this.fetchResource('freeMemory')
  }

  get totalMemory () {
    return this.fetchResource('totalMemory')
  }

  get numOfCpu () {
    return this.fetchResource('cpu')
  }

  get freeDisk () {
    return this.fetchResource('freeDisk')
  }

  get totalDisk () {
    return this.fetchResource('totalDisk')
  }

  set name (name) {
    this.agent.name = name
  }

  set tags (tags) {
    this.agent.tags = tags
  }

  fetchResource(field) {
    if (this.agent.resource[field] === 0) {
      return '-'
    }

    return this.agent.resource[field]
  }
}
