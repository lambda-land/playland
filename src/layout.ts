
import { GoldenLayout } from 'golden-layout';
import { LayoutConfig } from "golden-layout";
import { flattenDiagnosticMessageText } from 'typescript';

export const config: LayoutConfig = {
  root: {
    type: "row",
    content: [
      {
        type: "component",
        componentType: "test"
      },
    //   {
    //     type: "component",
    //     componentType: "Test 2"
    //   }
    ]
  }
};

declare var window: any;

let clickCount = 0;
let win = null;
export function initLayout() {
	// const glTheme = `<link type="text/css" rel="stylesheet" href="https://golden-layout.com/files/latest/css/goldenlayout-base.css" /><link type="text/css" rel="stylesheet" href="https://golden-layout.com/files/latest/css/goldenlayout-dark-theme.css" />`;
	// document.getElementsByTagName('head')[0].innerHTML += glTheme;
	const gl = new GoldenLayout(document.getElementById("golden-layout"));


	gl.registerComponentFactoryFunction('test', (container,itemConfig) => {
		let el = document.createElement("h1");
		el.textContent = "This is a test";
		container.element.append(el);

		// let btn = document.createElement("button");
		// btn.textContent = "Click Me!";
		// btn.onclick = () => {
		// 	clickCount++;
		// };
		// container.element.append(btn);
	})

	gl.loadLayout(config);
}

