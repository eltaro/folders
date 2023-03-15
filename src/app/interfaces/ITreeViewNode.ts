import { NodeType } from './NodeType';

export interface ITreeViewNode {
    name: string;
    type: NodeType;
    children?: ITreeViewNode[];
    path?: string;
}