const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const favoriteFood = e.target.querySelector('#domoFood').value
    console.log(favoriteFood);

    if (!name || !age) {
        helper.handleError('Name and age are required!');
        return false;
    }

    helper.sendPost(e.target.action, {name, age, favoriteFood}, onDomoAdded);
    return false;
}

const deleteDomo = (e) => {
    e.preventDefault();
    helper.hideError();
}

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            name="domoForm"
            onSubmit={(e) => handleDomo(e, props.triggerReload)}
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name*: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="age">Age*: </label>
            <input id="domoAge" type="number" min="0" name="age"/>
            <label htmlFor="favoriteFood">Favorite Food: </label>
            <input id="domoFood" type="text" name="favoriteFood" placeholder="Favorite Food" />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
};

const DomoList = (props) => {
    const [domos, setDomos] = useState(props.domos);

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const data = await response.json();
            setDomos(data.domos);
        };
        loadDomosFromServer();
    }, [props.reloadDomos]);

    if (domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }

    const domoNodes = domos.map(domo => {
        return (
            <div key={domo.id} className="domo">
                <img src="assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
                <h3 className="domoFood">Favorite Food: {domo.favoriteFood}</h3>
                <button type="submit" action="/maker" method="DELETE" onClick={(e) => deleteDomo(e, props.triggerReload)}>Delete Domo</button>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const App = () => {
    const [reloadDomos, setReloadDomos] = useState(false);

    return (
        <div>
            <div id="makeDomo">
                <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
            <div id="domos">
                <DomoList domos={[]} reloadDomos={reloadDomos}/>
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;