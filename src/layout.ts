
import { GoldenLayout, ComponentContainer, ComponentItem, LayoutConfig } from 'golden-layout';
import { setupProgramEditor, setupReplOutput, setupReplInput, layout as resizeEditors } from './editor';

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
      //   {
      //     type: 'component',
      // componentType: 'topbar',
      //     isClosable: false,
      // height: 5
      //   },
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


export function initLayout() {
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
    const parent: ComponentItem = container.parent;
    console.log(container)

    console.log(parent)
    const htmlElem: HTMLElement = htmlEl as HTMLElement;
    setupReplInput(htmlElem);
  });



  gl.loadLayout(config);

  layout = gl;

  window.addEventListener('resize', () => {
      layout.updateSize(window.innerWidth, window.innerHight);
      resizeEditors();
  });

}


