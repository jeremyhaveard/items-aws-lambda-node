const { handler } = require('./index');
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { ScanCommand, PutItemCommand, UpdateItemCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const ItemFromDynamoDB = require('./Objects/ItemFromDynamoDB');
const mapDynamoDBItem = require('./Handlers/MappingHandler');

jest.mock("@aws-sdk/client-dynamodb", () => {
    const mockDynamoDBClient = {
        send: jest.fn()
    };

    return {
        DynamoDBClient: jest.fn(() => mockDynamoDBClient),
        ScanCommand: jest.fn(),
        PutItemCommand: jest.fn(),
        UpdateItemCommand: jest.fn(),
        DeleteItemCommand: jest.fn()
    };
});

describe('index.js Unit Tests', () => {
    let mockEvent;
    let mockContext;

    beforeEach(() => {
        jest.clearAllMocks();
        mockEvent = {};
        mockContext = {};
    });

    test('GET method should return items from DynamoDB', async () => {
        mockEvent = { httpMethod: 'GET' };

        const mockItems = [
            { id: 1, itemid: 'item_1', type: 'type_1', value: 'value_1' },
            { id: 2, itemid: 'item_2', type: 'type_2', value: 'value_2' }
        ];

        //DynamoDBClient.prototype.send.mockResolvedValueOnce({ Items: mockItems });

        const response = await handler(mockEvent, mockContext);

        //expect(response.statusCode).toBe(200);
        //expect(JSON.parse(response.body)).toEqual(mockItems.map(item => new ItemFromDynamoDB(item.id, item.itemid, item.type, item.value)));
    });

    test('POST method should add item to DynamoDB', async () => {
        mockEvent = {
            httpMethod: 'POST',
            body: JSON.stringify({ id: 1, itemid: 'item_1', type: 'type_1', value: 'value_1' })
        };

        const response = await handler(mockEvent, mockContext);

        expect(response.statusCode).toBe(201);
        expect(response.body).toBe(JSON.stringify('Item added successfully'));
    });

    test('PUT method should update item in DynamoDB', async () => {
        mockEvent = {
            httpMethod: 'PUT',
            body: JSON.stringify({ itemid: 'item_1', value: 'new_value' })
        };

        const response = await handler(mockEvent, mockContext);

        expect(response.statusCode).toBe(200);
        expect(response.body).toBe(JSON.stringify('Item value updated successfully'));
    });

    test('DELETE method should delete item from DynamoDB', async () => {
        mockEvent = {
            httpMethod: 'DELETE',
            body: JSON.stringify({ itemid: 'item_1' })
        };

        const response = await handler(mockEvent, mockContext);

        expect(response.statusCode).toBe(200);
        expect(response.body).toBe(JSON.stringify('Item deleted successfully'));
    });

    test('Unsupported HTTP method should return 400 status code', async () => {
        mockEvent = { httpMethod: 'INVALID' };

        const response = await handler(mockEvent, mockContext);

        expect(response.statusCode).toBe(400);
        expect(response.body).toBe(JSON.stringify('Unsupported HTTP method'));
    });

    test('Error should return 500 status code', async () => {
        mockEvent = { httpMethod: 'GET' };
        //DynamoDBClient.prototype.send.mockRejectedValue(new Error('Test Error'));

        const response = await handler(mockEvent, mockContext);

        expect(response.statusCode).toBe(500);
        expect(response.body).toBe(JSON.stringify({ error: 'Internal Server Error' }));
    });
});