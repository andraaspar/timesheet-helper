import { Epic } from '../model/Epic'
import { ITask } from '../model/ITask'
import { Type } from '../model/Type'

export interface ITaskInfo {
	url: URL | null
	taskId: string | null
	prefix: string | null
	needsEpic: boolean | null
	isBillable: boolean | null
	bucket: string | null
	useTaskId: string | null
	useInnerTask: boolean | null
}

export function getTaskInfo(task: ITask | null | undefined): ITaskInfo {
	if (task == null) {
		return {
			url: null,
			taskId: null,
			prefix: null,
			needsEpic: null,
			isBillable: null,
			bucket: null,
			useTaskId: null,
			useInnerTask: null,
		}
	}
	const innerTaskInfo = getTaskInfo(task.trackedByTask)
	const url = (() => {
		if (task.url) {
			try {
				return new URL(task.url)
			} catch (e) {}
		}
		return null
	})()
	const taskId = (() => {
		if (url) {
			return url.pathname.split('/').pop() ?? null
		}
		return null
	})()
	const prefix = (() => {
		if (taskId) {
			return taskId.split('-')[0].toUpperCase()
		}
		return null
	})()
	const needsEpic = (() => {
		if (prefix != null) {
			return prefix === 'DTT'
		}
		return null
	})()
	const isBillable = (() => {
		if (task.type != null) {
			return [Type.Task, Type.NewFeature, Type.FeatureRequest].includes(
				task.type,
			)
		}
		return null
	})()
	const useInnerTask =
		innerTaskInfo.isBillable &&
		isBillable &&
		task.trackedByTask?.type === task.type
	const useTaskId = (() => {
		if (useInnerTask) {
			return innerTaskInfo.taskId
		}
		return taskId
	})()
	const bucket = (() => {
		if (useInnerTask) {
			return getBucket({
				isBillable: innerTaskInfo.isBillable,
				needsEpic: innerTaskInfo.needsEpic,
				task: task.trackedByTask!,
			})
		} else {
			return getBucket({
				isBillable: isBillable,
				needsEpic: needsEpic,
				task: task,
			})
		}
	})()
	return {
		url,
		taskId,
		prefix,
		needsEpic,
		isBillable,
		bucket,
		useTaskId,
		useInnerTask,
	}
}

function getBucket({
	needsEpic,
	isBillable,
	task,
}: {
	needsEpic: boolean | null
	isBillable: boolean | null
	task: ITask
}) {
	if (needsEpic === true && isBillable != null) {
		if (task.epic === Epic.DTT) {
			return isBillable ? 'DTL PROD SUPPORT' : 'DTL APPLICATION MAINTENANCE'
		} else if (task.epic === Epic.DART) {
			return isBillable ? 'DART PROD SUPPORT' : 'DART APPLICATION MAINTENANCE'
		}
	}
	return null
}
