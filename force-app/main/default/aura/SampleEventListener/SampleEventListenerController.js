({
    onInit : function(component, event, helper) {
        console.log('onInit');
        
        // Retrieve the EventHub control from the component
        // using the name provided in the component
        var myEventHub = component.find('SampleEventListenerHub');
        
        // The arguments to subscribe are:
        //     component - this lightning component.  component will be
        //         passed into the callback so that it has access to 
        //         get/set attributes
        //     eventName - the simple name of the Platform Event to which
        //         you are subscribing. Include the '__e' suffix
        //     callback - the callback routine to be invoked when the 
        //         Platform event occurs.  IMPORTANT:  Use the exact syntax
        //         provided here to avoid problems with scope and problems
        //         with asynchronous actions in the callback.
        myEventHub.subscribe(
            component, 
            'TestEvent__e', 
            $A.getCallback(function(component, platformEvent) {
            	helper.onTestEvent(component, platformEvent);
            })
        );
    },
    })