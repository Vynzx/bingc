const AWS = require("aws-sdk");

export const handler = async (event, context) => {
  let connectionInfo
  let connectionId = event.requireContext.connectionId;

  const callbackAPI = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: event.requestContext.domainName + "/" + event.requestContext.stage,
  });

  try{
    connectionInfo = await callbackAPI
      .getConnection({ ConnectionId: event.requestContext.connectionId }).promise();
  }
  catch(e) {
    console.log(e);
  }
  connectionInfo.connectionId = connectionId;

  await callbackAPI.postToConnection({
    ConnectionId: event.requestContext.connectionId,
      Data:
        "Gunakan format sendmessage. Infonya adalah: " +
        JSON.stringify(connectionInfo),
  }).promise();

  return {
    statusCode: 200,
  };
};
