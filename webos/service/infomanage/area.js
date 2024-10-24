const AREAKIND = 'xyz.rollforward.app.infomanage:1'
const DEVKIND = 'xyz.rollforward.app.infomanage:2';
const registerAreaMethod = (service) => {
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
    // 구역 정보 데이터 Create
    service.register('area/create', function(message) {
        const dataToStore = {
            _kind: AREAKIND,
            name: message.payload.name,
            desc: message.payload.desc
        };
        
        if (!dataToStore.name) {
            return message.respond({ returnValue: false, results: 'name is required.' });
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
        const Aquery  = {
            from: AREAKIND,
            where: []
        };

        if (message.payload.id) {
            Aquery.where.push({ prop: '_id', op: '=', val: message.payload.id });
        }

        if (message.payload.desc) {
            Aquery.where.push({ prop: 'desc', op: '=', val: message.payload.desc });
        }

        if (message.payload.name) {
            Aquery.where.push({ prop: 'name', op: '=', val: message.payload.name });
        }

        service.call('luna://com.webos.service.db/find', { query: Aquery }, (response) => {
            if (response.payload.returnValue) {
                const areas = [];
                for (const result of response.payload.results) {
                    areas.push({"areaID":result._id, "name" : result.name, "desc" : result.desc,"sensorCount": 0, "actuatorCount": 0});
                }
                const Dquery  = {
                    from: DEVKIND,
                    where: []
                };
                service.call('luna://com.webos.service.db/find', { query: Dquery }, (response) => {  
                    for (const result of response.payload.results) {
                        for(let i = 0; i < areas.length; i++) {
                            if (areas[i].areaID == result.areaId){
                                if (result.type === 'sensor') {
                                    areas[i].sensorCount++;
                                } else if (result.type === 'actuator') {
                                    areas[i].actuatorCount++;
                                }
                            }
                        }
                    }
                    message.respond({ returnValue: true, results: areas });
                });
            } else {
                message.respond({ returnValue: false, results: response.error });
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
        service.call('luna://com.webos.service.db/find', { query: deviceQuery }, (response) => {
            if (response.payload.results.length > 0) {
                message.respond({ returnValue: false, results: 'Failed to delete area becuase associated devices exists' });
            } else {
                service.call('luna://com.webos.service.db/del', { ids: [areaId] }, (response) => {
                    if (response.payload.returnValue) {
                        message.respond({ returnValue: true, results: 'Area deleted successfully' });
                    } else {
                        message.respond({ returnValue: false, results: 'Failed to delete area' });
                    }
                });
            }
        });
    });
}
module.exports = registerAreaMethod;