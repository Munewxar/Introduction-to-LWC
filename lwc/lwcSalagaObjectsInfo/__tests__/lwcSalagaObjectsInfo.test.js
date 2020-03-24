import {createElement} from 'lwc';
import lwcSalagaObjectsInfo from "c/lwcSalagaObjectsInfo";
import { registerLdsTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import getObjects from '@salesforce/apex/LwcSalagaController.getObjects';
import getModifiedObjects from '@salesforce/apex/LwcSalagaController.getModifiedObjects';

const mockGetObjects = require('./data/objects.json');

const getObjectsWireAdapter = registerLdsTestWireAdapter(getObjects);
const getModifiedObjectsWireAdapter = registerLdsTestWireAdapter(getModifiedObjects);

const COMPONENT_NAME = 'c-lwc-salaga-objects-info';

describe(COMPONENT_NAME, () => {
	afterEach(() => {
		while (document.body.firstChild) {
			document.body.removeChild(document.body.firstChild);
		}

		jest.clearAllMocks();
	});

	it('should retrieve sObject Wrapper from provided json file', () => {
		const element = createElement(COMPONENT_NAME, {is: lwcSalagaObjectsInfo});
		document.body.appendChild(element);

		getObjectsWireAdapter.emit(mockGetObjects);

		return Promise.resolve().then(() => {
			expect(element.objects[0].value).toBe(mockGetObjects[0].objectApiName);
			expect(element.objects[0].label).toBe(mockGetObjects[0].objectLabel);
		});
	});

	// it('should retrieve Modified sObjects from provided json file', () => {
	// 	const element = createElement(COMPONENT_NAME, {is: lwcSalagaObjectsInfo});
	// 	document.body.appendChild(element);
	//
	// 	getModifiedObjectsWireAdapter.emit([]);
	//
	// 	return Promise.resolve().then(() => {
	// 		expect(element.modifiedObjects).toEqual([]);
	// 	});
	// });

	it('Should handle search button click', () => {
		const element = createElement(COMPONENT_NAME, {is: lwcSalagaObjectsInfo});
		document.body.appendChild(element);
		const handler = jest.fn();
		element.addEventListener('click', handler);

		const button = element.shadowRoot.querySelector('lightning-button[data-id="search-button"]');
		button.click();

		return Promise.resolve().then(() => {
			expect(handler).toHaveBeenCalled();
		});
	});

	it('Should disable button if objects length more than 100', () => {
		const element = createElement(COMPONENT_NAME, {is: lwcSalagaObjectsInfo});
		document.body.appendChild(element);

		const dualListbox = element.shadowRoot.querySelector('lightning-dual-listbox[data-id="objects-list-box"]');
		dualListbox.dispatchEvent(new CustomEvent('change', {
			detail: {
				value: {
					length: 101
				}
			}
		}));

		return Promise.resolve().then(() => {
			expect(element.isButtonDisabled).toBe(true);
		});
	});

	it('Should not disable button if objects length less than 100', () => {
		const element = createElement(COMPONENT_NAME, {is: lwcSalagaObjectsInfo});
		document.body.appendChild(element);

		const dualListbox = element.shadowRoot.querySelector('lightning-dual-listbox[data-id="objects-list-box"]');
		dualListbox.dispatchEvent(new CustomEvent('change', {
			detail: {
				value: {
					length: 1
				}
			}
		}));

		return Promise.resolve().then(() => {
			expect(element.isButtonDisabled).toBe(false);
		});
	});

	it('Should fire an event when click close button', () => {
		const element = createElement(COMPONENT_NAME, {is: lwcSalagaObjectsInfo});
		document.body.appendChild(element);

		const handler = jest.fn();
		element.addEventListener('closemodal', handler);

		const button = element.shadowRoot.querySelector('button[data-id="close"]');
		button.click();

		return Promise.resolve().then(() => {
			expect(handler).toHaveBeenCalled();
		});
	});

	it('Should fire an event when click cancel button', () => {
		const element = createElement(COMPONENT_NAME, {is: lwcSalagaObjectsInfo});
		document.body.appendChild(element);

		const handler = jest.fn();
		element.addEventListener('closemodal', handler);

		const button = element.shadowRoot.querySelector('lightning-button[data-id="cancel"]');
		button.click();

		return Promise.resolve().then(() => {
			expect(handler).toHaveBeenCalled();
		});
	});
});