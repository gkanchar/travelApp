(() => {
    'use strict';

    /**
     * @ngdoc module
     * @name travel.service
     * @requires dependencies
     * @description
     *
     * The `travel.service` description.
     *
     */
    var appService = angular
            .module('travel.service', [
                'angular-jwt'
            ]);
        appService.service('Helpers',function(){
             return {
                'extractDate' :  function(isoDate){
                                    var date=new Date(isoDate);
                                    var day=date.getDate();
                                    var month=date.getMonth()+1;
                                    var year=date.getFullYear();
                                    console.log("Extracted date "+day+"-"+month+"-"+year);
                                    return day+"-"+month+"-"+year;
                                  }
                                }
          });


          appService.service('Storage',function($window){
          var store = $window.localStorage;
              return{
                    getUsername: getUsername,
                    setUsername: setUsername,
                    remove:remove,
                    save:save
              };
            function getUsername() {
              return store.getItem('username');
            }
            function setUsername(username) {
              return store.setItem('username',username);
            }
            function remove(key){
              return store.removeItem(key);
            }
            function save(key,value){
              return store.setItem(key,value);
            }

          });

          appService.service('AuthService',function($window, jwtHelper){
             return{
               isLoggedIn:isLoggedIn
             };
             function isLoggedIn(){
               var token = $window.localStorage.getItem('access-token');
               if (token) {
                 if (!jwtHelper.isTokenExpired(token)) {
                   if($window.localStorage.getItem('loggedIn')){
                     return true;
                   }else{
                     $mdToast.show(
                       $mdToast.simple()
                         .content('User is not logged in')
                         .hideDelay(2000)
                         .position('top right')
                         .theme("error-toast")
                     );
                     //toastr.error("User is not logged in", 'Error');
                     console.log("User is not logged in");
                     return false;
                   }
                 }else{
                   $mdToast.show(
                     $mdToast.simple()
                       .content('Authorization Token Expired, please login...')
                       .hideDelay(2000)
                       .position('top right')
                       .theme("error-toast")
                   );
                   console.log("Authorization Token Expired");
                   return false;

                 }
               }
             }
          });

          appService.service("CountryListService",function($http,SKYSCANNER_API){

              this.fetchCities = function(){
                  return $http.get(SKYSCANNER_API.COUNTRY_URL);
              }
          });
          appService.service("TravelService",function($http, SKYSCANNER_API){
              this.queryFlight = function(data){
                  //console.log("Service - Data " + data.country);
                  var queryFlightURLCCODE = SKYSCANNER_API.BROWSE_QUOTES.replace('{country}',data.country).replace('{currency}','USD').replace('{locale}','en_US');
                  var queryFlightURLOriDes =  queryFlightURLCCODE.replace('{originPlace}',data.originPlace).replace('{destinationPlace}',data.destinationPlace);
                  var finalQuery= queryFlightURLOriDes.replace('{outboundPartialDate}',data.outboundPartialDate).replace('{inboundPartialDate}',data.inboundPartialDate);
                  var _finalQuery=SKYSCANNER_API.SEARCH_FLIGHTS+"?searchQuery="+finalQuery;
                  console.log(_finalQuery);
                  return $http.get(_finalQuery);

               };
          });
          appService.service("SharedService",function(){
              var _places="";
              this.setPlaces = function(places){
                  _places= places;
              }
              this.getPlaces=  function(){
                  return _places;
              }

              var _carriers="";
              this.setCarriers=function(carriers){
                  _carriers=carriers;
              }
              this.getCarriers=function(){
                  return _carriers;
              }

          });

          appService.service('UserService',function($http,CONSTANT,Storage){
              this.login = function(user){
                return $http.post(CONSTANT.API_URL+'/authenticate',user,{headers:{'Content-Type': 'application/json'}});
              };

              this.logout = function(){
                 Storage.remove('access-token');
                 Storage.remove('username');
                 Storage.remove('loggedIn');
              };
          });
})();
