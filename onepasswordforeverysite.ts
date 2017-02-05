/**
 * Created by Tim van Steenbergen on 21-1-2017.
 */

declare function SHA512(string): string;
document.addEventListener('DOMContentLoaded', function () {
    // importScripts("SHA512.js");

    let sites = [];
    let json = {
        "sites": [
            ["gavelsnipe.com", "koud", "timvans", "1"],
            ["webassessor.com", "koud", "TimvanSteenbergen", "2"],
            ["stackoverflow.com", "koud", "tim@tieka.nl", "1"],
            ["quora.com", "koud", "tim@tieka.nl", "1"],
            ["ebay.com", "heet", "tivansteenberge_0", "3"],
            ["nrc.nl", "koud", "iliketoread", "1"],
            ["yetanothersite.nl", "koud", "alias24", "1"],
            ["andonemore.nl", "koud", "myusernamehere", "1"]
        ]
    };
    localStorage.setItem("sites", JSON.stringify(json));
    setValueForElementDomain();
    showTheLocallyStoredData(5);
    function setValueForElementDomain() {
        chrome.tabs.getSelected(null, function (tab) {
            let ourPopup = document;
            let domain = getDomain(tab.url);
            let domainElement = ourPopup.getElementById('domain');
            domainElement.setAttribute('value', domain);

            setValueForElements(domain);

            function getDomain(url)
            //This function gets the domainname from the url.
            //Can't use "window.location.host" because this will return the domain of the popup.html
            {
                domain = url.match(/:\/\/(.[^/]+)/)[1];
                //remove the sub-domain(s)
                let numberOfDotsInDomain = (domain.match(/\./g) || []).length;
                for (let dot = 1; dot < numberOfDotsInDomain; dot++) {
                    domain = domain.substr(domain.indexOf('.') + 1, domain.strlen);
                }
                return domain;
            }

            function setValueForElements(domain) {
                json = JSON.parse(localStorage.getItem("sites"));
                sites = json.sites;
                for (let i = 0; i < sites.length; i++) {
                    if (sites[i][0] == domain) {
                        document.getElementById('domain').setAttribute('disabled', "disabled");
                        if (sites[i][1] != "") {
                            document.getElementById('mySaltThisSite').setAttribute('value', sites[i][1]);
                            document.getElementById('mySaltThisSite').setAttribute('disabled', "disabled");
                        }
                        if (sites[i][2] != "") {
                            document.getElementById('myUidThisSite').setAttribute('value', sites[i][2]);
                            document.getElementById('myUidThisSite').setAttribute('disabled', "disabled");
                        }
                        if (sites[i][3] != "") {
                            document.getElementById('mySequenceThisSite').setAttribute('value', sites[i][3]);
                            document.getElementById('mySequenceThisSite').setAttribute('disabled', "disabled");
                        }
                    }
                }
            }

        });
    }

    function showTheLocallyStoredData(numOfLines) {
        json = JSON.parse(localStorage.getItem("sites"));
        sites = json.sites;
        let dataTableHTML = "<table id='locallyStoredUserData'><thead><td>domain</td><td>salt</td><td>userid</td><td>seq.nr</td><td>remark</td></thead>";
        for (let i = 0; i < sites.length && i < numOfLines; i++) {
            dataTableHTML += '<tr><td>' + sites[i][0] + '</td>';
            dataTableHTML += '<td>' + sites[i][1] + '</td>';
            dataTableHTML += '<td>' + sites[i][2] + '</td>';
            dataTableHTML += '<td>' + sites[i][3] + '</td>';
            dataTableHTML += '<td>' + '</td></tr>';
        }
        if (sites.length > numOfLines) {
            document.getElementById('showAllTheLocallyStoredData').setAttribute('style', "display: inline");
        } else {
            document.getElementById('showAllTheLocallyStoredData').setAttribute('style', "display: none");
        }
        dataTableHTML += '</table>';
        document.getElementById('locallyStoredUserData').innerHTML = dataTableHTML;
    }

    showAllTheLocallyStoredData.addEventListener('click', function () {
        showTheLocallyStoredData(100000);
    });

    domainToggle.addEventListener('click', function () {
        let elementId = this.id.substr(0, this.id.length - 6);
        let elementToToggle = document.getElementById(elementId);
        if (elementToToggle.hasAttribute('disabled')) {
            elementToToggle.removeAttribute('disabled');
        } else {
            elementToToggle.setAttribute("disabled", "disabled");
        }
    });
    mySaltThisSiteToggle.addEventListener('click', function () {
        let elementId = this.id.substr(0, this.id.length - 6);
        let elementToToggle = document.getElementById(elementId);
        if (elementToToggle.hasAttribute('disabled')) {
            elementToToggle.removeAttribute('disabled');
        } else {
            elementToToggle.setAttribute("disabled", "disabled");
        }
    });
    myUidThisSiteToggle.addEventListener('click', function () {
        let elementId = this.id.substr(0, this.id.length - 6);
        let elementToToggle = document.getElementById(elementId);
        if (elementToToggle.hasAttribute('disabled')) {
            elementToToggle.removeAttribute('disabled');
        } else {
            elementToToggle.setAttribute("disabled", "disabled");
        }
    });
    mySequenceThisSiteToggle.addEventListener('click', function () {
        let elementId = this.id.substr(0, this.id.length - 6);
        let elementToToggle = document.getElementById(elementId);
        if (elementToToggle.hasAttribute('disabled')) {
            elementToToggle.removeAttribute('disabled');
        } else {
            elementToToggle.setAttribute("disabled", "disabled");
        }
    });
    myOnlyPasswordShow.addEventListener('click', function () {
        let elementId = this.id.substr(0, this.id.length - 4);
        let elementToToggle = document.getElementById(elementId);
        elementToToggle.setAttribute('type', 'text');
        document.getElementById('myOnlyPasswordShow').setAttribute('disabled', 'DISABLED');
        document.getElementById('myOnlyPasswordHide').removeAttribute('disabled');
    });
    myOnlyPasswordHide.addEventListener('click', function () {
        let elementToToggle = document.getElementById(this.id.substr(0, this.id.length - 4));
        elementToToggle.setAttribute('type', 'password');
        document.getElementById('myOnlyPasswordShow').removeAttribute('disabled');
        document.getElementById('myOnlyPasswordHide').setAttribute('disabled', 'DISABLED');
    });

    /*
     * Upon clicking the loginButton, generate the password for this site, salt, uid, sequence and given password.
     */
    loginButton.addEventListener('click', function () {
        let ourPopup = document;
        let domain = ourPopup.getElementById('domain').value;
        let mySaltThisSite = ourPopup.getElementById('mySaltThisSite').value;//alert('mySaltThisSite: ' + mySaltThisSite);
        let myUidThisSite = ourPopup.getElementById('myUidThisSite').value;//alert('myUidThisSite:' + myUidThisSite);
        let mySequenceThisSite = ourPopup.getElementById('mySequenceThisSite').value;//alert('mySequenceThisSite:' + mySequenceThisSite);
        let myOnlyPassword = ourPopup.getElementById('myOnlyPassword').value;//alert('myOnlyPassword:' + myOnlyPassword);
        let pwdForThisSiteForThisUid = getPwdForThisSiteForThisUid(domain, mySaltThisSite, myUidThisSite, mySequenceThisSite, myOnlyPassword);
        // alert('pwdForThisSiteForThisUid: ' + pwdForThisSiteForThisUid);
        let passwordElement = ourPopup.getElementById('pwdForThisSiteForThisUid');
        passwordElement.setAttribute("value", pwdForThisSiteForThisUid);
        //// insertPwd(pwdForThisSiteForThisUid, passwordElement);

        function getPwdForThisSiteForThisUid(domain, saltThisSite, uidThisSite, sequenceNr, pwdUser) {

            //get the SHA512
            let generatedPassword = SHA512(domain + saltThisSite + uidThisSite + sequenceNr + pwdUser);

            //add two literals
            //TODO make this more obscure
            generatedPassword = generatedPassword.substr(0, 4) + '!' + generatedPassword.substr(4, 3) + '.' + generatedPassword.substr(8);

            //add one capital
            for (let i = 0; i < 12; i++) {
               let char = generatedPassword[i];
                if (char >= 'a' && char <= 'z') {
                    generatedPassword = generatedPassword.substr(0, i) + char.toUpperCase() + generatedPassword.substr(i + 1);
                    break;
                } else if (i = 12) {
                    generatedPassword = 'Z' + generatedPassword.substr(1);
                }
            }

            //Shorten it to 20 characters
            generatedPassword = generatedPassword.substr(0, 20);

            return generatedPassword;
        }
    }, false);
}, false);
