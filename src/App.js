import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Game from './pages/Game';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <Switch>
                        <Route exact path="/">
                            <Home />
                        </Route>
                        <Route exact path="/game">
                            <Game />
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
