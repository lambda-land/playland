import { Elm } from './Main.elm';

Elm.Main.init({ node: document.getElementById('elm') });

import { setup } from './editor.js';

import { initLayout } from './layout';
const cont = initLayout();

setup();