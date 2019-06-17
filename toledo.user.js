// ==UserScript==
// @name         Toledo Bullshit Fixer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Get rid of most of the annoying useless prompts on toledo.
// @author       L0laapk3
// @match        *://p.cygnus.cc.kuleuven.be/webapps/blackboard/*
// @match        *://webwsp.aps.kuleuven.be/sap/bc/ui2/flp*
// @match        *://idp.kuleuven.be/idp/profile/SAML2/POST/SSO*
// @match        *://idp.kuleuven.be/idp/profile/SAML2/Redirect/SSO*
// @updateURL    https://cdn.jsdelivr.net/gh/L0laapk3/Toledo-Bullshit-Fixer/toledo.user.js
// @downloadURL  https://cdn.jsdelivr.net/gh/L0laapk3/Toledo-Bullshit-Fixer/toledo.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // isp login page refresh fixer
    if (document.location.href.includes("webwsp.aps.kuleuven.be/sap/bc/ui2/flp")) {
         if (document.getElementById("LOGIN_PAGE") && !(new Date().getTime() - 60000 < parseInt(localStorage.lastRefresh))) {
             localStorage.lastRefresh = new Date().getTime();
             document.location.reload();
         }
    }


    // kak terug pagina fixer
    if (document.location.href.includes("idp.kuleuven.be/idp/profile/SAML2/POST/SSO") || document.location.href.includes("idp.kuleuven.be/idp/profile/SAML2/Redirect/SSO")) {
        setInterval(_ => {
            if (document.querySelector("#box-content .alert").innerText.includes('Je krijgt deze pagina te zien omdat je gebruik hebt gemaakt van de "Terug"-knop tijdens het surfen binnen de afgeschermde toepassing')
             || document.querySelector("#box-content .alert").innerText.includes('You may be seeing this page because you used the Back button while browsing a secure web site or application'))
                document.location.href = "https://toledo.kuleuven.be/portal/#/home";
        }, 50);
    }


    if (document.location.href.includes("p.cygnus.cc.kuleuven.be/webapps/blackboard"))
        delay();
    function delay() {
        if (!document.getElementById("contentPanel") || document.getElementById("contentPanel").className.includes("noDelay"))
            return setTimeout(delay, 50);

        // fix for all the dumb collapsed panels
        if (document.location.href.includes("p.cygnus.cc.kuleuven.be/webapps/blackboard/content/listContent.jsp")) {
            for (let item of document.querySelectorAll("#content_listContainer > li")) {
                if (item.className.includes("expandedItem"))
                    continue;
                item.className += " expandedItem";
                item.onmousedown = e => {
                    item.className = item.className.replace("expandedItem", "");
                    item.onmousedown = undefined;
                    var evt = document.createEvent("MouseEvents");
                    evt.initEvent("click", true, true);
                    item.querySelector(".expandThisItem").dispatchEvent(evt);

                };
            }
        }


        // fix for bad ECTS link middle click
        if (document.location.href.includes("p.cygnus.cc.kuleuven.be/webapps/blackboard")) {
            let courseID = document.location.href.match(/course_id=[^&]+(?=&|$)/i);
            if (courseID)
                for (let a of document.querySelectorAll("a[href*='webapps/tol-ECTS']"))
                    a.href += "&" + courseID[0];
        }


    }






})();