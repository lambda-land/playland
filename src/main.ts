import { Elm } from './Main.elm';

Elm.Main.init({ node: document.getElementById('elm') });

// import { setup } from './editor';

import { initLayout } from './layout';
initLayout();

// setTimeout(() => setup(), 2000);
import axios, { Axios } from 'axios';
import { editors } from './editor';
import { encode } from 'base-64';

let failedCount = 0;
setInterval(() => {
    const editor = editors[0];
    const evalViewer = editors[1];
    const source = editor.getValue();
    const pkg = {
        'language': 'elm',
        'source': source
    }
    const nicks_rest_endpoint = (pkg: any) => 
        `http://73.25.202.209:4445/eval/${encode(JSON.stringify(pkg))}`;
    axios.get(nicks_rest_endpoint(pkg))
        .then(res => {
            console.log(res);
            const data = res.data;
            evalViewer.setValue(data);
        })
        .catch(res => {
            console.error(res);
            evalViewer.setValue(`(${failedCount}) `+'Endpoint failed to respond.');
            failedCount += 1;
        });
    console.log({...pkg,encoded:nicks_rest_endpoint(pkg)});
},4000);

import './styles/style.scss';
// import 'golden-layout/dist/less/'