// User will copy this script and paste it in their google form's script editor 

export const generateGoogleFormScript = (
  webhookUrl: string,
) => `function onFormSubmit(e) {
  const lock = LockService.getScriptLock() ;
  if(!lock.tryLock(0)){ 
    console.log("Duplicate trigger detected, skipping.");
    return ;
  }

  var formResponse = e.response;
  var itemResponses = formResponse.getItemResponses();

  // Build responses object
  var responses = {};
  for (var i = 0; i < itemResponses.length; i++) {
    var itemResponse = itemResponses[i];
    responses[itemResponse.getItem().getTitle()] = itemResponse.getResponse();
  }

  // Prepare webhook payload
  var payload = {
    formId: e.source.getId(),
    formTitle: e.source.getTitle(),
    responseId: formResponse.getId(),
    timestamp: formResponse.getTimestamp(),
    respondentEmail: formResponse.getRespondentEmail(),
    responses: responses
  };

  // Send to webhook
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload)
  };

  var WEBHOOK_URL = 'https://overforwardly-sallowy-cammie.ngrok-free.dev/api/webhooks/google-form?workflowId=cml3i3cfw0001vnfg2qu9px2l';

  try {
    UrlFetchApp.fetch(WEBHOOK_URL, options);
  } catch(error) {
    console.error('Webhook failed:', error);
  }
  finally{
    lock.releaseLock() ;
  }
}`;