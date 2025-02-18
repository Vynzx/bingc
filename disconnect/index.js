const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient();

export const handler = async (event, context) => {
  await ddb.delete({
    TableName: "chat",
    Key: {
      connectionId: event.requestContext.connectionId
    }
  }).promise();
  return {
    statusCode: 200,
    body: "Disconnected."
  };
};
