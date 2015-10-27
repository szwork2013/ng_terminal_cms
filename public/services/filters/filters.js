/**
 * @file 各种过滤器
 * @author zhaoran
 * @date 2015-07-23
 */

 function formatInput(input, arr){

    input = parseInt(input);

    if(isNaN(input) || input > arr.length - 1){
        input = 0;
    }

    return arr[input];
 }

angular.module('cmsService')
    .filter('subStr', function(){

        return function(input, len){
            function subStr(input, len){

                var a = 0;
                var temp = '';

                for(var i = 0; i < input.length; i++){

                    if(input.charCodeAt(i) > 255){
                        a+= 2;
                    }else{
                        a++;
                    }

                    if(a > len){
                        return temp;
                    }

                    temp += input.charAt(i);
                }

                return input;
            }

            return subStr(input, len);
        }
    })
    .filter('getMenuLevelText', function(){

        return function(input){

            var arr = ['-', '一级菜单', '二级菜单'];

            return formatInput(input, arr);
        };
    })
    .filter('getLevelText', function(){

        return function(input){

            var arr = ['-', '普通用户', '管理员'];

            return formatInput(input, arr);
        };
    })
    .filter('getStatusText', function(){

        return function(input){

            // console.log(input);

            var arr = ['-', '未发布', '待审核', '已通过', '已驳回'];

            return formatInput(input, arr);
        };
    })
    .filter('getShownStatusText', function(){

        return function(status, assStatus){

            if(!assStatus){
                assStatus = '0';
            }

            var shownStatus = 0;

            if(assStatus == '0'){
                shownStatus = 3;

            }else if(assStatus == '1' && status == '3'){
                shownStatus = 2;

            }else if(assStatus == '1' && status != '3'){
                shownStatus = 1;
            }else{

                shownStatus = 0;
            }

            var arr = ['-', '隐藏中', '显示中', '已失效'];

            return arr[shownStatus];
        };
    }) 
    .filter('getActivityStatusText', function(){

        return function(input){

            var arr = ['-', '未发布', '待审核', '已通过', '已驳回', '进行中', '已结束'];

            return formatInput(input, arr);
        };
    })
    .filter('getActivityShownStatusText', function(){

        return function(status, assStatus, newStatus){

            var shownStatus = 0;

            if(status == '6'){

                shownStatus = 3;
            }else if(assStatus == '1' && status == '5' && newStatus){

                shownStatus = 2;
            }else if((status == '5' && !newStatus)
                || (status == '5' && newStatus && assStatus == '0')
                || (status == '3')){

                shownStatus = 1;
            }else{

                shownStatus = 0;
            }

            var arr = ['-', '隐藏中', '显示中', '已失效'];

            return arr[shownStatus];
        };
    })
    .filter('getActivityTypeText', function(){

        return function(input){
            var arr = ['-', '签到'];

            return formatInput(input, arr);
        };
    })
    .filter('getDateText', function($filter){

        return function(input){

            if(!input){
                return '-';
            }

            return $filter('date')(input, 'yyyy-MM-dd');
        };
    })
    .filter('getDateTimeText', function($filter){

        return function(input){

            if(!input){
                return '-';
            }

            return $filter('date')(input, 'yyyy-MM-dd HH:mm:ss');
        };
    })