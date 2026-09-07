const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const base=require('path').resolve(__dirname,'..')+'/';
async function test(mode){
 const nodes={}, component={}; let cameraStarts=0, stopped=0, resets=0;
 class El{
  constructor(tag){this.tag=tag;this.events={};this.attrs={};this.hidden=true;this.classList={add(){},remove(){}};this.components={};}
  addEventListener(name,cb){(this.events[name]??=[]).push(cb)}
  emit(name,detail={}){for(const cb of this.events[name]||[])cb({detail})}
  setAttribute(key,value){this.attrs[key]=value;if(key==='birthday-animation') component.value.init.call({el:this});}
  appendChild(el){(this.children??=[]).push(el); if(el.tag==='a-scene'){nodes.scene=el;el.systems={'mindar-image-system':{start(){cameraStarts++},controller:{stopProcessVideo(){stopped++}}}};queueMicrotask(()=>{nodes.model.emit('model-loaded',{model:{animations:mode==='no-clip'?[]:[{name:'walk'}]}});el.emit('renderstart')})}}
  focus(){}
 }
 const ids=[...fs.readFileSync(base+'index.html','utf8').matchAll(/id="([^"]+)"/g)].map(x=>x[1]);
 ids.forEach(id=>nodes[id]=new El(id));
 const document=new El('document'); document.getElementById=id=>{assert(nodes[id],id);return nodes[id]};document.querySelectorAll=()=>[];
 document.createElement=tag=>{const el=new El(tag);if(tag==='a-entity'&&!nodes.model){ // identify model later through its attribute
  const original=el.setAttribute;el.setAttribute=function(key,value){if(key==='birthday-animation')nodes.model=this;return original.call(this,key,value)};
 }return el};
 document.body=new El('body');document.head={appendChild(script){queueMicrotask(()=>script.onload())}};
 const action={stop(){},setLoop(){},play(){return this},reset(){resets++;return this},paused:true};
 const window=new El('window');window.isSecureContext=mode!=='insecure';window.location={reload(){}};
 const ctx={window,document,navigator:{mediaDevices:{getUserMedia(){}}},console,Uint8Array,AbortSignal,setTimeout:()=>1,clearTimeout(){},AFRAME:{registerComponent(name,c){component.value=c},THREE:{AnimationMixer:class{clipAction(){return action}update(){}},LoopRepeat:1}},fetch:async url=>({ok:mode!=='missing',headers:{get(){return 'application/octet-stream'}},arrayBuffer:async()=>new TextEncoder().encode(url.endsWith('.glb')?'glTFdata':'target').buffer})};
 vm.createContext(ctx);vm.runInContext(fs.readFileSync(base+'js/config.js','utf8'),ctx);vm.runInContext(fs.readFileSync(base+'js/app.js','utf8'),ctx);
 nodes.start.emit('click');for(let i=0;i<20;i++)await new Promise(r=>setImmediate(r));
 if(['insecure','missing','no-clip'].includes(mode)){assert.equal(nodes.error.hidden,false);assert.equal(cameraStarts,0);return;}
 assert.equal(cameraStarts,1);nodes.scene.emit('arReady');assert.equal(nodes.hud.hidden,false);
 const anchor=nodes.scene.children.find(e=>e.attrs['mindar-image-target']);
 anchor.emit('targetFound');assert.equal(nodes.model.attrs.visible,true);assert.equal(action.paused,false);assert.equal(resets,1);
 anchor.emit('targetLost');assert.equal(nodes.model.attrs.visible,false);assert.equal(action.paused,true);assert.equal(nodes['scan-frame'].hidden,false);
 anchor.emit('targetFound');nodes.replay.emit('click');assert.equal(resets,3);
 document.hidden=true;document.emit('visibilitychange');assert.equal(nodes.error.hidden,false);assert(stopped>0);
}
(async()=>{for(const mode of ['insecure','missing','no-clip','tracking']){await test(mode);console.log('PASS',mode)}})().catch(e=>{console.error(e);process.exit(1)});
