import { createHash, createHmac, randomBytes, randomUUID } from 'node:crypto';
export type UUID = `${string}-${string}-${string}-${string}-${string}`;
export const NIL='00000000-0000-0000-0000-000000000000' as UUID;
export const MAX='ffffffff-ffff-ffff-ffff-ffffffffffff' as UUID;
export const DNS='6ba7b810-9dad-11d1-80b4-00c04fd430c8' as UUID;
export const URL='6ba7b811-9dad-11d1-80b4-00c04fd430c8' as UUID;
const RE=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
let last=0, seq=0n;
const fmt=(b:Uint8Array):UUID=>{const h=Buffer.from(b).toString('hex');return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}` as UUID};
export function validate(v:unknown):v is UUID{return typeof v==='string'&&(v===NIL||v===MAX||RE.test(v))}
export function parse(v:string):Uint8Array{if(!validate(v))throw new TypeError('Invalid UUID');return new Uint8Array(Buffer.from(v.replaceAll('-',''),'hex'))}
export function stringify(b:Uint8Array):UUID{if(b.length!==16)throw new RangeError('UUID requires 16 bytes');return fmt(b)}
export function version(v:string):number{if(!validate(v))throw new TypeError('Invalid UUID');return v===NIL||v===MAX?0:parseInt(v[14]!,16)}
export function v4():UUID{return randomUUID() as UUID}
export function v5(name:string,namespace:string):UUID{const d=createHash('sha1').update(parse(namespace)).update(name).digest();d[6]=(d[6]!&15)|80;d[8]=(d[8]!&63)|128;return fmt(d.subarray(0,16))}
export function v7(now=Date.now()):UUID{if(!Number.isSafeInteger(now)||now<0||now>0xffffffffffff)throw new RangeError('Invalid timestamp');if(now<last)now=last;let r:bigint;if(now===last){seq=(seq+1n)&((1n<<74n)-1n);r=seq}else{const x=randomBytes(10);x[0] = (x[0] ?? 0) & 0x03;r=BigInt('0x'+x.toString('hex'));seq=r;last=now}const b=new Uint8Array(16);let t=BigInt(now);for(let i=5;i>=0;i--){b[i]=Number(t&255n);t>>=8n}b[6]=0x70|Number((r>>70n)&15n);b[7]=Number((r>>62n)&255n);b[8]=0x80|Number((r>>56n)&63n);for(let i=9,s=48n;i<16;i++,s-=8n)b[i]=Number((r>>s)&255n);return fmt(b)}
export function v8(value:string,secret:string,context='own-uuid'):UUID{if(Buffer.byteLength(secret)<16)throw new RangeError('Secret must be at least 16 bytes');const d=createHmac('sha256',secret).update(context).update('\0').update(value).digest();d[6]=(d[6]!&15)|128;d[8]=(d[8]!&63)|128;return fmt(d.subarray(0,16))}
export function timestamp(v:string):Date{if(version(v)!==7)throw new TypeError('Only v7 contains Unix milliseconds');return new Date(Number(BigInt('0x'+v.replaceAll('-','').slice(0,12))))}
export function compact(v:string):string{return Buffer.from(parse(v)).toString('base64url')}
export function expand(v:string):UUID{const b=Buffer.from(v,'base64url');if(b.length!==16)throw new TypeError('Invalid compact UUID');return fmt(b)}
export function batch(count:number,kind:4|7=7):UUID[]{if(!Number.isInteger(count)||count<0||count>1_000_000)throw new RangeError('count must be 0..1000000');return Array.from({length:count},()=>kind===4?v4():v7())}
export function compare(a:string,b:string):number{return Buffer.compare(Buffer.from(parse(a)),Buffer.from(parse(b)))}
