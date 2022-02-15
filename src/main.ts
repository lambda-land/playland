
import { Elm } from './Main.elm';

// import qs from 'qs';
const elm = Elm.Main.init({
    node: document.getElementById('elm'),
    flags: null
});

import * as hooks from './hooks';

// import { setup } from './editor';

import { initLayout } from './layout';
initLayout();

// setTimeout(() => setup(), 2000);
import axios, { Axios } from 'axios';
import { editors } from './editor';
import { encode } from 'base-64';

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
            console.log(evalPackage)
	    elm.ports.interopToElm.send({
                tag: "evaluateExpression",
                source: source,
                expr: evalExpression
            });
            
            let failedCount = 1;
            axios.post('http://localhost:9000/eval', evalPackage)
                .then(res => {
                    const data = res.data;
                    console.log(data);
                    const { lineNumber, column } = editor.getPosition();
                    editor.setValue(prevContents + '\n' + data['evaluated'] + '\n> ');
                    editor.setPosition({ lineNumber: lineNumber + 1, column: 3 });
                    lastEvalEditorState = editor.getValue();
                    
                    elm.ports.interopToElm.send({
                        tag: "evaluationResponse",
                        value: data['evaluated']
                    });
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

// elm.ports.evaluateExpression.subscribe((expression: string) => {
//     console.log('Evaluated from Elm', expression);
// });


elm.ports.interopFromElm.subscribe(fromElm => {
    console.log(fromElm);
    switch (fromElm.tag) {
        case 'display':
            console.info('Elm:', fromElm.data.message);
            break;
    }
})

import './styles/style.scss';
// import 'golden-layout/dist/less/'
