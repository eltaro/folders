import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ITreeViewNode, NodeType } from "../interfaces";

@Injectable({providedIn: 'root'})
export class FolderService {
    public currentlySelectedNode = new BehaviorSubject<ITreeViewNode>({name: '', type: NodeType.Folder});
}