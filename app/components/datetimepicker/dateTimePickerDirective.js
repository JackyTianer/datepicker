/**
 * Created by jackytianer on 15/10/26.
 */
angular.module('ui.tx', [])
    .directive('dtp', [function () {
        return {
            stricts: 'EA',
            require: '^ngModel',
            templateUrl: 'components/datetimepicker/dateTimPickerTemplate.html',
            scope: {},
            link: function (scope, ele, attrs, modelCtrl) {
            },
            controller: ['$scope', 'dtpService', function ($scope, dtpService) {
                // 列表数据源
                //$scope.source = {
                //    crtDate: new Date(),
                //    result: []
                //};
                $scope.source = dtpService.getInitSource();
                dtpService.setPreviousMonth();
                dtpService.setPreviousMonth();
                dtpService.setPreviousMonth();
                dtpService.setNextMonth();
                dtpService.setNextMonth();
                dtpService.setNextMonth();
            }]
        }
    }])
    .service('dtpService', [function () {
        var MS_OF_DAY = 24 * 3600 * 1000;
        this.source = {
            today: new Date(),
            crtDate: new Date(),
            result: []
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
                mfirst.setMonth(i);
                mfirst.setDate(1);
                dateObj.date = mfirst;
                var mfirstTime = +mfirst;
                var nfirst = new Date();
                nfirst.setMonth(i + 1);
                nfirst.setDate(1);
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

        this.getInitSource = function () {
            this.source.result = getResultInSource(this.source.crtDate, this.offsetMonth.start, this.offsetMonth.end);
            return this.source;
        };

        this.setPreviousMonth = function (offset) {
            var offset = offset || 3;
            var result = getResultInSource(this.source.crtDate, this.offsetMonth.start + offset, -this.offsetMonth.start - 1);
            console.log(result)
            for (var i = result.length; i >= 0; i--) {
                this.source.result.unshift(result[i]);
            }
            this.offsetMonth.start += offset;
        };
        this.setNextMonth = function (offset) {
            var offset = offset || 3;
            var result = getResultInSource(this.source.crtDate, -this.offsetMonth.end - 1, this.offsetMonth.end + offset);
            for (var i in  result) {
                this.source.result.push(result[i]);
            }
            this.offsetMonth.end += offset;
        }
    }])