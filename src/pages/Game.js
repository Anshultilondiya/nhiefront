import React, { Component } from 'react';

import { Container, Row, Col } from 'react-bootstrap';
import Player from '../components/PlayerAvatar';
import io from 'socket.io-client';
import queryString from 'querystring';
import { Button, FormControl } from 'react-bootstrap';

import questions from './../store/questons';
import { Link } from 'react-router-dom';
import Clock from 'react-live-clock';

class Game extends Component {
    state = {
        gamecode: '',
        you: '',
        players: '',
        sips: 0,
        drunk: false,
        questions: questions,
        category: '',
        currentQue: '',
        seconds: new Date(),
        message: '',
        sender: '',
        time: '',
        received: '',
        creator: false,
    };

    endpoint = 'https://nhieserver.herokuapp.com';
    socket = io(this.endpoint);
    componentDidMount() {
        const { name, room, creator } = queryString.parse(
            window.location.search
        );
        this.setState({
            you: name,
            gamecode: room,
            category: Object.keys(this.state.questions),
            creator: creator,
        });
        console.log({ name, room });
        this.socket.emit('join', { name, room }, () => {});
        this.socket.on('newque', (que) => {
            this.setState({ currentQue: que, drunk: false });
        });
        this.socket.on('roomData', (data) => {
            let a = data.users;
            let arr = a.map((el, index) => {
                const { id, name, num } = el;

                return { id: index, data: { id, name, num } };
            });

            this.setState({ players: arr });
        });
        this.socket.on('drink-update', (data) => {
            let player = this.state.players.find((user) => {
                if (user.data.id === data.id) {
                    return user;
                }
            });
            player.data.num = data.sips;
            let arr = this.state.players;
            arr[player.id] = player;

            this.setState({ players: arr });
            console.log(data);
        });
        this.socket.on('recent-message', (data) => {
            this.setState({
                sender: data.name,
                time: data.time,
                received: data.message,
            });
        });
    }

    drinks = (num) => {
        num = num + 1;
        this.setState({ sips: num, drunk: true });
        // let you = this.state.you;
        // let room = this.state.gamecode;
        this.socket.emit('drink', num);
    };

    next = (d) => {
        // console.log(d);

        if (d[2] === '30' || d[2] === '00') {
            let n = this.getRandomInt(0, this.state.category.length);
            let cat = this.state.category[n];
            console.log(cat);
            // console.log(this.state.questions[cat]);
            let ar = this.state.questions[cat];
            let an = this.getRandomInt(0, ar.length);
            // this.setState({ currentQue: ar[an] });
            let question = ar[an];
            // console.log(ar[an]);
            let { room } = queryString.parse(window.location.search);
            this.socket.emit('next-question', { question, room }, () => {});
        }
        // this.socket.emit('next-question', { question, room }, () => {});
    };

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }

    exit = () => {
        this.socket.emit('exit');
        // this.socket.off();
    };
    sendtoall = () => {
        let message = this.state.message;
        if (message) {
            this.socket.emit('send-to-all', message, () => {});
        }
        this.setState({ message: '' });
    };

    creatorhandler = (creator, d) => {
        if (creator) {
            this.next(d);
        }
    };

    render() {
        // console.log(this.state.currentQue);
        let player = null;

        if (this.state.players) {
            player = this.state.players.map((el, index) => {
                return (
                    <Player
                        key={index}
                        name={el.data.name}
                        sips={el.data.num}
                    />
                );
            });
        }

        return (
            <div className="gamePage">
                <nav>
                    <div>
                        <h3>Never I Have Ever</h3>
                    </div>

                    <div className="play">
                        <h5>
                            Clock :{' '}
                            <Clock
                                className="clock"
                                format={'HH:mm:ss'}
                                ticking={true}
                                timezone={'US/Pacific'}
                                onChange={(date) => {
                                    var d = date.output.split(':');
                                    this.creatorhandler(this.state.creator, d);
                                }}
                            />
                        </h5>
                        <h5>Room Code : {this.state.gamecode}</h5>
                        <h5>Username : {this.state.you}</h5>
                    </div>
                    <Link to={'/'}>
                        <Button
                            className="btn"
                            variant="outline-success"
                            onClick={this.exit}
                        >
                            Exit
                        </Button>
                    </Link>
                </nav>
                <section className="game-section">
                    <Container>
                        <Row
                            style={{
                                marginTop: '20px',
                            }}
                        >
                            <Col sm={4}>
                                <div className="all-players">
                                    <h1>All Players</h1>
                                    <div>
                                        {this.state.players ? player : null}
                                    </div>
                                </div>
                            </Col>
                            <Col sm={8}>
                                <div className="your-status">
                                    {/* <h1>Room Code : {this.state.gamecode}</h1>
                                    <h3>Username : {this.state.you}</h3> */}
                                    <h3>Your Score {this.state.sips}</h3>

                                    <div className="ques">
                                        <p>
                                            A new question will be prompted
                                            every <br />
                                            00th, 20th, 40th second
                                        </p>
                                        <div>
                                            {!this.state.currentQue ? (
                                                <Button
                                                    className="btn"
                                                    variant="outline-success"
                                                    onClick={() =>
                                                        this.next([0, 0, '00'])
                                                    }
                                                >
                                                    Start the Game
                                                </Button>
                                            ) : null}
                                            {this.state.currentQue}
                                        </div>
                                    </div>

                                    <div className="Card">
                                        <div>
                                            <Button
                                                className="btn"
                                                variant="outline-success"
                                                onClick={() => {
                                                    if (!this.state.drunk)
                                                        this.drinks(
                                                            this.state.sips
                                                        );
                                                }}
                                            >
                                                Drink
                                            </Button>
                                            <Button
                                                className="btn"
                                                variant="outline-success"
                                                onClick={() =>
                                                    this.setState({
                                                        drunk: true,
                                                    })
                                                }
                                            >
                                                Nope
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="msg-box">
                                        <FormControl
                                            className="input-field"
                                            placeholder="Send message to all players"
                                            aria-label="message"
                                            value={this.state.message}
                                            onChange={(event) => {
                                                // console.log(event.target.value);
                                                this.setState({
                                                    message: event.target.value,
                                                });
                                            }}
                                        />
                                        <Button
                                            className="btn"
                                            variant="outline-success"
                                            onClick={this.sendtoall}
                                        >
                                            Send to all
                                        </Button>
                                    </div>
                                    <div className="comments">
                                        <h5>Recent Comment</h5>
                                        {this.state.sender ? (
                                            <div className="recent-msg">
                                                <div>
                                                    <h5>{this.state.sender}</h5>
                                                    <h6>{this.state.time}</h6>
                                                </div>
                                                <p>
                                                    <h3>
                                                        {this.state.received}
                                                    </h3>
                                                </p>
                                            </div>
                                        ) : (
                                            <p>No Recent Comment</p>
                                        )}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </div>
        );
    }
}

export default Game;
