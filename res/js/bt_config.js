"use strict";

    /* =====================================================================================================================
     *  Binary tactics: Configuration
     * ================================================================================================================== */



// Configuration namespace
// ---------------------------------------------------------------------------------------------------------------------

// Holds root path of URL where application is deployed
bt.config.urls = {
    clientUrl :     '/battle/static/btjs2/',
    servicesUrl :   '/battle/'
}

// Set poling
bt.config.poling.minimalIntervalBetweenPolls = 2000;

// Set debugging options
bt.debugging.events.publishToConsole = false;
bt.debugging.model.verifyModelConstructors = true;
