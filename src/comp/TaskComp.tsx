import React, { useCallback, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { fieldCss } from '../css/fieldCss'
import { fieldsCss } from '../css/fieldsCss'
import { inputCss } from '../css/inputCss'
import { labelCss } from '../css/labelCss'
import { getTaskInfo } from '../fun/getTaskInfo'
import { Epic } from '../model/Epic'
import { ITask } from '../model/ITask'
import { Type } from '../model/Type'

export interface TaskCompProps {
	_task: ITask
	_setTask: (t: ITask) => void
	_isInner?: boolean
	_isUsed?: boolean
}

export function TaskComp({
	_task,
	_setTask,
	_isInner,
	_isUsed,
}: TaskCompProps) {
	const { taskId, prefix, needsEpic, isBillable, useInnerTask } =
		getTaskInfo(_task)
	const setTask = useCallback(
		(task: ITask) => {
			_setTask({
				..._task,
				trackedByTask: task,
			})
		},
		[_task, _setTask],
	)
	const [id] = useState(() => uuid())
	return (
		<fieldset
			className={fieldsCss}
			style={{
				backgroundColor:
					_isUsed == null ? 'transparent' : _isUsed ? 'palegreen' : 'peachpuff',
			}}
		>
			<legend>{_isInner ? `Customer Task` : `Task`}</legend>
			<div className={fieldCss}>
				<label className={labelCss} htmlFor={id + '-url'}>
					{`Task URL (of the parent task, if there is one):`}
				</label>
				<input
					id={id + '-url'}
					className={inputCss}
					value={_task.url}
					onChange={(e) => {
						_setTask({
							url: e.currentTarget.value,
							type: null,
							epic: null,
							trackedByTask: null,
						})
					}}
				/>
			</div>
			<div className={fieldCss}>
				<div className={labelCss}>{`Task ID:`}</div>
				<div>{taskId}</div>
			</div>
			<div className={fieldCss}>
				<div className={labelCss}>{`Task prefix:`}</div>
				<div>{prefix}</div>
			</div>
			<div className={fieldCss}>
				<div className={labelCss}>{`Type:`}</div>
				{[
					Type.Task,
					Type.NewFeature,
					Type.FeatureRequest,
					Type.Bug,
					Type.Improvement,
					Type.MaintenanceUpgradeTickets,
				].map((type) => (
					<label key={type}>
						<input
							type='radio'
							name={id + '-type'}
							checked={type === _task.type}
							onChange={(e) => {
								if (e.currentTarget.checked) {
									_setTask({
										url: _task.url,
										type: type,
										epic: _task.epic,
										trackedByTask: null,
									})
								}
							}}
						/>{' '}
						{type}
					</label>
				))}
			</div>
			{needsEpic === true && (
				<div className={fieldCss}>
					<div className={labelCss}>{`Epic:`}</div>
					{[Epic.DART, Epic.DTT].map((epic) => (
						<label key={epic}>
							<input
								type='radio'
								name={id + '-epic'}
								checked={epic === _task.epic}
								onChange={(e) => {
									if (e.currentTarget.checked) {
										_setTask({
											url: _task.url,
											type: _task.type,
											epic: epic,
											trackedByTask: _task.trackedByTask,
										})
									}
								}}
							/>{' '}
							{epic}
						</label>
					))}
				</div>
			)}
			{isBillable && !_isInner && (
				<div className={fieldCss}>
					<label
						className={labelCss}
						htmlFor={id + '-has-link'}
					>{`Has ‘tracked by’ link:`}</label>
					<div>
						<input
							type='checkbox'
							id={id + '-has-link'}
							checked={_task.trackedByTask != null}
							onChange={(e) => {
								if (e.currentTarget.checked) {
									_setTask({
										..._task,
										trackedByTask: {
											url: '',
											type: null,
											epic: null,
											trackedByTask: null,
										},
									})
								} else {
									_setTask({
										..._task,
										trackedByTask: null,
									})
								}
							}}
						/>
					</div>
				</div>
			)}
			{_task.trackedByTask && !_isInner && (
				<TaskComp
					_task={_task.trackedByTask}
					_setTask={setTask}
					_isInner
					_isUsed={useInnerTask === true}
				/>
			)}
		</fieldset>
	)
}
