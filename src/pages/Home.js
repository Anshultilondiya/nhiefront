import React, { Component } from 'react';
import { FaGlassCheers } from 'react-icons/fa';

import { Button, FormControl } from 'react-bootstrap';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import SimpleReactValidator from 'simple-react-validator';

import { Link } from 'react-router-dom';

class Home extends Component {
    state = {
        username: '',
        gameCode: '',
        showJoin: false,
        showCreate: false,
        invalid: true,
        copied: false,
        error: {
            username: false,
            code: false,
        },
    };

    validator = new SimpleReactValidator();

    uniqueGameId = () => {
        let n = Math.floor(100000 + Math.random() * 900000);
        this.setState({
            gameCode: n,
            showJoin: false,
            copied: false,
            showCreate: true,
        });
    };
    joinGame = () => {
        this.setState({ gameCode: '', showJoin: true, showCreate: false });
    };

    addUserName = (event) => {
        this.setState({
            username: event.target.value,
        });
    };
    addGameCode = (event) => {
        this.setState({
            gameCode: event.target.value,
        });
    };

    render() {
        this.validator.purgeFields();

        let letsPlayButton = (
            <Link
                to={`/game?&name=${this.state.username}&room=${this.state.gameCode}`}
            >
                <Button
                    className="btn"
                    variant="outline-success"
                    onClick={(event) => {
                        if (!this.state.username || !this.state.gameCode) {
                            event.preventDefault();
                        }
                    }}
                >
                    Let's Play
                </Button>
            </Link>
        );

        console.log(this.state.username, this.state.gameCode);
        let genCard = (
            <div
                style={{
                    marginTop: '25px',
                }}
            >
                <p
                    style={{
                        fontSize: '90%',
                        color: '#777',
                    }}
                >
                    A game is created with game code : {this.state.gameCode}{' '}
                    <br />
                    You can share this code with your friends
                </p>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignContent: 'center',
                        justifyContent: 'center',
                        marginBottom: '25px',
                    }}
                >
                    <h3 id="game-id" style={{ marginRight: '10px' }}>
                        {this.state.gameCode} {'  '}
                    </h3>
                    <CopyToClipboard
                        text={this.state.gameCode}
                        onCopy={() => this.setState({ copied: true })}
                    >
                        <Button variant="outline-success">
                            Copy to Clipboard
                        </Button>
                    </CopyToClipboard>
                </div>
                {letsPlayButton}
            </div>
        );

        let joinCard = (
            <div
                style={{
                    marginTop: '25px',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <p
                    style={{
                        color: '#777',
                        marginBottom: '10px',
                    }}
                >
                    Please Enter the Joining Code:{' '}
                </p>
                <div className="input-with-error">
                    <FormControl
                        className="input-field"
                        placeholder="Enter 6 Digit Game Code"
                        aria-label="gameCode"
                        onChange={this.addGameCode}
                        onBlur={() => this.validator.showMessageFor('code')}
                    />
                    {this.validator.message('code', this.state.gameCode, [
                        'required',
                        'numeric',
                        'min:100000,num',
                        'max:999999,num',
                    ])}
                </div>
                <div>{letsPlayButton}</div>
            </div>
        );

        return (
            <div className="Wrapper">
                <div className="welcome-screen">
                    <div className="heading">
                        <h1>
                            Never I Have Ever
                            <span style={{ paddingLeft: '20px' }}>
                                <FaGlassCheers />
                            </span>
                        </h1>
                    </div>

                    <div className="content">
                        <div className="input-with-error">
                            <div className="input-name">
                                <FormControl
                                    className="input-field"
                                    placeholder="Enter Username"
                                    aria-label="username"
                                    onChange={this.addUserName}
                                    onBlur={() =>
                                        this.validator.showMessageFor('name')
                                    }
                                />{' '}
                            </div>
                            {this.validator.message(
                                'name',
                                this.state.username,
                                'required|alpha_num_dash_space'
                            )}
                        </div>
                        <div className="homeButtons">
                            <Button
                                className="btn"
                                variant="outline-success"
                                onClick={this.uniqueGameId}
                            >
                                Create
                            </Button>
                            <Button
                                className="btn"
                                variant="outline-success"
                                onClick={this.joinGame}
                            >
                                Join
                            </Button>{' '}
                        </div>
                        {this.state.showCreate ? genCard : null}
                        {this.state.showJoin ? joinCard : null}
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
