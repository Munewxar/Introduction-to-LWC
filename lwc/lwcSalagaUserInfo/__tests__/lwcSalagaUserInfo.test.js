import {createElement} from 'lwc';
import lwcSalagaUserInfo from "c/lwcSalagaUserInfo";

import getUserInfoFields from '@salesforce/apex/LwcSalagaController.getUserInfoFields';
import getUserAvatarURL from '@salesforce/apex/LwcSalagaController.getUserAvatarURL';

import { registerLdsTestWireAdapter } from '@salesforce/sfdx-lwc-jest';

const mockGetUserFields = require('./data/getUserInfoFields.json');
const mockGetUserAvatarURL = require('./data/userAvatarURL.json');

const getUserInfoFieldsWireAdapter = registerLdsTestWireAdapter(getUserInfoFields);
const getUserAvatarURLWireAdapter = registerLdsTestWireAdapter(getUserAvatarURL);

describe('c-lwc-salaga-user-info', () => {
	afterEach(() => {
		while (document.body.firstChild) {
			document.body.removeChild(document.body.firstChild);
		}
	});

	it('should returned empty string because name wasn\'t not loaded', () => {
		const lwc = createElement('c-lwc-salaga-user-info', {
			is: lwcSalagaUserInfo
		});

		expect(lwc.userName).toBe('');
	});

	it('Should contain not empty string because name was loaded successfully', () => {
		const lwc = createElement('c-lwc-salaga-user-info', {
			is: lwcSalagaUserInfo
		});
		document.body.appendChild(lwc);

		return Promise.resolve().then(() => {
			const nameDiv = lwc.shadowRoot.querySelector('div[data-id="name"]');
			!expect(nameDiv.textContent).toEqual('');
		});
	});

	it('Should retrieve User Info fields from provided json file', () => {
		const lwc = createElement('c-lwc-salaga-user-info', {is: lwcSalagaUserInfo});
		document.body.appendChild(lwc);

		getUserInfoFieldsWireAdapter.emit(mockGetUserFields);

		return Promise.resolve().then(() => {
			const userFields = mockGetUserFields;
			expect(lwc.userFields).toEqual(userFields);

		});
	});

	it('Should retrieve First Name and Last Name if data was provided', () => {
		const lwc = createElement('c-lwc-salaga-user-info', {is: lwcSalagaUserInfo});
		document.body.appendChild(lwc);

		getUserInfoFieldsWireAdapter.emit(mockGetUserFields);

		return Promise.resolve().then(() => {
			const userName = mockGetUserFields[0].value + ' ' + mockGetUserFields[1].value;
			expect(lwc.userName).toEqual(userName);

		});
	});

	it('Should retrieve User Avatar URL from provided json file', () => {
		const lwc = createElement('c-lwc-salaga-user-info', {is: lwcSalagaUserInfo});
		document.body.appendChild(lwc);

		getUserAvatarURLWireAdapter.emit(mockGetUserAvatarURL);

		return Promise.resolve().then(() => {
			const url = mockGetUserAvatarURL.url;
			expect(lwc.userAvatarURL.url).toBe(url);

		});
	});

	it('Should fire an event when click button', () => {
		const lwc = createElement('c-lwc-salaga-user-info', {is: lwcSalagaUserInfo});
		document.body.appendChild(lwc);

		const handler = jest.fn();
		lwc.addEventListener('openmodal', handler);

		const button = lwc.shadowRoot.querySelector('lightning-button[data-id="button"]');
		button.click();

		return Promise.resolve().then(() => {
			expect(handler).toHaveBeenCalled();
		});
	});

});