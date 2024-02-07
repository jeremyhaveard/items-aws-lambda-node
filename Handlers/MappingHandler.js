//import ItemFromDynamoDB from '../Objects/ItemFromDynamoDB.js'
const ItemFromDynamoDB = require('../Objects/ItemFromDynamoDB')

function mapDynamoDBItem (items)
{
    let dynamoItems = [];

    items.forEach(item => {

        let dynamoItem = new ItemFromDynamoDB(item.id, item.itemid, item.type, item.value)

            console.log('DynamoDBItem= ' + dynamoItem.id + ' - ' +  item.itemid + ' - ' + item.type + ' - ' + item.value);

        dynamoItems.push(dynamoItem);

            console.log('dynamoItems length= ' + dynamoItems.length);

    });

    return dynamoItems;

}

module.exports = mapDynamoDBItem

