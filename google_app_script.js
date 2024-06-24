function doPost(e) {
  var requestData = JSON.parse(e.postData.contents);
  var presentationId = requestData.presentationId;  // The ID of the original presentation to duplicate and update
  var updates = requestData.updates;  // List of [object_id, content] pairs

  // var presentationId = '1_gbKNfnl_nLsK2LDgQ1fcZyOWq0SWUeMI58kof95M6c';  // The ID of the original presentation to duplicate and update
  // var updates = [['g2984c696a3b_0_803', 'company name updated']];  // List of [object_id, content] pairs  

  // Retrieve or create the 'slides' folder
  var slidesFolder = getFolderByName('slides');

  // Use DriveApp to duplicate the presentation
  var originalFile = DriveApp.getFileById(presentationId);
  var copiedFile = originalFile.makeCopy("Copy of " + originalFile.getName(), slidesFolder);
  var newPresentationId = copiedFile.getId();

  // Open the new presentation with SlidesApp
  var newPresentation = SlidesApp.openById(newPresentationId);

  // Apply updates to the new presentation
  var slides = newPresentation.getSlides();
  updates.forEach(function(update) {
    var objectId = update[0];
    var content = update[1];
    updateObject(slides, objectId, content);
  });

  // Save changes to the new presentation
  newPresentation.saveAndClose();

  // Export the new presentation to PDF
  var pdfFile = exportToPDF(newPresentationId, slidesFolder);

  // Create a public URL for the PDF file
  var pdfUrl = createShareableLink(pdfFile);

  return ContentService.createTextOutput(pdfUrl)
                       .setMimeType(ContentService.MimeType.TEXT);
}

function getFolderByName(folderName) {
  var folders = DriveApp.getFoldersByName(folderName);
  var folder;
  if (folders.hasNext()) {
    folder = folders.next();
  } else {
    folder = DriveApp.createFolder(folderName);
  }
  return folder;
}

function updateObject(slides, objectId, content) {
  slides.forEach(function(slide) {
    var pageElements = slide.getPageElements();
    pageElements.forEach(function(element) {
      if (element.getObjectId() === objectId) {
        if (isValidHttpUrl(content)) {
          if (element.getPageElementType() === SlidesApp.PageElementType.IMAGE) {
            var image = element.asImage();
            image.replace(content);
          }
        } else {
          if (element.getPageElementType() === SlidesApp.PageElementType.SHAPE) {
            var shape = element.asShape();
            shape.getText().setText(content);
          }
        }
      }
    });
  });
}

function exportToPDF(presentationId, folder) {
  var presentation = DriveApp.getFileById(presentationId);
  var pdfBlob = presentation.getAs('application/pdf');
  var pdfFile = folder.createFile(pdfBlob);
  pdfFile.setName(presentation.getName() + ".pdf");
  return pdfFile;
}

function createShareableLink(file) {
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}

function isValidHttpUrl(string) {
  var regex = /^(https?:\/\/)/; // This regex checks if the string starts with "http://" or "https://"
  return regex.test(string);
}
