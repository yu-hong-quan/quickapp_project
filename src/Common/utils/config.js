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

export const loaderConfig = {
    type: 'HUAWEI' //快应用加载器类型。华为快应用加载器设为"HUAWEI",否则为快应用联盟'UNION'加载器
}
//指定OBS服务相关信息：AK，SK，EndPoint
export const obsConfig = {
    AccessKeyId: '',      //AK
    SecretKey: '',        //SK
    EndPoint: '',         //上传文件的路径
    BucketName: ''        //桶名
}
export const appConfig = {
    QuickAppApiKey: ''  //快应用ApiKey
}
export const amapConfig = {
    key: '' //高德地图Api key
}
export const jdcloudConfig = {
    key: '' //京东万象APPKEY  https://wx.jdcloud.com/api
}
export const gatewayConfig = {
    BaseApi: 'http://192.168.3.5:9998' //网关
}