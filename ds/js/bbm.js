//BBM
var dsUID = "40bfdec1-1ebf-4b17-b823-d45554bc349a";

/**
* Copyright (c) 2012 Research In Motion Limited.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
*
* You may obtain a copy of the License at:
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/*global window, document, console, alert, blackberry */

/* This file holds the majority of the functionality for integration with
* BlackBerry Messenger.
*/

var _bbm = {
    registered: false,
    getDisplayPicture: function (bbmCallBack) {
        if (_bbm.registered === true) {
            blackberry.bbm.platform.self.getDisplayPicture(bbmCallBack);
        }
    },
    /* This will be called when the user clicks the 'set' button for
    * status or personal message.
    */
    setField: function (field, message) {
        'use strict';
        var status, onComplete;
        if (_bbm.registered === true) {
            if (field === 'status') {
                /* Assign the status for this update. */
                //            if (document.querySelector('#status').getChecked() === true) {
                //                status = 'available';
                //            } else {
                //                status = 'busy';
                //            }

                /* Assign the status message for this update. */
                // message = document.querySelector('#statusMessage').value;

                /* Assign the onComplete function for this update. */
                onComplete = function (accepted) {
                    if (accepted === true) {
                        alert('Status update was accepted.');
                    } else {
                        alert('Status update was not accepted.');
                    }
                };

                /* Call setStatus with our defined arguments. */
                blackberry.bbm.platform.self.setStatus(status, message, onComplete);
            } else if (field === 'personalMessage') {
                /* Assign the personal message for this update. */
                //  message = document.querySelector('#personalMessage').value;

                /* Assign the onComplete function for this update. */
                onComplete = function (accepted) {
                    if (accepted === true) {
                        alert('Status update was accepted.');
                    } else {
                        alert('Status update was not accepted.');
                    }
                };

                /* Call setPersonalMessage with our defined arguments. */
                blackberry.bbm.platform.self.setPersonalMessage(message, onComplete);
            }
        }
    },

    fieldChanged: function (element) {
        'use strict';

        /* Reset all of our fields to invisible. */
        document.querySelector('#_status').style.display = 'none';
        document.querySelector('#_personalMessage').style.display = 'none';
        document.querySelector('#_ppid').style.display = 'none';
        document.querySelector('#_handle').style.display = 'none';
        document.querySelector('#_appVersion').style.display = 'none';
        document.querySelector('#_bbmsdkVersion').style.display = 'none';

        /* Show the chosen field. */
        document.querySelector("#_" + element.value).style.display = 'inline';
    },
    setPersonalMessage: function (msg) {
        blackberry.bbm.platform.self.setPersonalMessage(msg, function (accepted) {

        });
    },
    populate: function () {
        'use strict';

        /* Only allow functionality if we've registered with BBM. */
        if (_bbm.registered === true) {
            /* Set the Display Name from the BBM profile. */
            document.querySelector('#displayName').innerHTML = blackberry.bbm.platform.self.displayName;

            /* Set the Status from the BBM profile. */
            if (blackberry.bbm.platform.self.status === 'available') {
                document.querySelector('#status').setChecked(true);
            } else {
                document.querySelector('#status').setChecked(false);
            }

            /* The remaining fields are direct assignments. */
            document.querySelector('#statusMessage').value = blackberry.bbm.platform.self.statusMessage;
            document.querySelector('#personalMessage').value = blackberry.bbm.platform.self.personalMessage;
            document.querySelector('#ppid').innerHTML = blackberry.bbm.platform.self.ppid;
            document.querySelector('#handle').innerHTML = blackberry.bbm.platform.self.handle;
            document.querySelector('#appVersion').innerHTML = blackberry.bbm.platform.self.appVersion;
            document.querySelector('#bbmsdkVersion').innerHTML = blackberry.bbm.platform.self.bbmsdkVersion;
        } else {
            alert('You must register with BBM first.');
        }
    },

    /* Will be called when the user clicks the Register button. */

    register: function () {
        blackberry.event.addEventListener('onaccesschanged', function (accessible, status) {
            if (status === 'unregistered') {
                blackberry.bbm.platform.register({
                    uuid: dsUID
                });
                _bbm.registered = true;
            } else if (status === 'allowed') {
                _bbm.registered = accessible;
            }
        }, false);
    },


    invite: function () {
        'use strict';

        /* Only allow functionality if we've registered with BBM. */
        if (_bbm.registered === true) {
            blackberry.bbm.platform.users.inviteToDownload();
        } else {
            alert('You must register with BBM first.');
        }
    }
};





//blackberry.bbm.platform.onaccesschanged = function (accessible, status) {
//    alert('sdv');
//    if (status == "allowed") {
//        blackberry.bbm.platform.showBBMAppOptions(function () {
//            // User exited the BBM options screen
//        });
//    } else if (status == "user") {
//        blackberry.bbm.platform.showBBMAppOptions(function () {
//            // User exited the BBM options screen
//        });
//    } else if (status == "rim") {
//        // Access blocked by RIM
//    }
//    // Listen for other status...
//};

//// Register with the platform
//blackberry.bbm.platform.register({
//    uuid: dsUID // Randomly generated UUID
//});

