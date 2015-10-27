/**
 * @file 常量
 * @author zhaoran
 * @date 2015-07-20
 */


angular.module('cmsService').constant('Constant', {
    pageSize: 20,
    systemType: 'merchant', // 商家系统为 merchant 运营系统为 marketing
    CASE_STATUS_UNUSED: 0,
    CASE_STATUS_RELEASING: 1,
    CASE_STATUS_USED: 2,
    STICK_SHOP_COUNT: 6,
    COUPON_DATE_PICKER_OPTIONS: {
        "singleDatePicker": true,
        "timePicker": true,
        "timePicker24Hour": true,
        "autoApply": false,
        "timePickerIncrement": 1,
        "timePickerSeconds": true,
        "locale": {
            "format": "YYYY-MM-DD HH:mm",
            "applyLabel": "确定",
            "cancelLabel": "取消",
            "daysOfWeek": [
                "日",
                "一",
                "二",
                "三",
                "四",
                "五",
                "六"
            ],
            "monthNames": [
                "一月",
                "二月",
                "三月",
                "四月",
                "五月",
                "六月",
                "七月",
                "八月",
                "九月",
                "十月",
                "十一月",
                "十二月"
            ],
            "firstDay": 1
        }
    }
});