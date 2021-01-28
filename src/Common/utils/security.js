/**
 * Copyright 2019 H-UI [ @author Mac.Manon @email fastapp@139.com ]
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 * this file except in compliance with the License.  You may obtain a copy of the
 * License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations under the License.
 *
 */

/** 加解密工具 */

const base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
const sha1Blocksize = 16

/**
 * 全局唯一标识符UUID
 * @param trim 是否剔除中横线
 * @returns {string}
 */
export const getUuid = (trim=false) => {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c==='x' ? r : (r&0x3|0x8)).toString(16);
    });
    if(trim){
        uuid = uuid.replace(/[-]/g, '')
    }
    return uuid;
}

/**
 * uft8编码
 * @param str
 * @returns {string}
 */
export const utf8Encode = (str) => {
    var output = ""
    str = str.replace(/\r\n/g, "\n")

    for (var i = 0; i < str.length; i++) {

        var c = str.charCodeAt(i)

        if (c < 128) {
            output += String.fromCharCode(c)
        } else if ((c > 127) && (c < 2048)) {
            output += String.fromCharCode((c >> 6) | 192)
            output += String.fromCharCode((c & 63) | 128)
        } else {
            output += String.fromCharCode((c >> 12) | 224)
            output += String.fromCharCode(((c >> 6) & 63) | 128)
            output += String.fromCharCode((c & 63) | 128)
        }

    }

    return output
}

/**
 * uft8解码
 * @param str
 * @returns {string}
 */
export const utf8Decode = (str) => {
    var output = ""
    var i = 0, c1 = 0, c2 = 0, c3 = 0

    while (i < str.length) {

        c1 = str.charCodeAt(i)

        if (c1 < 128) {
            output += String.fromCharCode(c1)
            i++
        } else if ((c1 > 191) && (c1 < 224)) {
            c2 = str.charCodeAt(i + 1)
            output += String.fromCharCode(((c1 & 31) << 6) | (c2 & 63))
            i += 2
        } else {
            c2 = str.charCodeAt(i + 1)
            c3 = str.charCodeAt(i + 2)
            output += String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))
            i += 3
        }

    }

    return output
}

/**
 * base64编码
 * @param str
 * @returns {string}
 */
export const base64Encode = (str) => {
    var output = ""
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4
    var i = 0

    str = utf8Encode(str)

    while (i < str.length) {

        chr1 = str.charCodeAt(i++)
        chr2 = str.charCodeAt(i++)
        chr3 = str.charCodeAt(i++)

        enc1 = chr1 >> 2
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
        enc4 = chr3 & 63

        if (isNaN(chr2)) {
            enc3 = enc4 = 64
        } else if (isNaN(chr3)) {
            enc4 = 64
        }

        output += base64map.charAt(enc1) + base64map.charAt(enc2) + base64map.charAt(enc3) + base64map.charAt(enc4)
    }

    return output
}

/**
 * base64解码
 * @param str
 * @returns {string}
 */
export const base64Decode = (str) => {
    var output = ""
    var chr1, chr2, chr3
    var enc1, enc2, enc3, enc4
    var i = 0

    str = str.replace(/[^A-Za-z0-9\+\/\=]/g, "")

    while (i < str.length) {

        enc1 = base64map.indexOf(str.charAt(i++))
        enc2 = base64map.indexOf(str.charAt(i++))
        enc3 = base64map.indexOf(str.charAt(i++))
        enc4 = base64map.indexOf(str.charAt(i++))

        chr1 = (enc1 << 2) | (enc2 >> 4)
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
        chr3 = ((enc3 & 3) << 6) | enc4

        output += String.fromCharCode(chr1)

        if (enc3 !== 64) {
            output += String.fromCharCode(chr2)
        }
        if (enc4 !== 64) {
            output += String.fromCharCode(chr3)
        }

    }

    output = utf8Decode(output)

    return output
}

/**
 * 向左旋转
 * @param n
 * @param b
 * @returns {number}
 */
