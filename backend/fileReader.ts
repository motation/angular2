/**
 * Created by fedders on 30.03.2017.
 */
import fs = require('fs');
export class FileReader {

    public static readConfig(source:string, callback:Function):void {
        fs.readFile(source, 'utf8', (err:any, data:any) => {
            if (err) {
                console.log(err);
            }
            callback(data);
        });
    }

    public static writeConfig(source:string, data:string):void {
        fs.writeFile(source, data, function (err) {
            if (err) {
                console.log(err);
            }

            console.log("The file was saved!");
        });
    }

}