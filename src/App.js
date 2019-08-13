import React,{ Component } from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
/*
  路由组件需要用Route加载
  Switch 是切换组件，只匹配第一个路由

 */

import Login from './pages/login';
import Admin from './pages/admin';

export default class App extends Component{
  render(){
    return <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" component={Admin} />
      </Switch>
    </Router>
  }
}