import { css, cx } from '@emotion/css'
import React, { useCallback } from 'react'
import { ReactComponent as ClipboardIconComp } from '../asset/bi-clipboard.svg'
import { fieldCss } from '../css/fieldCss'
import { fieldsCss } from '../css/fieldsCss'
import { labelCss } from '../css/labelCss'
import { getTaskInfo } from '../fun/getTaskInfo'
import { ITask } from '../model/ITask'
import { store } from '../model/store'
import { TaskComp } from './TaskComp'

export interface AppCompProps {}

export function AppComp(props: AppCompProps) {
	const task = store.useState((s) => s.task)
	const setTask = useCallback((task: ITask) => {
		store.update((s) => {
			s.task = task
		})
	}, [])
	const { isBillable, bucket, useTaskId } = getTaskInfo(task)

	return (
		<div className={fieldsCss}>
			<TaskComp _task={task} _setTask={setTask} />
			{isBillable != null && (
				<>
					<div className={fieldCss}>
						<div className={labelCss}>{`Result:`}</div>
						<div
							className={cx(
								billableCss,
								isBillable ? billableYesCss : billableNoCss,
							)}
						>
							{isBillable ? `Billable.` : `NOT billable.`}
						</div>
					</div>
					{bucket != null && (
						<div className={fieldCss}>
							<div className={labelCss}>{`Bucket:`}</div>
							<div>{bucket}</div>
						</div>
					)}
					{useTaskId != null && (
						<div className={fieldCss}>
							<div className={labelCss}>{`Use task ID:`}</div>
							<div>
								<b>{useTaskId}</b>
							</div>
							<button
								onClick={(e) => {
									navigator.clipboard.writeText(useTaskId)
								}}
							>
								<ClipboardIconComp />
							</button>
						</div>
					)}
				</>
			)}
		</div>
	)
}

const billableCss = css({
	padding: `1px 5px`,
	borderRadius: `3px`,
})

const billableYesCss = css({
	backgroundColor: 'lime',
})

const billableNoCss = css({
	backgroundColor: 'salmon',
})
