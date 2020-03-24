import {LightningElement, api} from 'lwc';

export default class LwcSalagaMainWindow extends LightningElement {
	@api openModal = false;

	handleOpenModal() {
		this.openModal = true;
	}

	handleCloseModal() {
		this.openModal = false;
	}
}