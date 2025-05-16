// This file is placed in /public so it is served as a static asset and can be loaded by a <script> tag
(function() {
  const connectionString = "InstrumentationKey=1eba8cdd-ed51-4372-ae3c-f94afa86e915;IngestionEndpoint=https://centralus-2.in.applicationinsights.azure.com/;LiveEndpoint=https://centralus.livediagnostics.monitor.azure.com/;ApplicationId=fa83337a-8367-4bb3-a73c-4e1273c78c24";
  if (!connectionString) {
    console.warn("Application Insights connection string is not defined.");
    return;
  }
  const script = document.createElement('script');
  script.src = "https://js.monitor.azure.com/scripts/b/ai.3.min.js";
  script.onload = function() {
    if (window.Microsoft && window.Microsoft.ApplicationInsights) {
      var appInsights = new window.Microsoft.ApplicationInsights.ApplicationInsights({
        config: {
          connectionString: connectionString
        }
      });
      appInsights.loadAppInsights();
      appInsights.trackPageView();
      window.appInsights = appInsights;
    } else {
      console.warn("Application Insights SDK did not load.");
    }
  };
  document.head.appendChild(script);
})();
