import {LightningElement, api} from 'lwc';

const columns = [
	{label: 'Name', fieldName: 'name'},
	{label: 'Id', fieldName: 'Id'},
	{label: 'LastModifiedById', fieldName: 'lastModifiedById'}
];

export default class LwcSalagaModifiedRecordsTable extends LightningElement {
	@api records = [];
	@api columns = columns;
}