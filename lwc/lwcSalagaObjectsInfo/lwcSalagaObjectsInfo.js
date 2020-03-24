import {LightningElement, api, wire} from 'lwc';
import getObjects from '@salesforce/apex/LwcSalagaController.getObjects';
import getModifiedObjects from '@salesforce/apex/LwcSalagaController.getModifiedObjects';

export default class LwcSalagaObjectsInfo extends LightningElement {
	@api objects = [];
	@api isButtonDisabled = false;
	@api selectedObjects = [];
	@api modifiedObjects = [];

	@wire(getObjects)
	getObjects({error, data}) {
		if (data) {
			let tmp =[];

			for (let i = 0; i < data.length; i++) {
				tmp.push({
					label: data[i].objectLabel,
					value: data[i].objectApiName
				});
			}

			this.objects = tmp;
		} else {
			console.log(error);
		}
	}

	handleChange(event) {
		if (event.detail.value.length < 101) {
			this.selectedObjects = event.detail.value;
			this.isButtonDisabled = false;
		} else {
			alert('You are trying to add more than 100 Objects. Please, reduce amount to 100.');
			this.isButtonDisabled = true;
		}
	}

	handleClick() {
		getModifiedObjects({objectApiNames: this.selectedObjects})
			.then(result => {
				this.modifiedObjects = result;
			})
			.catch(error => {
				console.log(error);
			})
	}

	closeModal() {
		this.dispatchEvent(new CustomEvent('closemodal'));
	}
}