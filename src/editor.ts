
import 'monaco-editor/esm/vs/editor/browser/controller/coreCommands.js';
import 'monaco-editor/esm/vs/editor/browser/widget/codeEditorWidget.js';
// import 'monaco-editor/esm/vs/editor/browser/widget/diffEditorWidget.js';
// import 'monaco-editor/esm/vs/editor/browser/widget/diffNavigator.js';
// import 'monaco-editor/esm/vs/editor/contrib/anchorSelect/anchorSelect.js';
import 'monaco-editor/esm/vs/editor/contrib/bracketMatching/bracketMatching.js';
// import 'monaco-editor/esm/vs/editor/contrib/caretOperations/caretOperations.js';
// import 'monaco-editor/esm/vs/editor/contrib/caretOperations/transpose.js';
// import 'monaco-editor/esm/vs/editor/contrib/clipboard/clipboard.js';
// import 'monaco-editor/esm/vs/editor/contrib/codeAction/codeActionContributions.js';
// import 'monaco-editor/esm/vs/editor/contrib/codelens/codelensController.js';
// import 'monaco-editor/esm/vs/editor/contrib/colorPicker/colorContributions.js';
import 'monaco-editor/esm/vs/editor/contrib/comment/comment.js';
// import 'monaco-editor/esm/vs/editor/contrib/contextmenu/contextmenu.js';
import 'monaco-editor/esm/vs/editor/contrib/cursorUndo/cursorUndo.js';
// import 'monaco-editor/esm/vs/editor/contrib/dnd/dnd.js';
// import 'monaco-editor/esm/vs/editor/contrib/documentSymbols/documentSymbols.js';
import 'monaco-editor/esm/vs/editor/contrib/find/findController.js';
// import 'monaco-editor/esm/vs/editor/contrib/folding/folding.js';
// import 'monaco-editor/esm/vs/editor/contrib/fontZoom/fontZoom.js';
// import 'monaco-editor/esm/vs/editor/contrib/format/formatActions.js';
// import 'monaco-editor/esm/vs/editor/contrib/gotoError/gotoError.js';
// import 'monaco-editor/esm/vs/editor/contrib/gotoSymbol/goToCommands.js';
// import 'monaco-editor/esm/vs/editor/contrib/gotoSymbol/link/goToDefinitionAtPosition.js';
// import 'monaco-editor/esm/vs/editor/contrib/hover/hover.js';
// import 'monaco-editor/esm/vs/editor/contrib/inPlaceReplace/inPlaceReplace.js';
import 'monaco-editor/esm/vs/editor/contrib/indentation/indentation.js';
// import 'monaco-editor/esm/vs/editor/contrib/inlineHints/inlineHintsController.js';
// import 'monaco-editor/esm/vs/editor/contrib/linesOperations/linesOperations.js';
// import 'monaco-editor/esm/vs/editor/contrib/linkedEditing/linkedEditing.js';
// import 'monaco-editor/esm/vs/editor/contrib/links/links.js';
// import 'monaco-editor/esm/vs/editor/contrib/multicursor/multicursor.js';
// import 'monaco-editor/esm/vs/editor/contrib/parameterHints/parameterHints.js';
import 'monaco-editor/esm/vs/editor/contrib/rename/rename.js';
import 'monaco-editor/esm/vs/editor/contrib/smartSelect/smartSelect.js';
// import 'monaco-editor/esm/vs/editor/contrib/snippet/snippetController2.js';
import 'monaco-editor/esm/vs/editor/contrib/suggest/suggestController.js';
// import 'monaco-editor/esm/vs/editor/contrib/toggleTabFocusMode/toggleTabFocusMode.js';
// import 'monaco-editor/esm/vs/editor/contrib/unusualLineTerminators/unusualLineTerminators.js';
// import 'monaco-editor/esm/vs/editor/contrib/viewportSemanticTokens/viewportSemanticTokens.js';
// import 'monaco-editor/esm/vs/editor/contrib/wordHighlighter/wordHighlighter.js';
// import 'monaco-editor/esm/vs/editor/contrib/wordOperations/wordOperations.js';
// import 'monaco-editor/esm/vs/editor/contrib/wordPartOperations/wordPartOperations.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/accessibilityHelp/accessibilityHelp.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoLineQuickAccess.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoSymbolQuickAccess.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneHelpQuickAccess.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/referenceSearch/standaloneReferenceSearch.js';
// import 'monaco-editor/esm/vs/editor/standalone/browser/toggleHighContrast/toggleHighContrast.js';
// END_FEATURES

