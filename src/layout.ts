
import { GoldenLayout, ComponentContainer, ComponentItem, LayoutConfig } from 'golden-layout';
import { setupProgramEditor, setupReplOutput, setupReplInput, layout as resizeEditors, editors } from './editor';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import { storage } from './storage';

export const config: LayoutConfig = {
  settings: {
    hasHeaders: true,
    reorderEnabled: true,
    showMaximiseIcon: false,
  },
  dimensions: {
    borderWidth: 2,
    headerHeight: 20,
  },
  root: {
    type: 'column',
    content: [
      {
        type: 'row',
        content: [
          {
            type: 'component',
            componentType: 'program',
            isClosable: false,
            title: 'Program',
            id: 'program-tab',
          },
          {
            type: 'column',
            content: [

              {
                type: 'component',
                componentType: 'eval',
                isClosable: false,
                title: 'Evaluation',
                id: 'eval-tab',
              },
              {
                type: 'component',
                componentType: 'input',
                isClosable: false,
                title: 'Input',
                height: 10,
                id: 'input-tab',
                // hasHeaders: false,
              },
              {
                type: 'component',
                componentType: 'topbar',
                isClosable: false,
                height: 5,
                title: 'Color Theme',
                // hasHeaders: false,
              },

            ]
          }
        ]
      }
    ]
  }
};

declare var window: any;

let clickCount = 0;
let win = null;
let layout: any = null;

import themeList from 'monaco-themes/themes/themelist.json';
export const editorThemes: any[] = [];

export async function initLayout() {
  // const glTheme = `<link type="text/css" rel="stylesheet" href="https://golden-layout.com/files/latest/css/goldenlayout-base.css" /><link type="text/css" rel="stylesheet" href="https://golden-layout.com/files/latest/css/goldenlayout-dark-theme.css" />`;
  // document.getElementsByTagName('head')[0].innerHTML += glTheme;
  const glContainer = document.getElementById('golden-layout');
  const gl = new GoldenLayout(glContainer);



  const renderHTML = (src: string) => {
    const template = document.createElement('template');
    template.innerHTML = src.trim();
    return [template.content.firstChild, template.content.childNodes[0]];
  }
  gl.registerComponentFactoryFunction('program', (container, itemConfig) => {

    const [el, htmlEl] = renderHTML(`<div id="container" style="height:100%;"></div>`);
    container.element.appendChild(el);
    // container.setTitle('Program');
    const htmlElem: HTMLElement = htmlEl as HTMLElement;

    setupProgramEditor(htmlElem, {
      tabSize: 2
    });

  });
  gl.registerComponentFactoryFunction('eval', (container, itemConfig) => {

    const [el, htmlEl] = renderHTML(`<div id="eval-container" style="height:100%;"></div>`);
    container.element.appendChild(el);
    // container.setTitle('Evaluation');
    const htmlElem: HTMLElement = htmlEl as HTMLElement;
    setupReplOutput(htmlElem);
  });

  gl.registerComponentFactoryFunction('input', (container: ComponentContainer, itemConfig) => {
    const [el, htmlEl] = renderHTML(`<div id="input-container" style="height:100%;"></div>`);
    container.element.appendChild(el);
    // container.parent.headerConfig.show(false);
    const htmlElem: HTMLElement = htmlEl as HTMLElement;
    setupReplInput(htmlElem);
  });
    gl.registerComponentFactoryFunction('topbar', (container: ComponentContainer, itemConfig) => {
      const [el, htmlEl] = renderHTML(`<div id="topbar-container" style="height:100%;"></div>`);
      container.element.appendChild(el);
      const htmlElem: HTMLElement = htmlEl as HTMLElement;
      const [e, htmlE] = renderHTML(`<select class="theme-selector" id="select-theme"></select>`);
      el.appendChild(e);

      (async () => {
        const themeData: any = {}
        const fetches = Object.entries(themeList).map(async ([name, path]) => {
          console.log(name, path);
          const data = await import(`monaco-themes/themes/${path}.json`)
          themeData[name] = data;

          const tm = { name, path, theme: data };
          editorThemes.push(tm);
          return tm;
        });
        const themes = await Promise.all(fetches);
          for (const { name, path, theme } of themes) {
            const opt = document.createElement('option');
            opt.value = name;
            opt.text = path;
            (htmlE as HTMLElement).appendChild(opt);
            monaco.editor.defineTheme(name, theme);
          }
          document.getElementById('select-theme').addEventListener('change', event => {
            const value = (document.getElementById('select-theme') as any).value// (typeof event === 'string') ? event : (event as any).target.value;
            
            storage.setItem('user-theme', { theme: value });

            monaco.editor.setTheme(value);

            const replBGColor = themeData[value]['colors']['editor.background']
            let container = (document as any).getElementById('eval-container');
            // container.classList.add('eval-output-window');
            let backgrounds = [...container.querySelectorAll('.monaco-editor-background'), ...container.querySelectorAll('.monaco-editor'), ...container.querySelectorAll('.margin')]
            for (const bg of backgrounds) {
              bg.style.backgroundColor = replBGColor;
              // bg.style.cssText += `background-color: ${replBGColor} !important;`;
            }
            container = (document as any).getElementById('input-container');
            backgrounds = [...container.querySelectorAll('.monaco-editor-background'), ...container.querySelectorAll('.monaco-editor'), ...container.querySelectorAll('.margin')]
            for (const bg of backgrounds) {
              bg.style.backgroundColor = replBGColor;
              // bg.style.cssText += `background-color: ${replBGColor} !important;`;
            }
            container = (document as any).getElementById('topbar-container');
            backgrounds = [container, ...container.querySelectorAll('#topbar-container'), ...container.querySelectorAll('.theme-selector'), ...container.querySelectorAll('.margin')]
            for (const bg of backgrounds) {
              bg.style.backgroundColor = replBGColor;
              bg.style.color = themeData[value]['colors']['editor.foreground']
              // bg.style.cssText += `background-color: ${replBGColor} !important;color: ${themeData[value]['colors']['editor.foreground']} !important;`;
            }
            document.getElementById('style-mutator').innerHTML = `body,html{background-color: ${replBGColor}; color: ${themeData[value]['colors']['editor.foreground']}; background: ${replBGColor}; }`;

          });
          
        })().then(() => {
            const selector: any = document.getElementById('select-theme');
            selector.value = storage.getItem('user-theme').theme || 'katzenmilch';
            selector.dispatchEvent(new Event('change'));
        });
    });



  gl.loadLayout(config);

  layout = gl;

  window.addEventListener('resize', () => {
    layout.updateSize(window.innerWidth, window.innerHight);
    resizeEditors();
  });

  // await new Promise((res,rej) => {setTimeout(() => {res(null);},0)})
}


