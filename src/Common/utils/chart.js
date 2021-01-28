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

/** 图表工具 */

/**
 * 步进值
 * @param max
 * @returns {*}
 */
export const getStepValue = max => {
    var step1 = Math.ceil(max / 5)
    step1 = Math.ceil(step1 / Math.pow(10,step1.toString().length-1)) * Math.pow(10,step1.toString().length-1)

    for(var i = -10;i<=10;i++){
        if( Math.pow(10,i) > max){
            var temp = Math.pow(10,i)
            var k = 0.1
            for(var j = 1; j <= 10;j++){
                if(temp * k >= max){
                    var step2 = (temp * k).toFixed(Math.abs(i)+1)/5
                    return step1 <= step2 ? step1 : step2
                }
                k+=0.1
            }
        }
    }
}