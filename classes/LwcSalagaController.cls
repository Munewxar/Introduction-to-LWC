public with sharing class LwcSalagaController {
	public static final String FIRST_NAME_API_NAME = 'FirstName';
	public static final String LAST_NAME_API_NAME = 'LastName';
	public static final String LANGUAGE_API_NAME = 'Language';

	public static final String FIRST_NAME_LABEL = 'First Name';
	public static final String LAST_NAME_LABEL = 'Last Name';
	public static final String LANGUAGE_LABEL = 'Language';

	public static final String LAST_MODIFIED_BY_LABEL = 'Last Modified By';

	public class UserInfoField {
		@AuraEnabled
		public String apiName;
		@AuraEnabled
		public String value;
		@AuraEnabled
		public String label;


		public UserInfoField(String apiName, String value, String label) {
			this.apiName = apiName;
			this.value = value;
			this.label = label;
		}
	}

	public class ObjectInfo {
		@AuraEnabled
		public String objectApiName;
		@AuraEnabled
		public String objectLabel;

		public ObjectInfo(String objectApiName, String objectLabel) {
			this.objectApiName = objectApiName;
			this.objectLabel = objectLabel;
		}
	}

	public class ObjectWrapper {
		@AuraEnabled
		public String objectApiName;
		@AuraEnabled
		public List<FieldWrapper> records;

		public ObjectWrapper(String objectApiName, List<FieldWrapper> recordIds) {
			this.objectApiName = objectApiName;

			this.records = recordIds;
		}
	}

	public class FieldWrapper {
		@AuraEnabled
		public String Id;
		@AuraEnabled
		public String name;
		@AuraEnabled
		public String lastModifiedById;

		public FieldWrapper(String Id, String name, String lastModifiedById) {
			this.Id = Id;
			this.name = name;
			this.lastModifiedById = lastModifiedById;
		}
	}

	@AuraEnabled(Cacheable=true)
	public static List<UserInfoField> getUserInfoFields() {
		List<UserInfoField> infoFields = new List<UserInfoField>();

		UserInfoField firstName = new UserInfoField(FIRST_NAME_API_NAME, UserInfo.getFirstName(), FIRST_NAME_LABEL);
		UserInfoField lastName = new UserInfoField(LAST_NAME_API_NAME, UserInfo.getLastName(), LAST_NAME_LABEL);
		UserInfoField language = new UserInfoField(LANGUAGE_API_NAME, UserInfo.getLanguage(), LANGUAGE_LABEL);

		infoFields.add(firstName);
		infoFields.add(lastName);
		infoFields.add(language);

		return infoFields;
	}

	@AuraEnabled(Cacheable=true)
	public static List<ObjectInfo> getObjects() {
		List<ObjectInfo> objects = new List<ObjectInfo>();

		for (Schema.SObjectType type : DescribeCacheUtility.getGlobalDescribe().values()) {
			if (type.getDescribe().isQueryable() && !UNSUPPORTED_OBJECTS.contains(type.getDescribe().getName())) {
				String objectApiName = String.valueOf(type);
				Map<String, Schema.SObjectField> fieldMap = DescribeCacheUtility.getFieldMap(type);

				if (fieldMap.containsKey('Name') && fieldMap.containsKey('LastModifiedById')) {
					ObjectInfo objectInfo = new ObjectInfo(objectApiName, type.getDescribe().label);
					objects.add(objectInfo);
				}
			}
		}

		return objects;
	}

	@AuraEnabled(Cacheable=true)
	public static String getUserAvatarURL() {
		String userAvatarURL = '';
		String userId = UserInfo.getUserId();

		userAvatarURL = [SELECT MediumPhotoUrl FROM User WHERE User.Id = :userId LIMIT 1].get(0).MediumPhotoUrl;

		return userAvatarURL;
	}

	@AuraEnabled(Cacheable=true)
	public static List<ObjectWrapper> getModifiedObjects(List<String> objectApiNames) {
		List<ObjectWrapper> modifiedRecordsByCurrentUser = new List<ObjectWrapper>();
		String userId = UserInfo.getUserId();

		for (String objectApiName: objectApiNames) {
			List<SObject> records = Database.query('SELECT Id, Name, LastModifiedById FROM ' + objectApiName +
					' WHERE LastModifiedById = \'' + userId + '\'');

			List<FieldWrapper> ids = new List<FieldWrapper>();

			for (SObject record : records) {
				ids.add(new FieldWrapper(record.Id, String.valueOf(record.get('Name')),
						String.valueOf(record.get('LastModifiedById'))));
			}

			modifiedRecordsByCurrentUser.add(new ObjectWrapper(objectApiName, ids));
		}


		return modifiedRecordsByCurrentUser;
	}

	public static Set<String> UNSUPPORTED_OBJECTS = new Set<String>{'SearchActivity', 'OrgDeleteRequest'};
}