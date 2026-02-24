import { ICredentialType, INodeProperties, Icon } from 'n8n-workflow';
export declare class GoogleServiceAccountApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    icon: Icon;
    properties: INodeProperties[];
}
