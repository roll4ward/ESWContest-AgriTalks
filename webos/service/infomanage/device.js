const DEVKIND = 'xyz.rollforward.app.infomanage:2';
const registerDeviceMethod = (service) => {
    // 기기 정보 데이터베이스 생성 (임시)
    service.register('device/createKind', function(message) {
        const kindData = {
            id: DEVKIND,
            owner: 'xyz.rollforward.app.infomanage',
            schema: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    subtype: { type: 'string' },
                    name: {type: 'string'},
                    type: { type: 'string' },
                    desc: { type: 'string' },
                    ip: { type: 'string'},
                    unit: {type: 'string'},
                    areaId: {type: 'string'}

                },
                required: ['subtype', 'name','type', 'ip', 'unit', 'areaId']
            },
            indexes: [
                { name: 'subtype', props: [{ name: 'subtype' }] },
                { name: 'name', props: [{ name: 'name' }] },
                { name: 'ip', props: [{ name: 'ip' }] },
                { name: 'type', props: [{ name: 'type' }] },
                { name: 'areaId', props: [{ name: 'areaId' }] }
            ]
        };
        service.call('luna://com.webos.service.db/putKind', kindData, (response) => {
            if (response.payload.returnValue) {
                message.respond({ returnValue: true});
            } else {
                message.respond({ returnValue: false, results: response.error });
            }
        });
    });
    // 기기 정보 데이터베이스 삭제 (임시)
    service.register('device/deleteKind', function(message) {
        service.call('luna://com.webos.service.db/delKind', {id: DEVKIND}, (response) => {
            if (response.payload.returnValue) {
                message.respond({ returnValue: true });
            } else {
                message.respond({ returnValue: false, results: response.error });
            }
        });
    });
    // 기기 정보 데이터 Create
    service.register('device/create', function(message) {
        const dataToStore = {
            _kind: DEVKIND,
            subtype: message.payload.subtype,
            name: message.payload.name,
            type: message.payload.type,
            desc: message.payload.desc,
            ip: message.payload.ip,
            unit: message.payload.unit,
            areaId: message.payload.areaId
        };

        if (!dataToStore.subtype || !dataToStore.name || !dataToStore.type || !dataToStore.ip || !dataToStore.unit || !dataToStore.areaId) {
            return message.respond({ returnValue: false, results: 'All fields are required.' });
        }

        service.call('luna://com.webos.service.db/put', { objects: [dataToStore] }, (response) => {
            if (response.payload.returnValue) {
                message.respond({ returnValue: true, results: response.payload.results[0].id});
            } else {
                message.respond({ returnValue: false, results: response.error});
            }
        });
    });
    // 기기 정보 데이터 Read
    service.register('device/read', function(message) {
        const query = {
            from: DEVKIND,
            where: []
        };
        
        if (message.payload.id) {
            query.where.push({ prop: '_id', op: '=', val: message.payload.id });
        }

        if (message.payload.ids) {
            message.payload.ids.forEach(element => {
                query.where.push({prop: "_id", op: '=', val: element});
            });
        }

        if (message.payload.subtype) {
            query.where.push({ prop: 'subtype', op: '=', val: message.payload.subtype });
        }

        if (message.payload.name) {
            query.where.push({ prop: 'name', op: '=', val: message.payload.name });
        }

        if (message.payload.areaId) {
            query.where.push({ prop: 'areaId', op: '=', val: message.payload.areaId });
        }

        if (message.payload.select) {
            query.select = message.payload.select;
        }
        
        service.call('luna://com.webos.service.db/find', { query: query }, (response) => {
            if (response.payload.returnValue) {
                message.respond({ returnValue: true, results: response.payload.results });
            } else {
                message.respond({ returnValue: false, results: response.error });
            }
        });
    });

    service.register('device/read/ids', function(message) {
        if (!message.payload.ids) {
            message.respond({ returnValue: false, results: "ids are required" });
            return;
        }

        const query = {
            ids: message.payload.ids
        };
        

        service.call('luna://com.webos.service.db/get', query, (response) => {
            if (response.payload.returnValue) {
                message.respond({ returnValue: true, results: response.payload.results });
            } else {
                message.respond({ returnValue: false, results: response.error });
            }
        });
    });

    // 기기 정보 데이터 Update
    service.register('device/update', function(message) {
        const updatedItem = {
            _id: message.payload.id,
            _kind: DEVKIND
        };

        if (message.payload.subtype) updatedItem.subtype = message.payload.subtype;
        if (message.payload.name) updatedItem.name = message.payload.name;
        if (message.payload.type) updatedItem.type = message.payload.type;
        if (message.payload.desc) updatedItem.desc = message.payload.desc;
        if (message.payload.ip) updatedItem.ip = message.payload.ip;
        if (message.payload.unit) updatedItem.unit = message.payload.unit;
        if (message.payload.areaId) updatedItem.areaId = message.payload.areaId;
        service.call('luna://com.webos.service.db/merge', { objects: [updatedItem] }, (response) => {
            if (response.payload.returnValue) {
                message.respond({ returnValue: true, results: 'Item updated successfully' });
            } else {
                message.respond({ returnValue: false, results: response.error });
            }
        });
    });
    // 기기 정보 데이터 Delete
    service.register('device/delete', function(message) {
        const ids = [message.payload.id];
        
        if (!("id" in message.payload)) {
            message.respond({ returnValue: false, results: 'id is required.' });
        }

        service.call('luna://com.webos.service.db/del', { ids: ids }, (response) => {
            if (response.payload.returnValue) {
                service.call('luna://xyz.rollforward.app.coap/delete/device', { deviceId: message.payload.id }, (response) => {
                    if (response.payload.returnValue) {
                        message.respond({ returnValue: true, results: 'Item deleted successfully' });
                    } else {
                        message.respond({ returnValue: false, results: response.error });
                    }
                });
            } else {
                message.respond({ returnValue: false, results: response.error });
            }
        });
    });

}

module.exports = registerDeviceMethod;