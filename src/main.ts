import { Elm } from './Main.elm';
// import qs from 'qs';
const elm = Elm.Main.init({ node: document.getElementById('elm') });

import * as hooks from './hooks';

// import { setup } from './editor';

import { initLayout } from './layout';
initLayout();

// setTimeout(() => setup(), 2000);
import axios, { Axios } from 'axios';
import { editors } from './editor';
import { encode } from 'base-64';

// let failedCount = 0;
// setInterval(() => {
//     const editor = editors[0];
//     const evalViewer = editors[1];
//     const source = editor.getValue();
//     const pkg = {
//         'language': 'elm',
//         'source': source
//     }
//     const nicks_rest_endpoint = (pkg: any) => 
//         `http://73.25.202.209:4445/eval/${encode(JSON.stringify(pkg))}`;
//     // axios.get(nicks_rest_endpoint(pkg))
//     //     .then(res => {
//     //         console.log(res);
//     //         const data = res.data;
//     //         evalViewer.setValue(data);
//     //     })
//     //     .catch(res => {
//     //         console.error(res);
//     //         evalViewer.setValue(`(${failedCount}) `+'Endpoint failed to respond.');
//     //         failedCount += 1;
//     //     });

//     const evalPackage = {...pkg, expression: 'h + 1' /*pkg.source.split('\n').at(-1)*/ };
//     console.log(evalPackage);
//     axios.post('http://localhost:9000', evalPackage)
//         .then(res => {
//             const data = res.data;
//             console.log(data);
//             evalViewer.setValue(data['evaluated']);
//         })
//         .catch(res => {
//             console.error(res);
//             evalViewer.setValue(`(${failedCount}) `+'Endpoint failed to respond.');
//             failedCount += 1;
//         });
//     // console.log({...pkg,encoded:nicks_rest_endpoint(pkg)});
// },6000);

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
let lastEvalEditorState = '> ';
function setupReplEditor(editor: monaco.editor.IStandaloneCodeEditor) {
    editor.setValue(lastEvalEditorState);
    editor.onKeyDown(event => {
        if (event.keyCode == 3) {
            const prevContents = editor.getValue();
            const source = editors[0].getValue();

            const pkg = {
                'language': 'elm',
                'source': source
            }

            // const evalExpressionLength = prevContents.length - lastEvalEditorState.length;
            const evalExpression = prevContents.substring(lastEvalEditorState.length, prevContents.length)
            const evalPackage = {...pkg, expression: evalExpression /*pkg.source.split('\n').at(-1)*/ };
            
            elm.ports.evaluationReceiver.send(evalExpression);
            
            let failedCount = 1;
            axios.post('http://localhost:9000', evalPackage)
                .then(res => {
                    const data = res.data;
                    console.log(data);
                    const { lineNumber, column } = editor.getPosition();
                    editor.setValue(prevContents + '\n' + data['evaluated'] + '\n> ');
                    editor.setPosition({ lineNumber: lineNumber + 1, column: 3 });
                    lastEvalEditorState = editor.getValue();
                })
                .catch(res => {
                    console.error(res);
                    editor.setValue(`(${failedCount}) `+'Endpoint failed to respond.');
                    failedCount += 1;
                });
        }
        if (event.keyCode == 1) {
            const prevContents = editor.getValue();
            const { lineNumber, column } = editor.getPosition();
            new Promise((res,rej) => {
                editor.setValue(lastEvalEditorState);
                editor.setPosition({ lineNumber: lineNumber, column: 3 })
                res(true);
            });
        }
    })
}

setTimeout(() => {
    setupReplEditor(editors[1]);
}, 0);

elm.ports.evaluateExpression.subscribe((expression: string) => {
    console.log('Evaluated from Elm', expression);
});


import './styles/style.scss';
// import 'golden-layout/dist/less/'