﻿module app {
	'use strict';

	angular
		.module('app')
		.config(configRoutes);

	configRoutes.$inject = [
		'$stateProvider',
		'$urlRouterProvider'
	];
	function configRoutes($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) {
		$stateProvider
            .state('app', {
             url: '/app',
             abstract: true,
             templateUrl: 'templates/SideMenu.html',
             controller: 'app.shared.SideMenuController as cx',
             resolve: {
                 "league": ["app.shared.FavoriteTeamService", svc => { return svc.GetLeagues(); }]
             }
            })

            .state('app.main', {
                url: '/main',
                abstract: true,              
             views: {
                 'menuContent': {
                     templateUrl: 'templates/Tabs.html',
                     controller: 'app.match.MainController as cx'
                 }
             }

            })

            .state('app.main.matches', {
             url: '/matches/:day',                
             views: {
                 'matchContent': {
                     templateUrl: 'templates/Matches.html',
                     controller: 'app.match.PredictionController as cx',
                     resolve: {
                         "matches": ["$stateParams", "app.match.MatchService",
                             (params, svc: app.match.MatchService) => {
                             return svc.GetMatchesByDate(params.day);
                         }],
                         "ads": ["app.ads.AdvertisementService", svc => {
                             return svc.GetAdvertisement();
                         }]
                     }
                 }
             }
            })

            .state('app.reward', {
                url: '/reward',
                abstract: true,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/RewardTab.html'
                    }
                }
            })

            .state('app.reward.lists', {
             url: '/lists',
             views: {
                 'rewardContent': {
                     templateUrl: 'templates/Rewards.html',
                     controller: 'app.reward.RewardsController as cx',
                     resolve: {
                         "data": ["app.reward.RewardService", svc => { return svc.GetRewardGroup(); }],
                         "couponSummary": ["app.reward.CouponSummaryService", svc => { return svc.GetCouponSummary(); }]
                     }
                 }
             }
            })

            .state('app.reward.winners', {
             url: '/winners',
             views: {
                 'rewardContent': {
                     templateUrl: 'templates/Winners.html',
                     controller: 'app.reward.WinnersController as cx',
                     resolve: {
                         "winnerData": ["app.reward.RewardService", svc => { return svc.GetWinners(); }]
                     }
                 }
             }
            })

            .state('app.reward.myrewards', {
             url: '/myrewards',
             views: {
                 'rewardContent': {
                     templateUrl: 'templates/MyRewards.html',
                     controller: 'app.reward.MyRewardsController as cx',
                     resolve: {
                         "data": ["app.reward.RewardService", svc => { return svc.GetMyRewards(); }]
                     }
                 }
             }
            })

            .state('app.coupon', {
                url: '/coupon',
                abstract: true,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/BlankLayout.html'
                    }
                }
            })
                .state('app.coupon.sample', {
                    url: '/sample',
                    views: {
                        'menuContent': {
                            templateUrl: 'templates/sample.html'
                        }
                    }
                })

            .state('app.coupon.buy', {
             url: '/buy',
             views: {
                 'menuContent': {
                     templateUrl: 'templates/BuyCoupon.html',
                     controller: 'app.reward.BuyCouponController as cx'
                 }
             }
            })

            .state('app.coupon.processing', {
             url: '/processing',
             views: {
                 'menuContent': {
                     templateUrl: 'templates/BuyCouponProcessing.html',
                     controller: 'app.reward.BuyCouponProcessingController as cx',
                     resolve: {
                         "userprofile": ["app.account.UserProfileService", svc=> { return svc.GetUserProfile(); }]
                     }
                 }
             }
            })
            .state('app.verify', {
                url: '/verify',
                abstract: true,
                views: {
                'menuContent': {
                    templateUrl: 'templates/BlankLayout.html'
                }
            }
            })
            .state('app.verify.phone', {
             url: '/phone',
             views: {
                 'menuContent': {
                     templateUrl: 'templates/VerifyPhone.html'
                 }
             }
            })

            .state('app.verify.verifycode', {
             url: '/verifycode/:phoneNo',
             views: {
                 'menuContent': {
                     templateUrl: 'templates/VerifyCode.html',
                     controller: 'app.account.VerifySecretCodeController as cx',
                     resolve: {
                         "phoneNo": ["$stateParams", stateParams=> { return stateParams.phoneNo; }]
                     }
                 }
             }
            })
            .state('app.history', {
                url: '/history',
                abstract: true,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/BlankLayout.html'
                    }
                }
            })
            .state('app.history.summary', {
             url: '/summary',
             views: {
                 'menuContent': {
                     templateUrl: 'templates/YearlyHistory.html',
                     controller: 'app.match.MonthlyHistoryController as cx',
                     resolve: {
                         "data": ["app.shared.UserProfileService", "app.match.HistoryService",
                             (userService: app.shared.UserProfileService, svc) => {
                             var userId = userService.GetUserProfile().UserId;
                             return svc.GetHistoryMonthly(userId);
                         }]
                     }
                 }
             }
            })

            .state('app.history.monthly', {
             url: '/monthly/:month',
             views: {
                 'menuContent': {
                     templateUrl: 'templates/MonthlyHistory.html',
                     controller: 'app.match.DaylyHistoryController as cx',
                     resolve: {
                         "data": ["$stateParams", "app.shared.UserProfileService", "app.match.HistoryService",
                             (params, userService: app.shared.UserProfileService, svc: app.match.HistoryService) => {
                             var userId = userService.GetUserProfile().UserId;
                             var now = new Date();
                             var currentYear = now.getFullYear();
                             return svc.GetHistoryDaily(userId, currentYear, params.month);
                         }]
                     }
                 }
             }
            })
            .state('app.config', {
                url: '/config',
                abstract: true,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/BlankLayout.html'
                    }
                }
            })
            .state('app.config.setting', {
                url: '/setting',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/Setting.html',
                        controller: 'app.account.SettingController as cx',
                        resolve: {
                            "userprofile": ["app.account.UserProfileService", svc => { return svc.GetUserProfile(); }]
                        }
                    }
                }
            })

            .state('app.underconstruction', {
             url: '/underconstruction',
             views: {
                 'menuContent': {
                     templateUrl: 'templates/UnderConstruction.html'
                 }
             }
            })
        ;

        $urlRouterProvider.otherwise(()=>
        {
            var now = new Date;
            return '/app/main/matches/'+ now.getDate();
        });
        //$urlRouterProvider.otherwise('/sample');
	}
}