## Generate PDF from Google Slides

### How to

1.	Create a report template in Google Slides.
2.	Identify the object_id and prepare the content you wish to insert:
    * The content can be textual.
    * The content can include images (e.g., images of tables).
3.	Utilize the Google Apps Script API to update your content in the slides.

### Google Apps Script

1.	Insert the `google_app_script.js` into your [Google Apps](https://script.google.com/home) environment and deploy it.
2.	Once deployed, Google will provide you with an API endpoint. Use this endpoint to upload your content to your slides. The script includes functionality to generate a PDF, so this API will return a link to download the PDF.