export const cryptoRotl = (n, b) => {
    return (n << b) | (n >>> (32 - b))
}

/**
 * 向右旋转
 * @param n
 * @param b
 * @returns {number}
 */
export const cryptoRotr = (n, b) => {
    return (n << (32 - b)) | (n >>> b)
}

/**
 * 大尾数交换为小尾数，反之亦然
 * @param n
 */
export const cryptoEndian = (n) => {
    // If number given, swap endian
    if (n.constructor === Number) {
        return cryptoRotl(n,  8) & 0x00FF00FF | cryptoRotl(n, 24) & 0xFF00FF00
    }

    // Else, assume array and swap all items
    for (var i = 0; i < n.length; i++) {
        n[i] = cryptoEndian(n[i])
    }
    return n
}

/**
 * 随即字节
 * @param n
 * @returns {Array}
 */
export const cryptoRandomBytes = (n) => {
    for (var bytes = []; n > 0; n--) {
        bytes.push(Math.floor(Math.random() * 256))
    }
    return bytes
}

/**
 * 字符串转字节
 * @param str
 * @returns {Array}
 */
export const cryptoStringToBytes = (str) => {
    var bytes = []
    for (var i = 0; i < str.length; i++) {
        bytes.push(str.charCodeAt(i))
    }
    return bytes
}

/**
 * 字节转字符串
 * @param bytes
 * @returns {string}
 */
export const cryptoBytesToString = (bytes) => {
    var str = []
    for (var i = 0; i < bytes.length; i++) {
        str.push(String.fromCharCode(bytes[i]))
    }
    return str.join("")
}

/**
 * 字符串转32位words
 * @param str
 * @returns {Array}
 */
export const cryptoStringToWords = (str) => {
    var words = []
    for (var c = 0, b = 0; c < str.length; c++) {
        words[b >>> 5] |= str.charCodeAt(c) << (24 - b % 32)
        b += 8
    }
    return words
}

/**
 * 字节转32位words
 * @param bytes
 * @returns {Array}
 */
export const cryptoBytesToWords = (bytes) => {
    var words = []
    for (var i = 0, b = 0; i < bytes.length; i++) {
        words[b >>> 5] |= bytes[i] << (24 - b % 32)
        b += 8
    }
    return words
}

/**
 * 32位words转字节
 * @param words
 * @returns {Array}
 */
export const cryptoWordsToBytes = (words) => {
    var bytes = []
    for (var b = 0; b < words.length * 32; b += 8) {
        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF)
    }
    return bytes
}

/**
 * 字节转二进制字符串
 * @param bytes
 * @returns {string}
 */
export const cryptoBytesToHex = (bytes) => {
    var hex = []
    for (var i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16))
        hex.push((bytes[i] & 0xF).toString(16))
    }
    return hex.join("")
}

/**
 * 二进制字符串转字节
 * @param hex
 * @returns {Array}
 */
export const cryptoHexToBytes = (hex) => {
    var bytes = []
    for (var c = 0; c < hex.length; c += 2) {
        bytes.push(parseInt(hex.substr(c, 2), 16))
    }
    return bytes
}

/**
 * 字节转base64字符串
 * @param bytes
 * @returns {string}
 */
export const cryptoBytesToBase64 = (bytes) => {

    var base64 = [], overflow

    for (var i = 0; i < bytes.length; i++) {
        switch (i % 3) {
            case 0:
                base64.push(base64map.charAt(bytes[i] >>> 2))
                overflow = (bytes[i] & 0x3) << 4
                break
            case 1:
                base64.push(base64map.charAt(overflow | (bytes[i] >>> 4)))
                overflow = (bytes[i] & 0xF) << 2
                break
            case 2:
                base64.push(base64map.charAt(overflow | (bytes[i] >>> 6)))
                base64.push(base64map.charAt(bytes[i] & 0x3F))
                overflow = -1
        }
    }

    if (overflow !== undefined && overflow !== -1) {
        base64.push(base64map.charAt(overflow))
    }

    while (base64.length % 4 !== 0){
        base64.push("=")
    }

    return base64.join("")
}

