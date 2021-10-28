import { Elm } from './Main.elm';

Elm.Main.init({ node: document.getElementById('elm') });

// import { setup } from './editor';
// setup();
import { initLayout } from './layout';
initLayout();

