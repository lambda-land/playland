
import 'monaco-editor/esm/vs/editor/browser/controller/coreCommands.js';
// import 'monaco-editor/esm/vs/editor/browser/widget/codeEditorWidget.js';
// import 'monaco-editor/esm/vs/editor/browser/widget/diffEditorWidget.js';
// import 'monaco-editor/esm/vs/editor/browser/widget/diffNavigator.js';
// import 'monaco-editor/esm/vs/editor/contrib/anchorSelect/anchorSelect.js';
// import 'monaco-editor/esm/vs/editor/contrib/bracketMatching/bracketMatching.js';
// import 'monaco-editor/esm/vs/editor/contrib/caretOperations/caretOperations.js';
// import 'monaco-editor/esm/vs/editor/contrib/caretOperations/transpose.js';
// import 'monaco-editor/esm/vs/editor/contrib/clipboard/clipboard.js';
// import 'monaco-editor/esm/vs/editor/contrib/codeAction/codeActionContributions.js';
// import 'monaco-editor/esm/vs/editor/contrib/codelens/codelensController.js';
// import 'monaco-editor/esm/vs/editor/contrib/colorPicker/colorContributions.js';
// import 'monaco-editor/esm/vs/editor/contrib/comment/comment.js';
// import 'monaco-editor/esm/vs/editor/contrib/contextmenu/contextmenu.js';
// import 'monaco-editor/esm/vs/editor/contrib/cursorUndo/cursorUndo.js';
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
// import 'monaco-editor/esm/vs/editor/contrib/indentation/indentation.js';
// import 'monaco-editor/esm/vs/editor/contrib/inlineHints/inlineHintsController.js';
// import 'monaco-editor/esm/vs/editor/contrib/linesOperations/linesOperations.js';
// import 'monaco-editor/esm/vs/editor/contrib/linkedEditing/linkedEditing.js';
// import 'monaco-editor/esm/vs/editor/contrib/links/links.js';
// import 'monaco-editor/esm/vs/editor/contrib/multicursor/multicursor.js';
// import 'monaco-editor/esm/vs/editor/contrib/parameterHints/parameterHints.js';
// import 'monaco-editor/esm/vs/editor/contrib/rename/rename.js';
// import 'monaco-editor/esm/vs/editor/contrib/smartSelect/smartSelect.js';
// import 'monaco-editor/esm/vs/editor/contrib/snippet/snippetController2.js';
// import 'monaco-editor/esm/vs/editor/contrib/suggest/suggestController.js';
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

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';

// (2) Desired languages:
// BEGIN_LANGUAGES
// import 'monaco-editor/esm/vs/language/css/monaco.contribution.js';
// import 'monaco-editor/esm/vs/language/html/monaco.contribution.js';
// import 'monaco-editor/esm/vs/language/json/monaco.contribution.js';
// import 'monaco-editor/esm/vs/language/typescript/monaco.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/abap/abap.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/apex/apex.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/azcli/azcli.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/bat/bat.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/cameligo/cameligo.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/clojure/clojure.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/coffee/coffee.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/csharp/csharp.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/csp/csp.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/css/css.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/dart/dart.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/dockerfile/dockerfile.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/ecl/ecl.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/fsharp/fsharp.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/go/go.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/graphql/graphql.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/handlebars/handlebars.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/hcl/hcl.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/html/html.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/ini/ini.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/java/java.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/julia/julia.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/kotlin/kotlin.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/less/less.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/lexon/lexon.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/lua/lua.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/m3/m3.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/markdown/markdown.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/mips/mips.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/msdax/msdax.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/mysql/mysql.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/objective-c/objective-c.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/pascal/pascal.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/pascaligo/pascaligo.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/perl/perl.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/pgsql/pgsql.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/php/php.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/postiats/postiats.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/powerquery/powerquery.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/powershell/powershell.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/pug/pug.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/python/python.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/r/r.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/razor/razor.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/redis/redis.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/redshift/redshift.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/restructuredtext/restructuredtext.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/ruby/ruby.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/rust/rust.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/sb/sb.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/scala/scala.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/scheme/scheme.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/scss/scss.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/shell/shell.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/solidity/solidity.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/sophia/sophia.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/sql/sql.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/st/st.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/swift/swift.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/systemverilog/systemverilog.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/tcl/tcl.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/twig/twig.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/vb/vb.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/xml/xml.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/yaml/yaml.contribution.js';
// END_LANGUAGES

import monokai from 'monaco-themes/themes/Monokai.json';
monaco.editor.defineTheme('monokai', monokai as monaco.editor.IStandaloneThemeData);

import complete_dark from './styles/editor-themes/complete-dark.json';
// import * as monacoThemes from 'monaco-themes';
// const { parseTmTheme } = require('monaco-themes');
// monaco.editor.defineTheme('complete-dark', parseTmTheme(JSON.stringify(complete_dark)) as monaco.editor.IStandaloneThemeData);

type Pair<T,U>=[T,U];

export let editors: monaco.editor.IStandaloneCodeEditor[] = [];//: Pair<monaco.editor.IStandaloneCodeEditor,monaco.editor.ITextModel>[]= [];

// declare let self: any;
// let MonacoEnvironment;
export function setup(node: HTMLElement, editorOptions={}) {
    // monaco.languages.typescript.typescriptDefaults.setEagerModelSync;
    // MonacoEnvironment = {
    //     getWorkerUrl: function (moduleId, label) {
    //         // if (label === 'json') {
    //         // 	return './json.worker.bundle.js';
    //         // }
    //         // if (label === 'css' || label === 'scss' || label === 'less') {
    //         // 	return './css.worker.bundle.js';
    //         // }
    //         // if (label === 'html' || label === 'handlebars' || label === 'razor') {
    //         // 	return './html.worker.bundle.js';
    //         // }
    //         // if (label === 'typescript' || label === 'javascript') {
    //         // 	return './ts.worker.bundle.js';
    //         // }
    //         return './editor.worker.bundle.js';
    //     }
    // };
    // monaco.editor.create(document.getElementById('editor'), {
    //     value: [
    //         'type Option<T> = Some<T> | None<T>;'
    //     ].join('\n'),
    //     language: 'typescript'
    // });
    // const model = monaco.editor.createModel('type Option<T> = Some<T> | None<T>;','typescript');
    const options = {
        value: [
`

add x y = x + y

mul x y = x * y

inc = add 1

fib n = if n < 2 then 1 else (fib (n - 2)) + (fib (n - 1))

fibs = [fib 1,fib 2,fib 3,fib 4,fib 5,fib 6,fib 7,fib 8]

`
        ].join('\n'),
        language: 'typescript',
        theme: 'monokai', // 'vs-dark'
        automaticLayout: true,
        // readOnly: false,
        ...editorOptions
    };
    const editor = monaco.editor.create(node, options);

    // editor.setModel(model);
    // editors.push([editor,0]);
    editors.push(editor);

    return node;
}


export function layout() {
    for (const editor of editors) {
        editor.layout();
    }
}
export function setValue(v: string) {
    for (const editor of editors) {
        editor.setValue(v);
    }
}


window.addEventListener('resize', () => {
    layout();
});


