import {createElement} from 'lwc';
import lwcSalagaMainWindow from "c/lwcSalagaMainWindow";

const COMPONENT_NAME = 'c-lwc-salaga-main-window';

describe(COMPONENT_NAME, () => {
	afterEach(() => {
		while (document.body.firstChild) {
			document.body.removeChild(document.body.firstChild);
		}
	});

	it('openModal should be false when component is loaded', () => {
		const element = createElement(COMPONENT_NAME, {is: lwcSalagaMainWindow});
		document.body.appendChild(element);


		return Promise.resolve().then(() => {
			expect(element.openModal).toBe(false);
		});
	});

	it('Should call an openmodal event handler when event fired by child component', () => {
		const element = createElement(COMPONENT_NAME, {is: lwcSalagaMainWindow});
		document.body.appendChild(element);

		const userInfoCmp = element.shadowRoot.querySelector('c-lwc-salaga-user-info');
		userInfoCmp.dispatchEvent(new CustomEvent('openmodal'));

		return Promise.resolve().then(() => {
			expect(element.openModal).toBe(true);
		});
	});

	it('Should call an closemodal event handler when event fired by child component', () => {
		const element = createElement(COMPONENT_NAME, {is: lwcSalagaMainWindow});
		document.body.appendChild(element);

		const userInfoCmp = element.shadowRoot.querySelector('c-lwc-salaga-user-info');
		userInfoCmp.dispatchEvent(new CustomEvent('openmodal'));

		return Promise.resolve().then(() => {
			const objectsInfo = element.shadowRoot.querySelector('c-lwc-salaga-objects-info');
			objectsInfo.dispatchEvent(new CustomEvent('closemodal'));

			expect(element.openModal).toBe(false);
		});
	});
});