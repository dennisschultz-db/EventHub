# EventHub

---

**UPDATE**: Since originally writing this component, Salesforce has introduced the lightning:empApi component which essentially does the same thing but is a method officially supported by Salesforce. (https://developer.salesforce.com/docs/component-library/bundle/lightning:empApi/documentation) I would suggest looking at the empApi component first. I chose not to delete this post because I know there are others that have build applications using EventHub in their applications.

---

Event Hub is a Salesforce Lightning Component that enables Lightning App Pages to establish multiple Platform Event subscriptions using a single CometD client.

Only one CometD client can exist per page.  If you have more than one Lightning Component that subscribes to Platform Events on a page, you may end up with multiple CometD clients.  This generally results in the Chrome Console message

`Exception during handling of messages  Unrecognized advice action handshake`

Examining the network responses for the CometD requests, you will see something that contains **multiple-clients** like

`[{"clientId":"11e12xxbcr6wt3rs6taa4pvpoz","advice":{"interval":2000, "multiple-clients":true,"reconnect":"retry","timeout":110000},"channel":"/meta/connect","id":"8","successful":true}]`

EventHub utilizes a static resource JavaScript library that establishes a singleton controller which ensures only one CometD client is created per page.  All subscriptions from all components on the page are then handled by that one client.

## Installation

Deploy to SFDX using this button:

[![Deploy](https://deploy-to-sfdx.com/dist/assets/images/DeployToSFDX.svg)](https://deploy-to-sfdx.com)

Deploy via unmanaged package using the link https://sfdc.co/EventHubPackage.

## Contents

EventHub consists of the following components:

### Static Resources

* **cometd.js** - CometD JavaScript library
* **eventHub.js** - Singleton controller that manages CometD subscriptions for a Salesforce Lighting App Page

### Apex Classes

* **SessionController.cls** - Retrieves the SessionId from the server.  Necessary to establish CometD connections

### Lighting Components

* **EventHub** - A common, utility component.  Include this component in each Lighting Component that needs to subscribe to Platform Events.
* **SampleEventListener** - An example of how you include EventHub into your components and invoke the Subscribe method in their controllers.

## Usage

1. Add the EventHub component to your Lighting Component

    ```html
    <c:EventHub aura:id='myHub'/>
    ```
2. Add an init handler to your Lightning Component

    ```html
    <aura:handler name="init" value="{!this}" action="{!c.onInit}"/>
    ```
3. Create an event handler callback in your component's Helper

   ```javascript
   onTestEvent : function(component, platformEvent) {
        ...
    }
    ```
    
4. Call the EventHub.subscribe method in your component's JavaScript controller onInit, passing in a reference to your component, the name of the platform event you are subscribing to, and the Helper callback.

    ```javascript
    var myEventHub = component.find('SampleEventListenerHub');
           
    myEventHub.subscribe(
        component, 
        'TestEvent__e', 
        $A.getCallback(function(component, platformEvent) {
                    helper.onTestEvent(component, platformEvent);
        })
    );
    ```
    
    IMPORTANT:  Use the exact syntax provided here to avoid problems with scope and problems with asynchronous actions in the callback.

## Licensing

All code is provided as-is with no warranty.
