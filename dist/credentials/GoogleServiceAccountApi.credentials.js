"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleServiceAccountApi = void 0;
class GoogleServiceAccountApi {
    constructor() {
        this.name = 'googleServiceAccountApi';
        this.displayName = 'Google Service Account API';
        this.documentationUrl = 'https://cloud.google.com/iam/docs/creating-managing-service-account-keys';
        this.icon = 'file:icons/Google.svg';
        this.properties = [
            {
                displayName: 'Service Account Key',
                name: 'serviceAccountKey',
                type: 'string',
                typeOptions: {
                    password: true,
                    rows: 10,
                },
                default: '',
                required: true,
                description: 'Enter the JSON key file contents from your Google service account',
            },
        ];
    }
}
exports.GoogleServiceAccountApi = GoogleServiceAccountApi;
//# sourceMappingURL=GoogleServiceAccountApi.credentials.js.map