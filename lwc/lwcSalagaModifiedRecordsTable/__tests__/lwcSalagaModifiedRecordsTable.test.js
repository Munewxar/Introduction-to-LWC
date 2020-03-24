import {createElement} from 'lwc';
import lwcSalagaModifiedRecordsTable from "c/lwcSalagaModifiedRecordsTable";

const COMPONENT_NAME = 'c-lwc-salaga-modified-records-table';

describe(COMPONENT_NAME, () => {
	afterEach(() => {
		while (document.body.firstChild) {
			document.body.removeChild(document.body.firstChild);
		}
	});

	it('Columns should be defined when component is loaded', () => {
		const columns = [
			{label: 'Name', fieldName: 'name'},
			{label: 'Id', fieldName: 'Id'},
			{label: 'LastModifiedById', fieldName: 'lastModifiedById'}
		];

		const element = createElement(COMPONENT_NAME, {is: lwcSalagaModifiedRecordsTable});
		document.body.appendChild(element);

		return Promise.resolve().then(() => {
			expect(element.columns).toEqual(columns);
		});
	});

	it('Records should be empty as data not provided', () => {
		const element = createElement(COMPONENT_NAME, {is: lwcSalagaModifiedRecordsTable});
		document.body.appendChild(element);

		return Promise.resolve().then(() => {
			expect(element.records).toEqual([]);
		});
	});
});