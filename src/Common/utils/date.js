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

/** 日期工具 */

/**
 * 新闻发表时间描述。显示为“刚刚”、“5分钟前”等。
 * @param pastDate 过去日期，如，'2019/08/09 14:30:00' 或 '2019-08-09 14:30:00'
 * @returns {*}
 */
export const newsDate = (pastDate) => {
    let current = new Date().getTime()
    let offset = current - new Date(pastDate).getTime()

    let minute = 1000 * 60
    let hour = minute * 60
    let day = hour * 24
    let week = day * 7
    let month = day * 30
    let year = month * 12

    let unitArr = ['年前', '月前', '周前', '天前', '小时前', '分钟前', '刚刚']
    let offsetArr = [year, month, week, day, hour, minute].map((item, index) => {
        return {
            value: offset / item,
            unit: unitArr[index]
        }
    })

    for (let key in offsetArr) {
        if (offsetArr[key].value >= 1) {
            return parseInt(offsetArr[key].value) + ' ' + offsetArr[key].unit
        }
    }
    return unitArr[6]
}

/**
 * 生成日历重复规则
 * 参考文档：https://tools.ietf.org/html/rfc5545#section-3.8.5.3
 * 文档实例：
 *
 RRULE:FREQ=MINUTELY;INTERVAL=15;COUNT=6 每隔15分钟重复1次，重复6次
 RRULE:FREQ=MINUTELY;INTERVAL=90;COUNT=4 每隔1个半小时重复1次，重复4次
 RRULE:FREQ=MINUTELY;INTERVAL=20;BYHOUR=9,10,11,12,13,14,15,16 每天上午九点到下午4点40，每隔20分钟重复1次


 RRULE:FREQ=HOURLY;INTERVAL=3;UNTIL=19970902T170000Z  (19970902九点开始)每3小时重复1次直到当天下午5点

 RRULE:FREQ=DAILY;COUNT=10 每日重复，重复10次，如，从 9/2到9/11
 RRULE:FREQ=DAILY;UNTIL=19971224T000000Z 每日重复，直到19971223日
 RRULE:FREQ=DAILY;INTERVAL=2 每2日重复，直到永远
 RRULE:FREQ=DAILY;INTERVAL=10;COUNT=5 每10日重复，重复5次

 开始日期假设为1998年1月1日：
 从1998到2000年的三年的一月份每天
 RRULE:FREQ=YEARLY;UNTIL=20000131T140000Z;BYMONTH=1;BYDAY=SU,MO,TU,WE,TH,FR,SA
 或
 RRULE:FREQ=DAILY;UNTIL=20000131T140000Z;BYMONTH=1

 RRULE:FREQ=WEEKLY;COUNT=10   每周重复，重复10周
 RRULE:FREQ=WEEKLY;UNTIL=19971224T000000Z 每周重复，直到19971223
 RRULE:FREQ=WEEKLY;INTERVAL=2;WKST=SU 每两周重复，直到永远
 RRULE:FREQ=WEEKLY;UNTIL=19971007T000000Z;WKST=SU;BYDAY=TU,TH 每周周二和周四，坚持5周
 RRULE:FREQ=WEEKLY;COUNT=10;WKST=SU;BYDAY=TU,TH 效果同上
 RRULE:FREQ=WEEKLY;INTERVAL=2;UNTIL=19971224T000000Z;WKST=SU;BYDAY=MO,WE,FR 每两周重复1次 每周一、三、五，直到某天。
 RRULE:FREQ=WEEKLY;INTERVAL=2;COUNT=8;WKST=SU;BYDAY=TU,TH 每两周重复1次 每周二、四，共4周

 RRULE:FREQ=MONTHLY;COUNT=10;BYDAY=1FR 每个月第一个周五，重复10个月
 RRULE:FREQ=MONTHLY;UNTIL=19971224T000000Z;BYDAY=1FR 每个月第一个周五，直到某天
 RRULE:FREQ=MONTHLY;INTERVAL=2;COUNT=10;BYDAY=1SU,-1SU 每两月重复，每个月第一个周日和最后一个周日，命中5个月共10次(5*2)
 RRULE:FREQ=MONTHLY;COUNT=6;BYDAY=-2MO 每个月倒数第二个周一，重复6个月
 RRULE:FREQ=MONTHLY;BYMONTHDAY=-3 每个月倒数第3天 直到永远
 RRULE:FREQ=MONTHLY;COUNT=10;BYMONTHDAY=2,15 每个月第2，15天，重复5个月共10次
 RRULE:FREQ=MONTHLY;COUNT=10;BYMONTHDAY=1,-1 每个月第1天和最后1天，重复5个月共10次
 RRULE:FREQ=MONTHLY;INTERVAL=18;COUNT=10;BYMONTHDAY=10,11,12,13,14,15 隔18个月重复，每个月的第10-15日，共10次(第一个月命中6次，18个月后命中4次)
 RRULE:FREQ=MONTHLY;INTERVAL=2;BYDAY=TU 每两个月重复 每个月的所有周二 直到永远

 RRULE:FREQ=MONTHLY;BYDAY=FR;BYMONTHDAY=13 每个月的13号恰好是黑色星期五命中，直到永远
 RRULE:FREQ=MONTHLY;BYDAY=SA;BYMONTHDAY=7,8,9,10,11,12,13 每个月第一个周日之后的那个周六，直到永远
 RRULE:FREQ=MONTHLY;COUNT=3;BYDAY=TU,WE,TH;BYSETPOS=3 每月1次，共3个月，每次命中的必须是当月第一次出现的周二、周三、周四中的第三个
 实例：
 1997-9-4    周四（9-1：一，2：二，3：三，4：四）
 1997-10-7   周二（10-1：三，2：四，3：五，4：六，5：日，6：一，7：二）
 1997-11-6   周四（11-1：六，2：日，3：一，4：二，5：三，6：四）
 RRULE:FREQ=MONTHLY;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=-2 每个月命中当月倒数第二个工作日，直到永远
 实例：
 1997-9-29   周一（当月倒数第二个工作日）
 1997-10-30  周四
 1997-11-27  周四
 1997-12-30  周二
 1998-1-29   周四
 1998-2-26   周四
 1998-3-30   周二

 RRULE:FREQ=YEARLY;COUNT=10;BYMONTH=6,7 每年的6月和7月 重复5年共10次
 RRULE:FREQ=YEARLY;INTERVAL=2;COUNT=10;BYMONTH=1,2,3 每两年重复 每年1，2，3月，共10次
 RRULE:FREQ=YEARLY;INTERVAL=3;COUNT=10;BYYEARDAY=1,100,200 每3年重复，每年第1，100，200天，共10次
 RRULE:FREQ=YEARLY;BYDAY=20MO 每年第20周的周一，直到永远
 RRULE:FREQ=YEARLY;BYWEEKNO=20;BYDAY=MO 每年第20周的周一，直到永远
 RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=TH 每年三月的所有周四，直到永远
 RRULE:FREQ=YEARLY;BYDAY=TH;BYMONTH=6,7,8 每年6，7，8月的所有周四，直到永远

 RRULE:FREQ=YEARLY;INTERVAL=4;BYMONTH=11;BYDAY=TU;BYMONTHDAY=2,3,4,5,6,7,8 每四年重复一次，每年11月的第一个周一之后的周二，直到永远
 *
 * @param FREQ 重复类型，可取值：MINUTELY(分钟),HOURLY(小时),DAILY(日),WEEKLY(周),MONTHLY(月),YEARLY(年)
 * @param INTERVAL 间隔数 如，"FREQ=MINUTELY;INTERVAL=15;"代表每隔15分钟重复;"FREQ=WEEKLY;INTERVAL=2;"代表每隔2周重复
 * @param COUNT 限定次数 累计重复事件的总次数。
 * @param UNTIL 截止到某个时间停止重复，如：'20200315T170000Z'(2020-3-15 17:00)。如果COUNT和UNTIL都未设置，就代表一直重复下去。
 * @param LIMIT 附加限制
 * @returns {string}
 */
