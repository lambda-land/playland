
import { Elm } from './Main.elm';

// import qs from 'qs';
const elm = Elm.Main.init({
    node: document.getElementById('elm'),
    flags: null
});

import * as hooks from './hooks';

import { initLayout } from './layout';
initLayout();

import axios, { Axios } from 'axios';
import { editors } from './editor';
import { encode } from 'base-64';

import { storage } from './storage';

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
let lastEvalEditorState = 'λ ';
let lastEditorState = lastEvalEditorState;
let immutableEditorContext = lastEvalEditorState;
let ignoreInput = false;
// function setupReplEditor(editor: monaco.editor.IStandaloneCodeEditor) {
function setupReplEditor(editors: Map<string,monaco.editor.IStandaloneCodeEditor>) {

    const outputView = editors.get('repl-output');
    const inputEditor = editors.get('repl-input');


    const outputViewOptions = {
        minimap: {enabled : false},
        lineNumbers: 'off',
        lineNumbersMinChars: 0,
        lineDecorationsWidth: 0,
        // theme: 'hc-black'
    } as monaco.editor.IEditorOptions;
    outputView.setValue(lastEvalEditorState);
    outputView.updateOptions(outputViewOptions);
    
    const inputEditorOptions = {
        ...outputViewOptions
    } as monaco.editor.IEditorOptions;
    inputEditor.setValue(lastEvalEditorState);
    inputEditor.updateOptions(inputEditorOptions);
    
    // This works START
    // const container = (document as any).getElementById('eval-container');
    // container.classList.add('eval-window');
    // // container.style.cssText += 'background-color: #1a2e34 !important;';
    // // container.querySelector('.monaco-editor').style.backgroundColor = '#1a2e34';
    // const backgrounds = [...container.querySelectorAll('.monaco-editor-background'),...container.querySelectorAll('.monaco-editor'),...container.querySelectorAll('.margin')]
    // for (const bg of backgrounds) {
    //     bg.style.backgroundColor = '#1a2e34';
    //     bg.style.cssText += 'background-color: #1a2e34 !important;';
    // }
    // This works END


    // for (const vl of container.querySelectorAll('.')) {
    //     vl.style.border += 'border: 2px solid #1a2e34 !important;';
    // }

    const editor = inputEditor;
    inputEditor.onKeyDown(event => {

        if (event.keyCode == 3) {
            const prevContents = inputEditor.getValue();
            const source = editors.get('program-editor').getValue();

            // setTimeout(() => editor.updateOptions({ readOnly: true, theme: 'monokai' }), 0);

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
            axios.post('http://18.237.13.211:9000/eval', evalPackage)
            // axios.post('https://playland.grape-juice.org/eval', evalPackage)
                .then(res => {
                    // editor.updateOptions({ readOnly: false });

                    const data = res.data;
                    console.log(data);
                    const { lineNumber, column } = editor.getPosition();

                    // outputView.setValue(prevContents + '\n' + (data['evaluated'] || data['error']) + '\nλ ');

                    inputEditor.setValue('λ ');
                    inputEditor.setPosition({ lineNumber: 1, column: 3 });
    

                    outputView.setValue(outputView.getValue() + '\n' + (data['evaluated'] || data['error']) + '\nλ ');
                    outputView.setPosition({ lineNumber: lineNumber + (data['evaluated'] || data['error']).length + 1, column: 3 });
                    lastEvalEditorState = outputView.getValue();


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
                    outputView.setValue(`(${failedCount}) ` + 'Endpoint failed to respond.');
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
}

setTimeout(() => {
    setupReplEditor(editors);
    if (storage.getItem('session-editor')) {
        const { source } = storage.getItem('session-editor');
        editors.get('program-editor').setValue(source);
    }
}, 0);


elm.ports.interopFromElm.subscribe(fromElm => {
    console.log(fromElm);
    switch (fromElm.tag) {
        case 'display':
            console.info('Elm:', fromElm.data.message);
            break;
    }
})

import './styles/style.scss';
(window as any).editors = editors
