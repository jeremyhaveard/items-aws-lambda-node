
const mapDynamoDBItem = require('./Handlers/MappingHandler')

let items = [
    {
        "id": 1,
        "itemid": "7ffe6d03-6379-46ee-9844-ff4aceb0c621",
        "type": "SampleType",
        "Value": "Sample Value"
    },
    {
        "id": 2,
        "itemid": "f9a664b6-ab23-4746-a758-d4af71272ac8",
        "type": "SampleType",
        "Value": "Another Sample Value"
    },
    ]

const itemsReturned = mapDynamoDBItem(items);

console.log('itemsReturned length= ' + itemsReturned.length);
itemsReturned.forEach(itemReturned => {
        console.log('itemReturned= ' + itemReturned.id + ' - ' +  itemReturned.itemid + ' - ' + itemReturned.type + ' - ' + itemReturned.value);
    }

)

test('Testing first id of mapped array', ()=> {
 expect(itemsReturned[0].id).toBe(1)
})