export const rrule = (FREQ = 'DAILY', INTERVAL = '', COUNT = '', UNTIL = '', LIMIT = {}) => {
    var rule = 'FREQ=' + FREQ + ';'//重复类型
    if(FREQ === 'WEEKLY'){
        rule += 'WKST=SU;'
    }

    if(INTERVAL !== '') {
        rule += 'INTERVAL=' + INTERVAL + ';'//每隔多久重复1次
    }

    if(COUNT !== '') {
        rule += 'COUNT=' + COUNT + ';'//重复总次数
    }

    if(UNTIL !== ''){
        rule += 'UNTIL=' + UNTIL + ';'//
    }

    if(LIMIT.BYHOUR !== undefined){//限定为哪些小时，如，BYHOUR=9,10,11,12,13,14,15,16 每天上午九点到下午4点
        rule += 'BYHOUR=' + LIMIT.BYHOUR + ';'
    }

    if(LIMIT.BYDAY !== undefined){//可选参数，值为SU,MO,TU,WE,TH,FR,SA,1FR(每个月第一个周五),-2MO(每个月倒数第二个周一)
        rule += 'BYDAY=' + LIMIT.BYDAY + ';'

        if(LIMIT.BYSETPOS !== undefined){//可选参数

            //例一："BYDAY=TU,WE,TH;BYSETPOS=3"(每次命中的必须是当月第一次出现的周二、周三、周四中的第三个)
            //1997-9-4    周四（9-1：一，2：二，3：三，4：四）
            //1997-10-7   周二（10-1：三，2：四，3：五，4：六，5：日，6：一，7：二）
            //1997-11-6   周四（11-1：六，2：日，3：一，4：二，5：三，6：四）

            //例二："BYDAY=MO,TU,WE,TH,FR;BYSETPOS=-2"(每个月命中当月倒数第二个工作日，直到永远)
            //1997-9-29   周一（当月倒数第二个工作日）
            //1997-10-30  周四
            //1997-11-27  周四
            //1997-12-30  周二
            //1998-1-29   周四
            //1998-2-26   周四
            //1998-3-30   周二

            rule += 'BYSETPOS=' + LIMIT.BYSETPOS + ';'
        }
    }

    if(LIMIT.BYMONTH !== undefined){//可选参数，值为"6,7"(每年的6月和7月)
        //组合设置举例：BYMONTH=3;BYDAY=TH 每年三月的所有周四
        rule += 'BYMONTH=' + LIMIT.BYMONTH + ';'
    }

    if(LIMIT.BYMONTHDAY !== undefined){//可选参数，值为"-3"(每个月倒数第3天),"2,15"(每个月第2，15天),"1,-1"(每个月第1天和最后1天)
        rule += 'BYMONTHDAY=' + LIMIT.BYMONTHDAY + ';'
    }

    if(LIMIT.BYYEARDAY !== undefined){//可选参数，值为"1,100,200"(第1，100，200天)
        rule += 'BYYEARDAY=' + LIMIT.BYYEARDAY + ';'
    }

    if(LIMIT.BYWEEKNO !== undefined){//可选参数，值为"20"(每年第20周)
        //组合设置举例：BYWEEKNO=20;BYDAY=MO 每年第20周的周一
        rule += 'BYWEEKNO=' + LIMIT.BYWEEKNO + ';'
    }

    return rule
}