// Singleton controller that manages CometD subscriptions for a
// Salesforce Lighting App Page
window.eventHub = (function () {

    // Local variables
    var cometd = null;
    var subscriptions = [];
    var debug = false;


    return {

        // Enables debug logging in browser console
        setDebug: function (on) {
            debug = on;
        },

        // Initialize CometD (if required) and subscribe to an event
        subscribe: function (sessionId, parentComponent, eventName, callback) {

            // Only the first component should initialize CometD
            if (!cometd) {

                // Construct CometD.
                cometd = new org.cometd.CometD();

                // Configure CometD.
                var cometdUrl = window.location.protocol + '//' + window.location.hostname + '/cometd/41.0/';
                cometd.configure({
                    url: cometdUrl,
                    requestHeaders: {
                        Authorization: 'OAuth ' + sessionId
                    },
                    appendMessageTypeToURL: false
                });

                // Disable Websockets
                cometd.websocketEnabled = false;

                // Establish CometD connection
                cometd.handshake(function (handshakeReply) {
                    if (handshakeReply.successful) {
                        console.log('CometD has been initialized');
                    } else
                        console.error('Failed to connected to CometD.');
                });
            }

            // Subscribe to platform event
            var newSubscription = cometd.subscribe('/event/' + eventName,
                function (platformEvent) {
                    if (debug) {
                        console.log('Platform event received: ' + JSON.stringify(platformEvent));
                    }
                    callback(parentComponent, platformEvent);
                }
            );

            // Save subscription for later
            subscriptions.push(newSubscription);

        }

    }

}());