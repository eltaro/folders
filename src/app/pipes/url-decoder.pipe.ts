import { HttpUrlEncodingCodec } from "@angular/common/http";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'urldecode'
})
export class UrlDecoderPipe implements PipeTransform {

    constructor(private _httpUrlEncodingCodec: HttpUrlEncodingCodec) {}
    
    transform = (value: any) => this._httpUrlEncodingCodec.decodeKey(value);
}