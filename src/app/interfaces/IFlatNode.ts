import { ITreeViewNode } from "./ITreeViewNode";
import { NodeType } from "./NodeType";

export interface IFlatNode {
    expandable: boolean;
    name: string;
    level: number;
    type: NodeType;
    children: ITreeViewNode[] | undefined;
    path: string | undefined;
}