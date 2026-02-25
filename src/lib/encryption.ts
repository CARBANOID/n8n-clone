import Crypt from "cryptr" ; 

const cryptr = new Crypt(process.env.ENCRYPTION_KEY!);

const encrpyt = (text : string) => cryptr.encrypt(text) ;
const decrypt = (text : string) => cryptr.decrypt(text) ;

export { encrpyt , decrypt } ;