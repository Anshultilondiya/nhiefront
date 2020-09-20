import React from 'react';

const Player = (props) => {
    return (
        <div className="player">
            <div className="player-details">
                <div>{props.name} </div>
                <div>
                    <span>Score </span>
                    <span>{props.sips}</span>
                </div>
            </div>
        </div>
    );
};

export default Player;
