import type { IExecuteFunctions, IExecuteFunctionsLocal, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
declare module 'n8n-workflow' {
    interface IExecuteFunctionsLocal extends IExecuteFunctions {
        processPageData(page: any, fullText: string): any;
        getText(textAnchor: any, text: string): string;
    }
}
export declare class GoogleDocumentAI implements INodeType {
    description: INodeTypeDescription;
    execute(this: IExecuteFunctionsLocal): Promise<INodeExecutionData[][]>;
}
