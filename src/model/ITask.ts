import { Epic } from './Epic'
import { Type } from './Type'

export interface ITask {
	url: string
	epic: Epic | null
	type: Type | null
	trackedByTask: ITask | null
}
