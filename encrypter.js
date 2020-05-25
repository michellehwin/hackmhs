const CryptoJS = require("crypto-js");

let code = (function(){
    return{
      encrypt: function (messageToencrypt, secretkey) {
        var encryptedMessage = CryptoJS.AES.encrypt(messageToencrypt, secretkey);
        return encryptedMessage.toString();
      },
      decrypt: function(encryptedMessage, secretkey){
        var decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, secretkey);
        var decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);
        return decryptedMessage;
      }
    }
})();

let code2 = (function(){
    return{
		encrypt: function (messageToencrypt, secretkey) {
			return CryptoJS.AES.encrypt(JSON.stringify(messageToencrypt), secretkey,
			{
				keySize: 128 / 8,
				iv: secretkey,
				mode: CryptoJS.mode.CBC,
				padding: CryptoJS.pad.Pkcs7
			}).toString();
      },
      decrypt: function(encryptedMessage, secretkey){
		return CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(encryptedMessage, secretkey, 
			{
				iv: secretkey,
				mode: CryptoJS.mode.CBC,
				padding: CryptoJS.pad.Pkcs7
			}));
		}
    }
})();

let code3 = (function(){
    return{
		encrypt: function (messageToencrypt, secretkey) {
			
			var salt = CryptoJS.lib.WordArray.create(0); // empty array
			var params = CryptoJS.kdf.OpenSSL.execute(secretkey, 256/32, 128/32, salt);
			var pt = messageToencrypt;
			var encrypted = CryptoJS.AES.encrypt(pt, params.key, {iv: params.iv});
			return encrypted.ciphertext.toString();
      },
      decrypt: function(encryptedMessage, secretkey){
		var ctHex = encryptedMessage;
		var ct = CryptoJS.enc.Hex.parse(ctHex);
		var salt = CryptoJS.lib.WordArray.create(0); // empty array
		var decrypted = CryptoJS.AES.decrypt({ ciphertext: ct, salt: salt }, secretkey);
		return decrypted.toString(CryptoJS.enc.Utf8);
		}
    }
})();


module.exports = { code, code2, code3 };