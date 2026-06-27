export function getScalarUI(specUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CareerBridge API - Documentation</title>
    <meta name="description" content="Interactive API documentation for CareerBridge" />
  </head>
  <body>
    <script
      id="api-reference"
      data-url="${specUrl}"
      data-configuration='${JSON.stringify({
        theme: "kepler",
        layout: "modern",
        hideDownloadButton: false,
        metaData: {
          title: "CareerBridge API",
          description: "Complete REST API documentation for CareerBridge.",
        },
      })}'
    ></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>`;
}
