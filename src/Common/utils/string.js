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

/** 字符串工具 */

import { random } from './number'

/**
 * 随机字符串
 * @param len 需要生成随机字符串的长度
 * @returns {*}
 */
export const randomString = (len) => {
    const str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    var value = ''
    for(var i=0;i<len;i++){
        var index = random(0,61)
        value += str[index]
    }
    return value
}

/**
 * 随机颜色
 * @param min 最小值
 * @param max 最大值
 * @param alpha
 * @returns {*}
 */
export const randomColor = (min, max, alpha = 1) => {
    var value = 'rgba('
    if(min < 0){
        min = 0
    }
    if(min > 255){
        min = 255
    }
    if(max < 0){
        max = 0
    }
    if(max > 255){
        max = 255
    }
    if(alpha < 0){
        alpha = 0
    }
    if(alpha > 1){
        alpha = 1
    }
    for(var i=0;i<3;i++){
        var index = (min <= max) ? random(min,max) : random(max, min)
        value += index.toString() + ', '
    }
    value += alpha + ')'
    return value
}


/**
 * 补零
 * @param str
 * @returns {*}
 */
export const fill2 = (str) => {
    if (str.length === 1) {
        str = '0' + str
    }

    return str
}
