/**
 * Created by jackytianer on 15/10/26.
 */
angular.module('ui.tx', [])
    .directive('dtp', ['$timeout', function ($timeout) {
        return {
            stricts: 'EA',
            require: '^ngModel',
            replace: 'false',
            templateUrl: 'components/datetimepicker/dateTimPickerTemplate.html',
            scope: {},
            link: function (scope, ele, attrs, modelCtrl) {
                var uDtpElement = ele[0].querySelector('.u-dtp-content');
                if(!uDtpElement) return;
                uDtpElement.addEventListener('scroll', function (e) {
                    if (this.scrollTop === 0) {
                        $timeout(function () {
                            scope.setPreviousMonth(3, scope.offsetMonth, scope.source.result);
                            this.scrollTop = scope.eleHeight * 3;
                        }.bind(this), 100)
                    }
                    if (this.clientHeight + this.scrollTop >= this.scrollHeight) {
                        $timeout(function () {
                            scope.setNextMonth(3, scope.offsetMonth, scope.source.result);
                            this.scrollTop = this.scrollHeight - scope.eleHeight * 3;
                        }.bind(this), 100)
                    }
                });
                scope.$watch('source.crtDate', function (newV, oldV) {
                    scope.crtTimestamp = new Date(newV).setHours(0, 0, 0, 0 );
                    if (newV) {
                        var date = new Date(newV);
                        date.setDate(1);
                        date.setHours(0, 0, 0, 0);
                        for (var i = 0; i < scope.source.result.length; i++) {
                            if (date.getTime() === scope.source.result[i].date.getTime()) {
                                uDtpElement.scrollTop = i * scope.eleHeight;
                            }
                        }
                    }

                });


            },
            controller: ['$scope', '$filter', 'dtpService', function ($scope, $filter, dtpService) {
                $scope.offsetMonth = {
                    start: 2,
                    end: 2
                }
                // 列表数据源
                $scope.source = {
                    today: new Date(new Date().setHours(0, 0, 0, 0)),
                    crtDate: $filter('date')(new Date(), 'yyyy-MM-dd'),
                    crtTime: new Date(),
                    result: dtpService.getInitResult($scope.offsetMonth)
                };

                $scope.setDate = function (day) {
                    $scope.source.crtDate = $filter('date')(day, 'yyyy-MM-dd');
                    $scope.crtTimestamp = day.getTime();
                }


                $scope.eleHeight = dtpService.HEIGHT;
                $scope.offsetMonth = dtpService.offsetMonth;
                $scope.setPreviousMonth = dtpService.setPreviousMonth.bind(dtpService);
                $scope.setNextMonth = dtpService.setNextMonth.bind(dtpService);
            }]
        }
    }])
    .service('dtpService', [function () {
        var MS_OF_DAY = 24 * 3600 * 1000;
        this.HEIGHT = 176;

        this.crtPosition = 2;
        this.source = {
            crtDate: new Date()
        }

        this.offsetMonth = {
            start: 2,
            end: 2
        }

        var getResultInSource = function (crtDate, start, end) {
            var result = [];
            for (var l = crtDate.getMonth(), i = l - start; i <= l + end; i++) {
                var dateObj = {
                    date: '',
                    days: []
                }
                var mfirst = new Date();
                mfirst.setFullYear(mfirst.getFullYear(), i, 1);
                mfirst.setHours(0, 0, 0, 0);
                dateObj.date = mfirst;
                var mfirstTime = +mfirst;
                var nfirst = new Date();
                nfirst.setFullYear(nfirst.getFullYear(), i + 1, 1);
                var nfirstTime = +nfirst;
                var lastTime = nfirstTime + ((7 - nfirst.getDay()) % 7 - 1) * MS_OF_DAY;
                var num = -mfirst.getDay();
                var tmpTime, tmp;
                do {
                    tmpTime = mfirstTime + (num++) * MS_OF_DAY;
                    tmp = new Date(tmpTime);
                    dateObj.days.push(tmp);
                } while (tmpTime < lastTime);
                result.push(dateObj);
            }
            return result;
        }

        this.getInitResult = function (obj) {
            //this.source.result = getResultInSource(this.source.crtDate, this.offsetMonth.start, this.offsetMonth.end);
            return getResultInSource(this.source.crtDate, obj.start, obj.end);
        };

        this.setPreviousMonth = function (offset, obj, objResult) {
            var offset = offset || 3;
            var result = getResultInSource(this.source.crtDate, obj.start + offset, -obj.start - 1);
            for (var i = result.length - 1; i >= 0; i--) {
                //this.source.result.unshift(result[i]);
                objResult.unshift(result[i]);
            }
            obj.start += offset;
            //this.offsetMonth.start += offset;
        };
        this.setNextMonth = function (offset, obj, objResult) {
            var offset = offset || 3;
            var result = getResultInSource(this.source.crtDate, -obj.end - 1, obj.end + offset);
            for (var i in  result) {
                //this.source.result.push(result[i]);
                objResult.push(result[i]);
            }
            obj.end += offset;
            //this.offsetMonth.end += offset;
        }
    }])