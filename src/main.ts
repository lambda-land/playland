
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

import { storage } from './storage';

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
let lastEvalEditorState = 'λ ';
let lastEditorState = lastEvalEditorState;
let immutableEditorContext = lastEvalEditorState;
let ignoreInput = false;
function setupReplEditor(editor: monaco.editor.IStandaloneCodeEditor) {
    editor.setValue(lastEvalEditorState);
    editor.updateOptions({
        minimap: {enabled : false},
        lineNumbers: 'off',
        lineNumbersMinChars: 0,
        lineDecorationsWidth: 0,
        // theme: 'hc-black'
    });
    const container = (document as any).getElementById('eval-container');
    container.classList.add('eval-window');
    // container.style.cssText += 'background-color: #1a2e34 !important;';
    // container.querySelector('.monaco-editor').style.backgroundColor = '#1a2e34';
    const backgrounds = [...container.querySelectorAll('.monaco-editor-background'),...container.querySelectorAll('.monaco-editor'),...container.querySelectorAll('.margin')]
    for (const bg of backgrounds) {
        bg.style.backgroundColor = '#1a2e34';
        bg.style.cssText += 'background-color: #1a2e34 !important;';
    }
    // for (const vl of container.querySelectorAll('.')) {
    //     vl.style.border += 'border: 2px solid #1a2e34 !important;';
    // }
    editor.onKeyDown(event => {

        if (event.keyCode == 3) {
            const prevContents = editor.getValue();
            const source = editors[0].getValue();

            setTimeout(() => editor.updateOptions({ readOnly: true, theme: 'vs-dark' }), 0);

            const pkg = {
                'language': 'elm',
                'source': source
            }

            // const evalExpressionLength = prevContents.length - lastEvalEditorState.length;
            const evalExpression = prevContents.substring(lastEvalEditorState.length, prevContents.length)
            const evalPackage = { ...pkg, expression: evalExpression /*pkg.source.split('\n').at(-1)*/ };
            elm.ports.interopToElm.send({
                tag: "evaluateExpression",
                source: source,
                expr: evalExpression
            });

            console.log(evalPackage)

            storage.setItem('session-editor', { source });

            let failedCount = 1;
            // axios.post('https://playland.grape-juice.org/', evalPackage)
            axios.post('http://localhost:9000/eval', evalPackage)
                .then(res => {
                    editor.updateOptions({ readOnly: false });

                    const data = res.data;
                    console.log(data);
                    const { lineNumber, column } = editor.getPosition();
                    editor.setValue(prevContents + '\n' + (data['evaluated'] || data['error']) + '\nλ ');
                    editor.setPosition({ lineNumber: lineNumber + 1, column: 3 });
                    lastEvalEditorState = editor.getValue();

                    lastEditorState = lastEvalEditorState;
                    immutableEditorContext = lastEvalEditorState;

                    ignoreInput = false;

                    elm.ports.interopToElm.send({
                        tag: "evaluationResponse",
                        value: data['evaluated']
                    });
                })
                .catch(res => {
                    console.error(res);
                    editor.setValue(`(${failedCount}) ` + 'Endpoint failed to respond.');
                    failedCount += 1;
                });
        } else if (event.keyCode === 1) {
            const prevContents = editor.getValue();
            const { lineNumber, column } = editor.getPosition();
            if (column < 4) {
                new Promise((res, rej) => {
                    const next = immutableEditorContext;
                    editor.setValue(next + ' ');
                    editor.setPosition({ lineNumber: lineNumber, column: 4 });
                    res(true);
                });
                return;
            }
        }
    })
    // editor.onKeyUp(event => {
    //     lastEditorState = editor.getValue();
    // })
}

setTimeout(() => {
    setupReplEditor(editors[1]);
    if (storage.getItem('session-editor')) {
        const { source } = storage.getItem('session-editor');
        editors[0].setValue(source);
    }
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
// setTimeout(() => editors[1].updateOptions({ readOnly: true, theme: 'monokai' }), 100);
// import 'golden-layout/dist/less/'
(window as any).editors = editors
