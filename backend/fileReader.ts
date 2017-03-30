/**
 * Created by fedders on 30.03.2017.
 */
import fs = require('fs');
export class FileReader {
    
    public static readJSONFile(source:string, callback:Function):void {
        fs.readFile(source, 'utf8', (err:any, data:any) => {
            if (err) {
                console.log(err);
            }
            callback(data);
        });
    }

}