({
    utilityMethod : function(component, message) {
        // Do some shared function here...
    },
    
    // Callback function invoked when the Platform Event
    // is published.
	onTestEvent : function(component, platformEvent) {
        
        // Scope management
        var helper = this;

        // An example of calling an Apex server-side action       
        var action = component.get("c.getSomeData");
        action.setCallback(this, function(response) {
            
            // The event's fields are returned in the data.payload
            // object.  This is an example of retrieving the Message field value.
            var eventFieldData = platformEvent.data.payload.Message__c;
            
            // Use the helper scope to call shared methods.
        	helper.utilityMethod(component, eventFieldData);
        });
        
        $A.enqueueAction(action);
 
	}

})