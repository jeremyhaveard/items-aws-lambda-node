/*

exports.handler = async (event) => {
    // TODO implement
    return 'Hello from Lambda';
  };

*/

const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");

const dynamoDbClient = new DynamoDBClient({ region: "us-east-1" });

exports.handler = async (event, context) => {
  try {
    // Parameters for the DynamoDB scan
    const params = {
      TableName: 'Item',
      FilterExpression: 'attribute_exists(itemid)',
    };

    // Create a command for the scan
    const scanCommand = new ScanCommand(params);

    // Execute the scan
    const result = await dynamoDbClient.send(scanCommand);

    // Process the result (you can customize this part based on your requirements)
    const items = result.Items;
    console.log('Retrieved items:', items);

    // Return the items or perform further processing
    return {
      statusCode: 200,
      body: JSON.stringify(items)
    };
  } catch (error) {
    console.error('Error retrieving items:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};