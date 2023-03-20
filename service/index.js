const { onStart, onSendingMsgError } = require("/service/log");

onStart();
onSendingMsgError(error, msg);
