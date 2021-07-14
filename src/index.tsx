import React from 'react'
import ReactDOM from 'react-dom'
import { AppComp } from './comp/AppComp'
import './screen.scss'

ReactDOM.render(
	<React.StrictMode>
		<AppComp />
	</React.StrictMode>,
	document.getElementById('root'),
)
