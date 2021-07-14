import { Store } from 'pullstate'
import { IStore } from './IStore'

export const store = new Store<IStore>({
	task: { url: '', epic: null, type: null, trackedByTask: null },
})
