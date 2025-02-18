const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient();

export const handler = async (event, context) => {
  try {
    await ddb.put({
      TableName: "chat",
      Item: {
        connectionId: event.requestContext.connectionId,
      },
    }).promise();
  }
  catch(err){
    console.log(err);
  }
};
