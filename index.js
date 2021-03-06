import 'babel-polyfill'
import React from 'react'
import {render} from 'react-dom'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import reducer from './reducers'
import {getList} from './actions/list'
import {changeNav} from './actions/nav'
import {getCategory} from './actions/dropdown'
import App from './containers/App'
let Url = require('url')

let middleware = []
let root = document.getElementById('mission-center-root')

if (root === null) {
	root = document.body.appendChild(document.createElement('div'))
	root.setAttribute('id', 'mission-center-root')
}

if (process.env.CTX_ENV && !window.$ctx) {
	window.$ctx = process.env.CTX_ENV
}


if (process.env.NODE_ENV === "develop") {
	let logger = require('redux-logger')
	middleware.push(logger())
	require('rc-tree/assets/index.css')
	require('bootstrap/dist/css/bootstrap.css')
	require('./style/bootstrap-reset.css')
	require('./style/index.css')
	require('./style/loading.css')
	require('./style/iconfont/iconfont.css')
}

if (process.env.NODE_ENV === "build") {
	require('bootstrap/dist/css/bootstrap.css')
	require('rc-tree/assets/index.css')
	require('./style/bootstrap-reset.css')
	require('./style/index.css')
	require('./style/loading.css')
	require('./style/iconfont/iconfont.css')
}

middleware = [thunk].concat(middleware)

const store = createStore(
	reducer,
	applyMiddleware(...middleware)
)

let curNav = Url.parse(location.href, true).query.curNav - 0;
curNav = curNav || 0;
store.dispatch(changeNav(curNav));
store.dispatch(getList());
// 好像这个category没啥用啊
// store.dispatch(getCategory());

render(
	<Provider store={store}>
		<App />
	</Provider>,
	root
)
