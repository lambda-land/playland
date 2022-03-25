/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// import { registerLanguage } from 'monaco-editor/esm/vs/basic-languages/_.contribution.js';
// import { registerLanguage } from 'monaco-editor/esm/vs/basic-languages/monaco.contribution';
import * as monaco from 'monaco-editor';
// import { languages } from 'monaco-editor/esm/vs/editor/editor.api.js';
// declare module 'monaco-editor/esm/vs/basic-languages/_.contribution';

import { registerLanguage } from 'monaco-editor/esm/vs/basic-languages/_.contribution.js';
// import { registerLanguage } from 'monaco-editor/dev/vs/basic-languages/_.';

// import { registerLanguage, ILangImpl } from './contribution';
import * as elm from './elm';

monaco.languages.register({
    id: 'elm',
    extensions: ['.elm'],
    aliases: ['Elm', 'elm'],
    mimetypes: ['text/elm'],
    loader: function () { return new Promise((res,rej) => { 
        const r = ({
            conf: elm.conf,
            language: elm.language
        });
        res(r); 
    }); }
});

registerLanguage({
    id: 'elm',
    extensions: ['.elm'],
    aliases: ['Elm', 'elm'],
    mimetypes: ['text/elm'],
    loader: function () { return new Promise((res,rej) => { 
        const r = {
            conf: elm.conf,
            language: elm.language
        };
        res(r); 
    }); }
});
