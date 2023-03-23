import { eventLocks } from './2-event-locks'
import { handleFindSsr } from './5-handle-find-ssr'
import { makeModelInstances } from './3-model-instances'
import { normalizeFind } from './6-normalize-find'
import { patchDiffing } from './8-patch-diffs'
import { setPending } from './1-set-pending'
import { skipGetIfExists } from './7-skip-get-if-exists'
import { syncStore } from './4-sync-store'

export { syncStore, setPending, eventLocks, normalizeFind, skipGetIfExists, makeModelInstances }

export const feathersPiniaHooks = () => [
  setPending(),
  eventLocks(),
  makeModelInstances(),
  syncStore(),
  handleFindSsr(),
  normalizeFind(),
  skipGetIfExists(),
  patchDiffing(),
]
