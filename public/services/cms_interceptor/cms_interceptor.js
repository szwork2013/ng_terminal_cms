/**
 * @file 全局http拦截器
 * @author zhaoran
 * @date 2015-06-11
 */

angular.module('cmsService').factory('cmsInterceptor', function($q, $injector, Constant){

    var isLoginShown = false;

    var blockedRequestArrFor401 = [];

    return {
        request: function(config){
            // console.log(config);

            var url = config.url;

            if(Constant.systemType && url.indexOf('/api/') === 0){
        
                url = '/' + Constant.systemType + url;
            }

            if(config.data){

                if(typeof config.data.pageSize !== 'undefined'){

                    config.data.page_size = config.data.pageSize;
                }

                if(typeof config.data.currentPage !== 'undefined'){

                    config.data.page = config.data.currentPage;
                }
            }
                

            // if(url.indexOf('.html') == -1){
                
            //     if(url.indexOf('?') > -1){
            //         url += '&test=2';
            //     }else{
            //         url += '?test=2';
            //     }
            // }



            config.url = url;

            return config;
        },
        response: function(response){

            // console.log(response);

            var deferred = $q.defer();


            if(response.status == 200){

                var json = response.data;

                if(json.meta){

                    var errno = json.meta.status || json.meta.errno;
                    var msg = json.meta.msg;

                    response.data.errno = errno;
                    response.data.msg = msg;

                    if(response.data.result.current_page){
                        response.data.currentPage = response.data.result.current_page;
                    }

                    if(response.data.result.page_size){
                        response.data.pageSize = response.data.result.page_size;
                    }

                    switch(errno){
                        case 0:
                            deferred.resolve(response);
                            break;
                        case 401 : //未登录
                            
                            blockedRequestArrFor401.push({
                                response: response,
                                deferred: deferred
                            });

                            if(!isLoginShown){

                                isLoginShown = true;

                                var Login = $injector.get('Login');
                                var $http = $injector.get('$http');

                                Login.popup().then(function(json){

                                    isLoginShown = false;


                                    for(var i = 0; i < blockedRequestArrFor401.length; i++){

                                        (function(index){
                                            var blockedRequestFor401 = blockedRequestArrFor401[index];
                                            var response = blockedRequestFor401.response;
                                            var deferred = blockedRequestFor401.deferred;

                                            $http(response.config).then(function(retryResponse){

                                                deferred.resolve(retryResponse);
                                            }, function(retryResponse){
                                                deferred.reject(retryResponse);
                                            });
                                        })(i);    
                                    }

                                }, function(){

                                    // console.log('error');
                                    deferred.reject(response);
                                });
                            }
                                
                                
                            break;

                        default:
                            var Dialog = $injector.get('Dialog');
                            Dialog.alert('错误信息', msg);
                            deferred.reject(response);
                            break;
                    }

                }else{
                    deferred.resolve(response);
                }

            }else{
                deferred.reject(response);
            }    

            return deferred.promise;
        }
    };
});