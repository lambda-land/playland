
// import { Elm } from './Main.elm';

// // import qs from 'qs';
// const elm = Elm.Main.init({
//     node: document.getElementById('elm'),
//     flags: null
// });

import * as hooks from './hooks';

import { initLayout } from './layout';
initLayout();

import axios, { Axios } from 'axios';
import { editors } from './editor';
import { encode } from 'base-64';

import { storage } from './storage';

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
// import * as monaco from 'monaco-editor';

let lastEvalEditorState = '> ';
let lastEditorState = lastEvalEditorState;
let immutableEditorContext = lastEvalEditorState;
let ignoreInput = false;
let locked = false;
// function setupReplEditor(editor: monaco.editor.IStandaloneCodeEditor) {
function setupReplEditor(editors: Map<string,monaco.editor.IStandaloneCodeEditor>) {

    const outputView = editors.get('repl-output');
    const inputEditor = editors.get('repl-input');


    const outputViewOptions = {
        minimap: { enabled : false },
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
    

    const editor = inputEditor;
    inputEditor.onKeyDown(event => {

        const block = () => {
            event.preventDefault();
            event.stopPropagation();
        }

        const clear = () => {
            inputEditor.setValue('> ');
            inputEditor.setPosition({ lineNumber: 1, column:  3});
        }
        
        if (locked === true || 
                (event.keyCode == 3 &&
                    inputEditor.getValue().substring(2).trim().length == 0)) 
        {
            block();
            clear();
            return;
        }

        if (event.keyCode == 3) {

            locked = true;

            const source = editors.get('program-editor').getValue();
            const evalExpression = inputEditor.getValue().substring(2).trim();

            block();
            clear();


            const pkg = {
                'language': 'elm',
                'source': source
            }
            
            const evalPackage = { ...pkg, expression: evalExpression /*pkg.source.split('\n').at(-1)*/ };


            storage.setItem('session-editor', { source });

            let failedCount = 1;
            axios.post('http://18.237.13.211:9000/eval', evalPackage)
            // axios.post('https://playland.grape-juice.org/eval', evalPackage)
                .then(res => {
                    // editor.updateOptions({ readOnly: false });

                    const data = res.data;
                    console.log(data);
                    const { lineNumber, column } = outputView.getPosition();

                    outputView.setValue(outputView.getValue() + evalExpression + '\n' + (data['evaluated'] || data['error']) + '\n> ');
                    outputView.setPosition({ lineNumber: lineNumber + (data['evaluated'] || data['error']).length + 1, column: 3 });
                    outputView.revealLine(outputView.getModel().getLineCount());

                    lastEvalEditorState = outputView.getValue();


                    lastEditorState = lastEvalEditorState;
                    immutableEditorContext = lastEvalEditorState;

                    locked = false;

                    // elm.ports.interopToElm.send({
                    //     tag: "evaluationResponse",
                    //     value: data['evaluated']
                    // });
                })
                .catch(res => {
                    console.error(res);
                    outputView.setValue(`(${failedCount}) ` + 'Endpoint failed to respond.\n' + res.message);
                    failedCount += 1;
                    locked = false;
                });
        } else if (event.keyCode === 1) {
            const { column } = inputEditor.getPosition();
            if (column < 4) {
                block();
                return;
            }
        }
    })
}


import themeList from 'monaco-themes/themes/themelist.json';

// import { registerAllAvailableLanguages } from 'monaco-ace-tokenizer/lib/lazy';

setTimeout(async () => {
    // registerAllAvailableLanguages();
    const themeData: any = {}
    const fetches = Object.entries(themeList).map(async ([name,path]) => {
        console.log(name,path);
        const data = await import(`monaco-themes/themes/${path}.json`)
        themeData[name] = data;
        return { name, path, theme: data };
    });
    const themes = await Promise.all(fetches);

    for (const {name, path, theme} of themes) {
        monaco.editor.defineTheme(name, theme);
    }

    setupReplEditor(editors);
    if (storage.getItem('session-editor')) {
        const { source } = storage.getItem('session-editor');
        editors.get('program-editor').setValue(source);
    }
    for (const {name, path, theme} of themes) {
        await new Promise((res,rej) => {
            for (const editor of editors.values()) {
                editor.updateOptions({
                    fontFamily: 'Liberation Mono',
                    theme: name,
                })
            }
            const replBGColor = themeData[name]['colors']['editor.lineHighlightBackground']
            const container = (document as any).getElementById('eval-container');
            // container.classList.add('eval-output-window');
            const backgrounds = [...container.querySelectorAll('.monaco-editor-background'),...container.querySelectorAll('.monaco-editor'),...container.querySelectorAll('.margin')]
            for (const bg of backgrounds) {
                bg.style.backgroundColor = replBGColor;
                bg.style.cssText += `background-color: ${replBGColor} !important;`;
            }
        setTimeout(() => {res(null)},5000);});
    }


}, 0);


// elm.ports.interopFromElm.subscribe(fromElm => {
//     console.log(fromElm);
//     switch (fromElm.tag) {
//         case 'display':
//             console.info('Elm:', fromElm.data.message);
//             break;
//     }
// })

import './styles/LiberationMono-Regular.ttf';
import './styles/SF-Mono-Light.otf';
import './styles/SF-Mono-Regular.otf';

import './styles/style.scss';
(window as any).editors = editors
