
import { GoldenLayout } from 'golden-layout';
import { LayoutConfig } from 'golden-layout';
import { flattenDiagnosticMessageText, setSourceMapRange } from 'typescript';
import { setup, layout, setValue } from './editor';

export const config: LayoutConfig = {
  root: {
    type: 'row',
    content: [
      {
        type: 'component',
        componentType: 'text'
      },
      {
        type: 'component',
        componentType: 'eval'
      }
    ]
  }
};

declare var window: any;

let clickCount = 0;
let win = null;
export function initLayout() {
	// const glTheme = `<link type="text/css" rel="stylesheet" href="https://golden-layout.com/files/latest/css/goldenlayout-base.css" /><link type="text/css" rel="stylesheet" href="https://golden-layout.com/files/latest/css/goldenlayout-dark-theme.css" />`;
	// document.getElementsByTagName('head')[0].innerHTML += glTheme;
	const gl = new GoldenLayout(document.getElementById('golden-layout'));
	const renderHTML = src => {
		const template = document.createElement('template');
		template.innerHTML = src.trim();
		return [template.content.firstChild, template.content.childNodes[0]];
	}
	// let cont: any = {};
	gl.registerComponentFactoryFunction('text', (container,itemConfig) => {
		// el.setAttribute('style','width: 500; height: 500;');

		// setTimeout(() => setup(container.element), 2000);
		// const editor = setup(el);
		// container.element.appendChild(editor);
		// container.element.appendChild(el);
		// setup(el);
		// setValue('hello!');
		// layout();

		{

			const [el,htmlEl] = renderHTML(`<div id="container" style="height:100%;"></div>`);
			container.element.appendChild(el);
			const htmlElem: HTMLElement = htmlEl as HTMLElement;
			// setTimeout(() => setup(document.getElementById('container')), 2000);
			// setup(el); ????
			// setup(document.getElementById('container'))
			setup(htmlElem);
		}
	});
	gl.registerComponentFactoryFunction('eval', (container,itemConfig) => {

		const [el,htmlEl] = renderHTML(`<div id="eval-container" style="height:100%;"></div>`);
		container.element.appendChild(el);
		const htmlElem: HTMLElement = htmlEl as HTMLElement;
		setup(htmlElem);
	});


	gl.loadLayout(config);
}


