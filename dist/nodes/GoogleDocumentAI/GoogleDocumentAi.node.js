"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleDocumentAI = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const vision_1 = __importDefault(require("@google-cloud/vision"));
class GoogleDocumentAI {
    constructor() {
        this.description = {
            displayName: 'Google Document AI OCR',
            name: 'googleDocumentAi',
            icon: 'file:icons/google-vision-ai.svg',
            group: ['transform'],
            version: 1,
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
                            inputType: ['filePath']
                        }
                    },
                    description: 'Path to the document file',
                }
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const credentials = await this.getCredentials('googleServiceAccountApi');
        const serviceAccountKey = JSON.parse(credentials.serviceAccountKey);
        const client = new vision_1.default.ImageAnnotatorClient({
            credentials: serviceAccountKey
        });
        let result;
        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            try {
                const inputType = this.getNodeParameter('inputType', itemIndex);
                if (inputType === 'binaryFile') {
                    const binaryPropertyName = this.getNodeParameter('binaryPropertyName', itemIndex);
                    const buffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);
                    [result] = await client.textDetection(buffer);
                }
                else {
                    const filePath = this.getNodeParameter('filePath', itemIndex);
                    [result] = await client.textDetection(filePath);
                }
                const { textAnnotations } = result;
                if (!textAnnotations || textAnnotations.length === 0) {
                    returnData.push({
                        json: {
                            textAnnotations: [],
                            message: 'No text found in document'
                        },
                        pairedItem: itemIndex,
                    });
                    continue;
                }
                returnData.push({
                    json: {
                        textAnnotations: textAnnotations.map((annotation) => ({
                            mid: annotation === null || annotation === void 0 ? void 0 : annotation.mid,
                            locale: annotation === null || annotation === void 0 ? void 0 : annotation.locale,
                            description: annotation === null || annotation === void 0 ? void 0 : annotation.description,
                            score: annotation === null || annotation === void 0 ? void 0 : annotation.score,
                            confidence: annotation === null || annotation === void 0 ? void 0 : annotation.confidence,
                            topicality: annotation === null || annotation === void 0 ? void 0 : annotation.topicality,
                            boundingPoly: annotation === null || annotation === void 0 ? void 0 : annotation.boundingPoly,
                            locations: annotation === null || annotation === void 0 ? void 0 : annotation.locations,
                            properties: annotation === null || annotation === void 0 ? void 0 : annotation.properties,
                        }))
                    },
                    pairedItem: itemIndex,
                });
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: error.message,
                        },
                        pairedItem: itemIndex,
                    });
                }
                else {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), error, {
                        itemIndex,
                        description: `Error: ${error.message}`,
                    });
                }
            }
        }
        return [returnData];
    }
}
exports.GoogleDocumentAI = GoogleDocumentAI;
//# sourceMappingURL=GoogleDocumentAi.node.js.map