
// import { Elm } from './Main.elm';

// // import qs from 'qs';
// const elm = Elm.Main.init({
//     node: document.getElementById('elm'),
//     flags: null
// });

import * as hooks from './hooks';

import { initLayout, editorThemes } from './layout';

const layoutInitializer = initLayout();

import axios, { Axios } from 'axios';
import { editors } from './editor';


import { storage } from './storage';

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';



// import * as monaco from 'monaco-editor';

let lastEvalEditorState = '> ';
let lastEditorState = lastEvalEditorState;
let immutableEditorContext = lastEvalEditorState;
let ignoreInput = false;
let locked = false;

const history: string[] = [];
let historyIdx = 1;


function processSource(source: string): string {
    const linebreak = /\r\n|\n\r|\n|\r/g;
    const comments = /(--[^\n\r]*)/g;
    const emptylines = /^(?:[\t ]*(?:\r?\n|\r))+/gm;

    const reduced = source.replace(comments,'')
                          .replace(emptylines,'')
                          .replace(linebreak, '\n');

    return reduced;
}

function getEvaluationEndpoint() {
    const page = (window as any).location.href;
    switch (page) {
        case 'http://18.237.13.211/':
            return 'http://18.237.13.211:9000/eval';
        case 'http://35.166.255.165/':
        case 'http://localhost:3000/':
            return 'http://35.166.255.165:9000/eval'
        case 'https://playland.netlify.app/':
            return 'https://playland.netlify.app/eval';
        case 'http://playland.engr.oregonstate.edu/':
            return 'http://playland.engr.oregonstate.edu:9000/eval';
        case 'https://playland.engr.oregonstate.edu/':
            return 'https://playland.engr.oregonstate.edu:9000/eval';
        default:
            return 'https://playland.netlify.app/eval';
            // return page + 'eval'
    }
}

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
            inputEditor.getPosition().column < 3 || 
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
            const reduced = processSource(source);

            const evalExpression = inputEditor.getValue().substring(2).trim();


            // if (history.at(history.length - 1) !== evalExpression) {  history.push(evalExpression); }
            if (history.length > 0) {
                if (history[history.length - 1] !== evalExpression) {
                    history.push(evalExpression);
                }
            } else {
                history.push(evalExpression);
            }

            historyIdx = history.length;

            block();
            clear();


            const pkg = {
                'language': 'elm',
                'source': reduced
            }
            
            const evalPackage = { ...pkg, expression: evalExpression /*pkg.source.split('\n').at(-1)*/ };


            storage.setItem('session-editor', { source });

            let failedCount = 1;
            // axios.post('http://18.237.13.211:9000/eval', evalPackage)
            // axios.post('https://welloffdotingomnipage.iainmon.repl.co/eval', evalPackage)

            // axios.post('https://playland.grape-juice.org/eval', evalPackage)
            // axios.post('https://play-land.netlify.app/eval',evalPackage)
            const endpoint = getEvaluationEndpoint();
            axios.post(endpoint,evalPackage
            //     ,{
            //     // headers: {
            //     //     // 'Access-Control-Allow-Origin': '*',
            //     //     // 'Content-Type': 'application/json',
            //     // }
            // }
            )
                .then(res => {
                    // editor.updateOptions({ readOnly: false });

                    const data = res.data;
                    console.log(data);
                    const { lineNumber, column } = outputView.getPosition();

                    outputView.setValue(outputView.getValue() + evalExpression + '\n' + (data['evaluated'] || data['error']) + '\n> ');
                    outputView.setPosition({ lineNumber: outputView.getModel().getLineCount(), column: 3 });
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
        } else if (event.keyCode === 1 || event.keyCode === 15) {
            const { column } = inputEditor.getPosition();
            if (column < 4) {
                block();
                return;
            }
        } else if (event.keyCode === 16 || event.keyCode === 18) {
            
            block();
            
            const inc = (event.keyCode == 16 ? -1 : 1);

            if (historyIdx + inc < 0 || history.length === 0) {
                historyIdx = 0;
                
            } else if (historyIdx + inc >= history.length) {
                historyIdx = history.length;
                if (inputEditor.getValue() == '> ') { return; }
                inputEditor.setValue('> ');
                inputEditor.setPosition({ lineNumber: 1, column: 3 });
                
            } else {
                historyIdx += inc;
                const { column } = inputEditor.getPosition();
                const newInput = '> ' + history[historyIdx];
                inputEditor.setValue(newInput);
                inputEditor.setPosition({ lineNumber: 1, column: newInput.length + 1});
            }
        }

        

    })

}




layoutInitializer
.then(async () => {

    setupReplEditor(editors);

    if (storage.getItem('session-editor')) {
        const { source } = storage.getItem('session-editor');
        editors.get('program-editor').setValue(source);
    }
    
    for (const editor of editors.values()) {
        editor.updateOptions({
            fontFamily: "'SFMono', 'sf_monoregular','SF Mono', monospace",
            fontWeight: '500',
            fontSize: 13,
            fontLigatures: true,
            theme: storage.getItem('user-theme') || 'katzenmilch',
        })
    }

});


// import './styles/LiberationMono-Regular.ttf';
// import './styles/SFMono.ttf';

// import './styles/Fira_Code_v6.2/'
// import './styles/SF-Mono-Light.otf';
// import './styles/SF-Mono-Regular.otf';
// import './styles/fonts/stylesheet.css';
import './styles/style.scss';
import './styles/favicon/favicon.png';
import './styles/favicon/favicon.svg';
(window as any).editors = editors
