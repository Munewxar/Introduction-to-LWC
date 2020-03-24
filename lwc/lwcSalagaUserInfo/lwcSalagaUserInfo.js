import {LightningElement, wire, api} from 'lwc';
import getUserInfoFields from '@salesforce/apex/LwcSalagaController.getUserInfoFields';
import getUserAvatarURL from '@salesforce/apex/LwcSalagaController.getUserAvatarURL';

export default class LwcSalagaUserInfo extends LightningElement {
	@api userFields;
	@api userAvatarURL;

	@wire(getUserInfoFields)
	getUserFields({error, data}) {
		if (data) {
			this.userFields = data;
		} else {
			console.log(error);
		}
	}

	@wire(getUserAvatarURL)
	getUserAvatarURL({error, data}) {
		if (data) {
			this.userAvatarURL = data;
			console.log(data);
		} else {
			console.log(error);
		}
	}

	@api
	get userName() {
		if (!this.userFields) {
			return '';
		}

		let userName = '';

		for (let i = 0; i < this.userFields.length; i++) {
			if (this.userFields[i].label === 'First Name') {
				userName = this.userFields[i].value;
			} else if (this.userFields[i].label === 'Last Name') {
				userName = userName + ' ' + this.userFields[i].value;
			}
		}

		return userName;
	}

	openModal() {
		this.dispatchEvent(new CustomEvent('openmodal'));
	}
}