// import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
// import * as monaco from 'monaco-editor';


import './styles/syntax/elm.contribution';


import monokai from 'monaco-themes/themes/Monokai.json';
monaco.editor.defineTheme('monokai', monokai as monaco.editor.IStandaloneThemeData);

// import complete_dark from './styles/editor-themes/complete-dark.json';

// const { parseTmTheme } = require('monaco-themes');
// monaco.editor.defineTheme('complete-dark', parseTmTheme(JSON.stringify(complete_dark)) as monaco.editor.IStandaloneThemeData);

type Pair<T,U>=[T,U];

const theme = 'vs-dark'; // 'vs-dark'

export let editors: Map<string, monaco.editor.IStandaloneCodeEditor> = new Map<string, monaco.editor.IStandaloneCodeEditor>();//: Pair<monaco.editor.IStandaloneCodeEditor,monaco.editor.ITextModel>[]= [];
let first = false;
// declare let self: any;
// let MonacoEnvironment;
export function setupProgramEditor(node: HTMLElement, editorOptions={},defaultSource: string | null = null) {
    const options = {
        value: [ (defaultSource != null ? defaultSource :
`
module PlayLand exposing (..)

-- Welcome to PlayLand!

nums : number -> List number
nums n = 
  if n == 0 
    then [] 
    else n :: nums (n - 1)

fib : number -> number
fib n = 
  if n < 2
    then 1
    else fib (n - 1) + fib (n - 2)

fibs : number -> List number
fibs n = List.map fib (nums n)

`)
        ].join('\n'),
        language: 'elm',
        theme: theme,// 'vs-dark',
        automaticLayout: true,
        // readOnly: false,
        ...editorOptions
    };
    // first = true;
    const editor = monaco.editor.create(node, options);

    editors.set('program-editor', editor);

    return node;
}

export function setupReplOutput(node: HTMLElement) {
    const options = {
        language: 'elm',
        theme: theme,// 'vs-dark',
        automaticLayout: true,
        readOnly: true,
    };

    const editor = monaco.editor.create(node, options);

    editors.set('repl-output',editor);

    setTimeout(() => {
        const container = (document as any).getElementById('eval-container');
        container.classList.add('eval-output-window');
        // const backgrounds = [...container.querySelectorAll('.monaco-editor-background'),...container.querySelectorAll('.monaco-editor'),...container.querySelectorAll('.margin')]
        // for (const bg of backgrounds) {
        //     bg.style.backgroundColor = '#1a2e34';
        //     bg.style.cssText += 'background-color: #1a2e34 !important;';
        // }
    }, 0);


    return node;
}

export function setupReplInput(node: HTMLElement) {
    const options = {
        language: 'elm',
        theme: theme,
        automaticLayout: true,
    };
    const editor = monaco.editor.create(node, options);

    editors.set('repl-input',editor);

    setTimeout(() => {
        const container = (document as any).getElementById('input-container');
        container.classList.add('eval-input-window');
        // const backgrounds = [...container.querySelectorAll('.monaco-editor-background'),...container.querySelectorAll('.monaco-editor'),...container.querySelectorAll('.margin')]
        // for (const bg of backgrounds) {
        //     bg.style.backgroundColor = '#1a2e34';
        //     bg.style.cssText += 'background-color: #1a2e34 !important;';
        // }
    }, 0);

    return node;
}


export function layout() {
    for (const editor of editors.values()) {
        editor.layout();
    }
}
export function setValue(v: string) {
    for (const editor of editors.values()) {
        editor.setValue(v);
    }
}



// import * as languages from 'monaco-languages';

console.log(monaco.languages.getLanguages())
