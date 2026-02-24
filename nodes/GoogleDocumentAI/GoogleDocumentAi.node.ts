import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import vision from '@google-cloud/vision';

export class GoogleDocumentAi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Google Document AI OCR',
		name: 'googleDocumentAi',
		icon: 'file:icons/google-vision-ai.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["inputType"]}}',
		description: 'Extract text from documents using Google Document AI OCR',
		defaults: {
			name: 'Google Document AI OCR',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'googleServiceAccountApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Input Type',
				name: 'inputType',
				type: 'options',
				options: [
					{
						name: 'Binary File',
						value: 'binaryFile',
					},
					{
						name: 'File Path',
						value: 'filePath',
					},
				],
				default: 'binaryFile',
				description: 'How the document data will be provided',
			},
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				required: true,
				displayOptions: {
					show: {
						inputType: ['binaryFile'],
					},
				},
				description: 'Name of the binary property containing the document file',
			},
			{
				displayName: 'File Path',
				name: 'filePath',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						inputType: ['filePath'],
					},
				},
				description: 'Path to the document file',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = await this.getCredentials('googleServiceAccountApi');
		const serviceAccountKey = JSON.parse(credentials.serviceAccountKey as string);
		const client = new vision.ImageAnnotatorClient({
			credentials: serviceAccountKey,
		});

		let result: any;

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const inputType = this.getNodeParameter('inputType', itemIndex) as string;

				if (inputType === 'binaryFile') {
					const binaryPropertyName = this.getNodeParameter('binaryPropertyName', itemIndex) as string;
					const buffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);
					[result] = await client.textDetection(buffer);
				} else {
					const filePath = this.getNodeParameter('filePath', itemIndex) as string;
					[result] = await client.textDetection(filePath);
				}

				const { textAnnotations } = result;

				if (!textAnnotations || textAnnotations.length === 0) {
					returnData.push({
						json: {
							textAnnotations: [],
							message: 'No text found in document',
						},
						pairedItem: itemIndex,
					});
					continue;
				}

				returnData.push({
					json: {
						textAnnotations: textAnnotations.map((annotation: any) => ({
							mid: annotation?.mid,
							locale: annotation?.locale,
							description: annotation?.description,
							score: annotation?.score,
							confidence: annotation?.confidence,
							topicality: annotation?.topicality,
							boundingPoly: annotation?.boundingPoly,
							locations: annotation?.locations,
							properties: annotation?.properties,
						})),
					},
					pairedItem: itemIndex,
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error.message },
						pairedItem: itemIndex,
					});
				} else {
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return [returnData];
	}
}
