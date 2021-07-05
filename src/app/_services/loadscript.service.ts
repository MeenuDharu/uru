import { Injectable } from '@angular/core';

interface Scripts {
	name: string; type: string; src: string;
}

export const CssStore: Scripts[] = [
	// { name: 'font-awesome', type: 'css', src: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.2/css/all.min.css' },
	// { name: 'google-font', type: 'css', src: 'https://fonts.googleapis.com/css?family=Montaga&display=swap' },
	// { name: 'instamojo', type: 'js', src: 'https://js.instamojo.com/v1/checkout.js' },

	{ name: 'font-awesome', type: 'css', src: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css' },

	{ name: 'material-icons', type: 'css', src: 'https://fonts.googleapis.com/icon?family=Material+Icons' },

	{ name: 'grid', type: 'js', src: 'assets/js/jsqrcode/grid.js' },
	{ name: 'version', type: 'js', src: 'assets/js/jsqrcode/version.js' },
	{ name: 'detector', type: 'js', src: 'assets/js/jsqrcode/detector.js' },
	{ name: 'formatinf', type: 'js', src: 'assets/js/jsqrcode/formatinf.js' },
	{ name: 'errorlevel', type: 'js', src: 'assets/js/jsqrcode/errorlevel.js' },
	{ name: 'bitmat', type: 'js', src: 'assets/js/jsqrcode/bitmat.js' },
	{ name: 'datablock', type: 'js', src: 'assets/js/jsqrcode/datablock.js' },
	{ name: 'bmparser', type: 'js', src: 'assets/js/jsqrcode/bmparser.js' },
	{ name: 'datamask', type: 'js', src: 'assets/js/jsqrcode/datamask.js' },
	{ name: 'rsdecoder', type: 'js', src: 'assets/js/jsqrcode/rsdecoder.js' },
	{ name: 'gf256poly', type: 'js', src: 'assets/js/jsqrcode/gf256poly.js' },
	{ name: 'gf256', type: 'js', src: 'assets/js/jsqrcode/gf256.js' },
	{ name: 'decoder', type: 'js', src: 'assets/js/jsqrcode/decoder.js' },
	{ name: 'qrcode', type: 'js', src: 'assets/js/jsqrcode/qrcode.js' },
	{ name: 'findpat', type: 'js', src: 'assets/js/jsqrcode/findpat.js' },
	{ name: 'alignpat', type: 'js', src: 'assets/js/jsqrcode/alignpat.js' },
	{ name: 'databr', type: 'js', src: 'assets/js/jsqrcode/databr.js' },

];

declare let document: any;

@Injectable({
	providedIn: 'root'
})

export class LoadscriptService {

	private scripts: any = {};

	constructor() {
		CssStore.forEach((script: any) => {
			this.scripts[script.name] = {
				type: script.type, src: script.src, loaded: false
			};
		});
	}

	load(...scripts: string[]) {
		const promises: any[] = [];
		scripts.forEach((script) => promises.push(this.loadAsset(script)));
		return Promise.all(promises);
	}

	unload(...scripts: string[]) {
		const promises: any[] = [];
		scripts.forEach((script) => promises.push(this.unloadAsset(script)));
		return Promise.all(promises);
	}

	loadAsset(name: string) {
		return new Promise((resolve, reject) => {
			if (!this.scripts[name].loaded) {
				let targetElement = (this.scripts[name].type == "js") ? "script" : "link";
				let script = document.createElement(targetElement);
				if (this.scripts[name].type == "js") {
					script.type = 'text/javascript';
					script.src = this.scripts[name].src;
				}
				else {
					script.rel = 'stylesheet';
					script.href = this.scripts[name].src;
				}
				if (script.readyState) {  //IE
					script.onreadystatechange = () => {
						if (script.readyState === "loaded" || script.readyState === "complete") {
							script.onreadystatechange = null;
							this.scripts[name].loaded = true;
							resolve({ script: name, loaded: true, status: 'Loaded' });
						}
					};
				}
				else {  //Others
					script.onload = () => {
						this.scripts[name].loaded = true;
						resolve({ script: name, loaded: true, status: 'Loaded' });
					};
				}
				script.onerror = (error: any) => resolve({ script: name, loaded: false, status: 'Loaded' });
				document.getElementsByTagName('head')[0].appendChild(script);
			}
			else {
				resolve({ script: name, loaded: true, status: 'Already Loaded' });
			}
		});
	}

	unloadAsset(name: string) {
		return new Promise((resolve, reject) => {
			let targetElement = this.scripts[name].type == "js" ? "script" : "link";
			let targetAttr = this.scripts[name].type == "js" ? "src" : "href";
			let allsuspects = document.getElementsByTagName(targetElement);
			for (let i = allsuspects.length; i >= 0; i--) {
				if (allsuspects[i] && allsuspects[i].getAttribute(targetAttr) != null && allsuspects[i].getAttribute(targetAttr).indexOf(this.scripts[name].src) != -1)
					allsuspects[i].parentNode.removeChild(allsuspects[i])
			}
			resolve(true);
		});
	}

	addCanonical(link) {
		let script = document.createElement("link");
		script.rel = 'canonical';
		script.href = link;
		document.getElementsByTagName('head')[0].appendChild(script);
	}
	removeCanonical(link) {
		let allsuspects = document.getElementsByTagName("link");
		for (let i = allsuspects.length; i >= 0; i--) {
			if (allsuspects[i] && allsuspects[i].getAttribute("href") != null && allsuspects[i].getAttribute("href").indexOf(link) != -1)
				allsuspects[i].parentNode.removeChild(allsuspects[i])
		}
	}

}