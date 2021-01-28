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

/** 颜色转换工具 */
import { fill2 } from './string'

/**
 * hex颜色转hsv
 * @param str hex色值，如：#ff0000
 * @returns {*}
 */
export const rgbTohsv = (str) => {
    var rValue = parseInt('0x'+str.substr(1,2))
    var gValue = parseInt('0x'+str.substr(3,2))
    var bValue = parseInt('0x'+str.substr(5,2))

    var max = Math.max(rValue,gValue,bValue)
    var min = Math.min(rValue,gValue,bValue)

    var H = 0

    if(max > min){
        if (rValue === max) {
            H = (gValue - bValue) / (max - min) * 60
        }
        if (gValue === max){
            H = 120 + (bValue - rValue) / (max - min) * 60
        }
        if (bValue === max){
            H = 240 + (rValue - gValue) / (max - min) * 60
        }

        if (H < 0){
            H += 360
        }

        H = Math.ceil(H)

        if(H > 360){
            H = 360
        }
    }

    return H
}

/**
 * hsv颜色转hex色值
 * @param h 色调
 * @param s 饱和度
 * @param v 明度
 * @returns {*}
 */
export const hsvToHexColor = (h,s,v) => {
    var rValue = 0
    var gValue = 0
    var bValue = 0
    if(s===0){
        rValue = Math.ceil(v*256)-1
        gValue = Math.ceil(v*256)-1
        bValue = Math.ceil(v*256)-1
    }else{
        h /=60
        var i = Math.floor(h)
        var f = h - i
        var a = v * (1 - s)
        var b = v * (1 - s * f)
        var c = v * (1 - s * (1 - f ))

        switch (i){
            case 0:
            default:
                rValue = v
                gValue = c
                bValue = a
                break
            case 1:
                rValue = b
                gValue = v
                bValue = a
                break
            case 2:
                rValue = a
                gValue = v
                bValue = c
                break
            case 3:
                rValue = a
                gValue = b
                bValue = v
                break
            case 4:
                rValue = c
                gValue = a
                bValue = v
                break
            case 5:
                rValue = v
                gValue = a
                bValue = b
                break
        }

        rValue = Math.ceil(rValue*256)-1
        gValue = Math.ceil(gValue*256)-1
        bValue = Math.ceil(bValue*256)-1
    }

    if(rValue < 0){
        rValue = 0
    }
    if(gValue < 0){
        gValue = 0
    }
    if(bValue <0){
        bValue = 0
    }
    if(rValue > 255){
        rValue = 255
    }
    if(gValue > 255){
        gValue = 255
    }
    if(bValue > 255){
        bValue = 255
    }
    return '#' + fill2(rValue.toString(16)) + fill2(gValue.toString(16)) + fill2(bValue.toString(16))
}

/**
 * 颜色名转hex值
 * @param key
 * @returns {string}
 */
export const keyTohex = (key) => {
    var hex = ''

    switch (key) {
        case 'primary':
            hex = '#337ab7'
            break
        case 'info':
            hex = '#5bc0de'
            break
        case 'success':
            hex = '#67c23a'
            break
        case 'warning':
            hex = '#e6a23c'
            break
        case 'danger':
            hex = '#f56c6c'
            break
        case 'link':
            hex = '#2D8cF0'
            break
        case 'blue':
            hex = '#007bff'
            break
        case 'indigo':
            hex = '#6610f2'
            break
        case 'purple':
            hex = '#6f42c1'
            break
        case 'pink':
            hex = '#e83e8c'
            break
        case 'red':
            hex = '#dc3545'
            break
        case 'orange':
            hex = '#fd7e14'
            break
        case 'yellow':
            hex = '#ffc107'
            break
        case 'green':
            hex = '#28a745'
            break
        case 'teal':
            hex = '#20c997'
            break
        case 'cyan':
            hex = '#17a2b8'
            break
        case 'gray':
            hex = '#6c757d'
            break
        case 'gray-dark':
            hex = '#343a40'
            break
        case 'light':
            hex = '#f8f9fa'
            break
        case 'dark':
            hex = '#343a40'
            break
        case 'white':
            hex = '#ffffff'
            break
        case 'title':
            hex = '#1c2438'
            break
        case 'content':
            hex = '#495060'
            break
        case 'muted':
            hex = '#6c757d'
            break
        case 'default':
        default:
            hex = '#000000'
            break
    }

    return hex
}
