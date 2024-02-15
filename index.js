const { DynamoDBClient, ScanCommand, PutItemCommand, UpdateItemCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const dynamoDbClient = new DynamoDBClient({ region: "us-east-1" });
const mapDynamoDBItem = require('./Handlers/MappingHandler')

exports.handler = async (event, context) => {
    try {
        const { httpMethod, body } = event;

        console.log('Retrieved method:', httpMethod);
        console.log('Retrieved body:', body);

        if (httpMethod === 'GET') {
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
            console.log('Retrieved items:', result.Items);

            //const itemsFromDB = result.Items.map(item => unmarshall(item));
            const itemsFromDB = mapDynamoDBItem(result.Items)

            return {
                statusCode: 200,
                body: JSON.stringify(itemsFromDB)
            };
        } else if (httpMethod === 'POST') {
            // Add functionality
            const itemToAdd = JSON.parse(body);

            const putParams = {
                TableName: 'Item',
                Item: marshall(itemToAdd),
            };

            const putCommand = new PutItemCommand(putParams);
            await dynamoDbClient.send(putCommand);

            return {
                statusCode: 201,
                body: JSON.stringify('Item added successfully')
            };
        } else if (httpMethod === 'PUT') {
            // Update functionality
            const itemToUpdate = JSON.parse(body);

            const updateParams = {
                TableName: 'Item',
                Key: marshall({ itemid: itemToUpdate.itemid }), // Assuming itemid is the primary key
                UpdateExpression: 'SET #attrName = :attrValue',
                ExpressionAttributeNames: { '#attrName': 'value' }, // Change attribute_to_update to the actual attribute name you want to update
                ExpressionAttributeValues: { ':attrValue': { S: itemToUpdate.value } }, // Change newValue to the new value you want to set
                ReturnValues: 'UPDATED_NEW',
            };

            const updateCommand = new UpdateItemCommand(updateParams);
            await dynamoDbClient.send(updateCommand);

            return {
                statusCode: 200,
                body: JSON.stringify('Item value updated successfully')
            };
        } else if (httpMethod === 'DELETE') {
            // Delete functionality
            const itemToDelete = JSON.parse(body);

            const deleteParams = {
                TableName: 'Item',
                Key: marshall({ itemid: itemToDelete.itemid }), // Assuming itemid is the primary key
            };

            const deleteCommand = new DeleteItemCommand(deleteParams);
            await dynamoDbClient.send(deleteCommand);

            return {
                statusCode: 200,
                body: JSON.stringify('Item deleted successfully')
            };
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify('Unsupported HTTP method')
            };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};
