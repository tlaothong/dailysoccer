﻿module app {
    'use strict';

    export interface IAppConfig {
        ProfileUrl: string;
        VerifyPhoneUrl: string;
        BuyCouponUrl: string;
    }

    export class AppConfig implements IAppConfig {

        public ProfileUrl: string;
        public VerifyPhoneUrl: string;
        public BuyCouponUrl: string;

        static $inject = ['defaultUrl'];
        constructor(defaultUrl: string) {
            var apiUrl = defaultUrl + '/api';

            this.ProfileUrl = apiUrl + '/profiles/:id';
            this.VerifyPhoneUrl = this.ProfileUrl + '/:action';
            this.BuyCouponUrl = apiUrl + '/coupons/buy';
        }

    }

    angular
        .module('app')
        .constant('defaultUrl', 'http://localhost:2394')
        .service('appConfig', AppConfig);
}