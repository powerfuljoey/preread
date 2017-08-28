import { Injectable } from "@angular/core";
import { Http } from "@angular/http";

@Injectable()
export class Helper {

    constructor() {

    }
    toInstance(obj: any, json: string) {
        var jsonObj = JSON.parse(json);

        if (typeof obj["fromJSON"] === "function") {
            obj["fromJSON"](jsonObj);
        }
        else {
            for (var propName in jsonObj) {
                obj[propName] = jsonObj[propName]
            }
        }

        return obj;
    }

}