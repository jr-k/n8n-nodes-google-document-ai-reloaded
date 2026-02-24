"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleApi = void 0;
class GoogleApi {
    constructor() {
        this.name = 'googleApi';
        this.displayName = 'Google API';
        this.documentationUrl = 'https://cloud.google.com/docs/authentication/application-default-credentials';
        this.icon = 'file:icons/Google.svg';
        this.properties = [
            {
                displayName: 'Service Account Email',
                name: 'email',
                type: 'string',
                default: '',
                description: 'The Google Service account similar to user-808@project.iam.gserviceaccount.com.',
                required: true,
            },
            {
                displayName: 'Private Key',
                name: 'privateKey',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                description: 'Use the multiline editor. Make sure there are exactly 3 lines.<br />-----BEGIN PRIVATE KEY-----<br />KEY IN A SINGLE LINE<br />-----END PRIVATE KEY-----',
                required: true,
            },
            {
                displayName: ' Impersonate a User',
                name: 'inpersonate',
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'Email',
                name: 'delegatedEmail',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        inpersonate: [
                            true,
                        ],
                    },
                },
                description: 'The email address of the user for which the application is requesting delegated access.',
            },
        ];
    }
}
exports.GoogleApi = GoogleApi;
//# sourceMappingURL=GoogleApi.credentials.js.map