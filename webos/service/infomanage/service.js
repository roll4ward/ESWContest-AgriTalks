const pkg_info = require("./package.json");
const Service = require('webos-service');

const service = new Service(pkg_info.name);
const AREAKIND = 'xyz.rollforward.app.infomanage:1'
const DEVKIND = 'xyz.rollforward.app.infomanage:2';

// 기기 정보 데이터베이스 생성 (임시)
service.register('device/createKind', function(message) {
    const kindData = {
        id: DEVKIND,
        owner: 'xyz.rollforward.app.infomanage',
        extends: [AREAKIND],
        schema: {
            type: 'object',
            properties: {
                _id: { type: 'string' },
                snum: { type: 'string' },
                name: {type: 'string'},
                type: { type: 'string' },
                desc: { type: 'string' },
                ip: { type: 'string'},
                unit: {type: 'string'},
                areaId: {type: 'string'}

            },
            required: ['snum', 'name','type', 'ip', 'unit', 'areaId']
        },
        indexes: [
            { name: 'snum', props: [{ name: 'snum' }] },
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

// 구역 정보 데이터베이스 생성 (임시)
service.register('area/createKind', function(message) {
    const kindData = {
        id: AREAKIND,
        owner: 'xyz.rollforward.app.infomanage',
        schema: {
            type: 'object',
            properties: {
                _id: { type: 'string' },
                name: {type: 'string'},
                desc: { type: 'string' },
            },
            required: ['name','desc']
        },
        indexes: [
            { name: 'name', props: [{ name: 'name' }] },
            { name: 'desc', props: [{ name: 'desc' }] }
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

// 구역 정보 데이터베이스 삭제 (임시)
service.register('area/deleteKind', function(message) {
    service.call('luna://com.webos.service.db/delKind', {id: AREAKIND}, (response) => {
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
        snum: message.payload.snum,
        name: message.payload.name,
        type: message.payload.type,
        desc: message.payload.desc,
        ip: message.payload.ip,
        unit: message.payload.unit,
        areaId: message.payload.areaId
    };

    if (!dataToStore.snum || !dataToStore.name || !dataToStore.type || !dataToStore.ip || !dataToStore.unit || !dataToStore.areaId) {
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

    if (message.payload.snum) {
        query.where.push({ prop: 'snum', op: '=', val: message.payload.snum });
    }

    if (message.payload.name) {
        query.where.push({ prop: 'name', op: '=', val: message.payload.name });
    }

    if (message.payload.areaId) {
        query.where.push({ prop: 'areaId', op: '=', val: message.payload.areaId });
    }
    
    service.call('luna://com.webos.service.db/find', { query: query }, (response) => {
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

    if (message.payload.snum) updatedItem.snum = message.payload.snum;
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
            message.respond({ returnValue: true, results: 'Item deleted successfully' });
        } else {
            message.respond({ returnValue: false, results: response.error });
        }
    });
});

// 구역 정보 데이터 Create
service.register('area/create', function(message) {
    const dataToStore = {
        _kind: AREAKIND,
        name: message.payload.name,
        desc: message.payload.desc
    };
    
    if (!dataToStore.name || !dataToStore.desc) {
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

// 구역 정보 데이터 Read
service.register('area/read', function(message) {
    const areaQuery  = {
        from: AREAKIND,
        where: []
    };
    
    if (message.payload.id) {
        query.where.push({ prop: '_id', op: '=', val: message.payload.id });
    }

    if (message.payload.desc) {
        query.where.push({ prop: 'desc', op: '=', val: message.payload.desc });
    }

    if (message.payload.name) {
        query.where.push({ prop: 'name', op: '=', val: message.payload.name });
    }
    
    service.call('luna://com.webos.service.db/find', { query: areaQuery }, (areaResponse) => {
        console.log(areaResponse);
        if (areaResponse.payload.returnValue) {
            const areas = areaResponse.payload.results.shift();
            areas.sensorCount = 0;
            areas.actuatorCount = 0;

            const deviceCounts = areaResponse.payload.results.reduce((acc, device) => {
                if (device.type === '센서') {
                    acc.sensorCount++;
                } else if (device.type === '작동기') {
                    acc.actuatorCount++;
                }
                return acc;
            }, { sensorCount: 0, actuatorCount: 0 });
            areas.sensorCount = deviceCounts.sensorCount;
            areas.actuatorCount = deviceCounts.actuatorCount;
            message.respond({ returnValue: true, results: areas });

        } else {
            message.respond({ returnValue: false, results: areaResponse.error });
        }
    });
});

// 구역 정보 데이터 Update
service.register('area/update', function(message) {
    const updatedItem = {
        _id: message.payload.id,
        _kind: AREAKIND
    };

    if (message.payload.name) updatedItem.name = message.payload.name;
    if (message.payload.desc) updatedItem.desc = message.payload.desc;

    service.call('luna://com.webos.service.db/merge', { objects: [updatedItem] }, (response) => {
        if (response.payload.returnValue) {
            message.respond({ returnValue: true, results: 'Item updated successfully' });
        } else {
            message.respond({ returnValue: false, results: response.error });
        }
    });
});

// 구역 정보 데이터 Delete
service.register('area/delete', function(message) {
    const areaId = message.payload.id;
    
    if (!areaId) {
        return message.respond({ returnValue: false, results: 'Area ID is required.' });
    }

    // 먼저 해당 Area에 속한 모든 Device 조회
    const deviceQuery = {
        from: DEVKIND,
        where: [{ prop: 'areaId', op: '=', val: areaId }]
    };

    service.call('luna://com.webos.service.db/find', { query: deviceQuery }, (deviceResponse) => {
        console.log(deviceResponse.payload.results);
        console.log(deviceResponse.payload.results.length);
        if (deviceResponse.payload.results.length > 1) {
            message.respond({ returnValue: false, results: 'Failed to delete area becuase associated devices exists' });
        } else {
            service.call('luna://com.webos.service.db/del', { ids: [areaId] }, (delAreaResponse) => {
                console.log(delAreaResponse);
                if (delAreaResponse.payload.returnValue) {
                    message.respond({ returnValue: true, results: 'Area deleted successfully' });
                } else {
                    message.respond({ returnValue: false, results: 'Failed to delete area' });
                }
            });
        }
    });
});