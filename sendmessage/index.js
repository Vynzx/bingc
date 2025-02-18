const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient();

export const handler = async function (event, context) {
  let connections;
  try{
    connections = await ddb.scan({ TableName: "chat" }).promise();
  }catch(err){
    return {
      statusCode: 500,
      body: "Failed to connect: " + JSON.stringify(err)
    }
  }

  const callbackApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint:
      event.requestContext.domainName + '/' + event.requestContext.stage
  });

  const message = JSON.parse(event.body).message;
  const sendMessages = connections.Items.map(async ({ connectionid }) => {
    try {
      await callbackApi
        .postToConnection({ ConnectionId: connectionid, Data: message })
        .promise();
    } catch (err) {
      console.log(err);
    }
  });
  try {
    await Promise.all(sendMessage);
  }
  catch(err) {
    return {
      statusCode: 500,
      body: "Failed to send message: " + JSON.stringify(err),
    };
  }
  return {
    statusCode: 200,
  };
};