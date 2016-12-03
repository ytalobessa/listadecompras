angular.module('app.shared.services.toast')
.factory('$toast', function($cordovaToast) {
    return {
        showSuccess: function (message) {
             return this.show({ 
                    message: message,
                    duration: 'short',
                    position: 'bottom',
                    styling: {
                        opacity: 0.75, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
                        backgroundColor: '#33cd5f',
                        textColor: '#FFFFFF',
                        textSize: 20.5, // Default is approx. 13.
                        cornerRadius: 16, // minimum is 0 (square). iOS default 20, Android default 100
                        horizontalPadding: 20, // iOS default 16, Android default 50
                        verticalPadding: 16 // iOS default 12, Android default 30
                    }
             });
        },
        showError: function (message) {
             return this.show({ 
                    message: message,
                    duration: 'short',
                    position: 'bottom',
                    styling: {
                        opacity: 0.75, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
                        backgroundColor: '#ef473a', // make sure you use #RRGGBB. Default #333333
                        textColor: '#FFFFFF', // Ditto. Default #FFFFFF
                        textSize: 20.5, // Default is approx. 13.
                        cornerRadius: 16, // minimum is 0 (square). iOS default 20, Android default 100
                        horizontalPadding: 20, // iOS default 16, Android default 50
                        verticalPadding: 16 // iOS default 12, Android default 30
                    }
             });
        },
        show: function (options) {
             return $cordovaToast.showWithOptions(
                  {
                       message: options.message,
                       duration: options.duration,
                       position: 'bottom',
                       styling: options.styling
                  });
        }
    };
});