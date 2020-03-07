import React from 'react';
import './css/ConfirmationDialog.css';

function ConfirmationDialog({ resetFn, show, hideFn }) {
    function confirmClick() {
        hideFn();
        resetFn();
    }
    return <div className='confirm-dialog' style={{display: show ? 'block' : 'none'}}>
        <p>Are you sure you want to reset?</p>
        <div>
        <button className='pure-button pure-button-primary' onClick={confirmClick}>Reset</button>
        <button className='pure-button' onClick={() => hideFn()}>Cancel</button>
        </div>
    </div>;
}

export default ConfirmationDialog;