/**
 * base64字符串转字节
 * @param base64
 * @returns {Array}
 */
export const cryptoBase64ToBytes = (base64) => {

    base64 = base64.replace(/[^A-Z0-9+\/]/ig, "")

    var bytes = []

    for (var i = 0; i < base64.length; i++) {
        switch (i % 4) {
            case 1:
                bytes.push((base64map.indexOf(base64.charAt(i - 1)) << 2) |
                    (base64map.indexOf(base64.charAt(i)) >>> 4))
                break
            case 2:
                bytes.push(((base64map.indexOf(base64.charAt(i - 1)) & 0xF) << 4) |
                    (base64map.indexOf(base64.charAt(i)) >>> 2))
                break
            case 3:
                bytes.push(((base64map.indexOf(base64.charAt(i - 1)) & 0x3) << 6) |
                    (base64map.indexOf(base64.charAt(i))))
                break
        }
    }

    return bytes
}


/**
 * cryptoSHA1加密(核心实现)
 * @param message
 * @returns {*[]}
 */
export const cryptoSHA1Core = (message) => {
    var m  = cryptoStringToWords(message), l  = message.length * 8, w  =  [], H0 =  1732584193, H1 = -271733879, H2 = -1732584194, H3 =  271733878, H4 = -1009589776

    m[l >> 5] |= 0x80 << (24 - l % 32)
    m[((l + 64 >>> 9) << 4) + 15] = l

    for (var i = 0; i < m.length; i += 16) {

        var a = H0, b = H1, c = H2, d = H3, e = H4

        for (var j = 0; j < 80; j++) {

            if (j < 16){
                w[j] = m[i + j]
            }
            else {
                var n = w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16]
                w[j] = (n << 1) | (n >>> 31)
            }

            var t = ((H0 << 5) | (H0 >>> 27)) + H4 + (w[j] >>> 0) + (
                j < 20 ? (H1 & H2 | ~H1 & H3) + 1518500249 :
                    j < 40 ? (H1 ^ H2 ^ H3) + 1859775393 :
                        j < 60 ? (H1 & H2 | H1 & H3 | H2 & H3) - 1894007588 :
                            (H1 ^ H2 ^ H3) - 899497514)

            H4 =  H3
            H3 =  H2
            H2 = (H1 << 30) | (H1 >>> 2)
            H1 =  H0
            H0 =  t

        }

        H0 += a
        H1 += b
        H2 += c
        H3 += d
        H4 += e

    }

    return [H0, H1, H2, H3, H4]
}

/**
 * cryptoSHA1加密
 * @param message
 * @param options
 * @returns {Array}
 */
export const cryptoSHA1 = (message, options) => {
    var digestbytes = cryptoWordsToBytes(cryptoSHA1Core(message))
    return options && options.asBytes ? digestbytes : options && options.asString ? cryptoBytesToString(digestbytes) : cryptoBytesToHex(digestbytes)
}

/**
 * cryptoHMAC加密
 * @param hasher
 * @param message
 * @param key
 * @param options
 * @returns {string}
 */
export const cryptoHMAC = (message, key, options) => {

    key = key.length > sha1Blocksize * 4 ? cryptoSHA1(key, { asBytes: true }) : cryptoStringToBytes(key);

    var okey = key, ikey = key.slice(0)
    for (var i = 0; i < sha1Blocksize * 4; i++) {
        okey[i] ^= 0x5C
        ikey[i] ^= 0x36
    }

    var hmacbytes = cryptoSHA1(cryptoBytesToString(okey) + cryptoSHA1(cryptoBytesToString(ikey) + message, { asString: true }), { asBytes: true })
    return options && options.asBytes ? hmacbytes : options && options.asString ? cryptoBytesToString(hmacbytes) : cryptoBytesToHex(hmacbytes)
}
