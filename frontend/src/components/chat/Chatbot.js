import React, { useEffect } from 'react';

export default function Chatbot(props) {
  useEffect((() => {
    (function(d, m){
      var kommunicateSettings = {
        "appId":"cd40e2ea8c553cb40b92422863201a17",
        "popupWidget":true,
        "automaticChatOpenOnNavigation":true,
        // "OnInit": function() {
        //   var css = ".chat-popup-widget-container{background-color: blue!important;}"
        //   Kommunicate.customizeWidgetCss(css);
        // },
      };

      let s = document.createElement("script");     
      s.type = "text/javascript"; 
      s.async = true;
      s.src = "https://widget.kommunicate.io/v2/kommunicate.app";

      let h = document.getElementsByTagName("head")[0]; 
      h.appendChild(s);

      window.kommunicate = m; 
      m._globals = kommunicateSettings;
    })(document, window.kommunicate || {});

  }), []);

  return (
    <div></div>
  );
}