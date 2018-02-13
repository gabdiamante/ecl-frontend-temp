const DUMMY = {
    //DATA-MANAGEMENT
    sites: [
        {
            id: 1,
            code: 'AXQ',
            type: 'HUB',
            name: 'AXQ HUB',
            address:
                'DURIAN PARK, 124 DOMESTIC RD BARANGAY 191 PASAY METRO MANILA',
            updatedAt: new Date()
        },
        {
            id: 2,
            code: 'DBH',
            type: 'HUB',
            name: 'DB HUB',
            address:
                'HANGAR, GENERAL AVIATION AREA, MANILA DOMESTIC AIRPORT BARANGAY 191 PASAY CITY METRO MANILA',
            updatedAt: new Date()
        },
        {
            id: 3,
            code: 'DTN',
            type: 'HUB',
            name: 'DTN HUB',
            address:
                'KM 40 BANAWE DE STA.ROSA BLDG. F. REYES ST. PUROK 6 BRGY. BALIBAGO STA. ROSA, LAGUNA',
            updatedAt: new Date()
        },
        {
            id: 4,
            code: 'LCX',
            type: 'HUB',
            name: 'LCX HUB',
            address:
                '306, VVS BUILDING, MULTINATIONAL AVENUE, MULTINATIONAL VILLAGE MOONWALK PARAÑAQUE METRO MANILA',
            updatedAt: new Date()
        },
        {
            id: 5,
            code: 'MNL',
            type: 'HUB',
            name: 'MNL CORP',
            address:
                'HANGAR, GENERAL AVIATION AREA, MANILA DOMESTIC AIRPORT BARANGAY 191 PASAY CITY METRO MANILA',
            updatedAt: new Date()
        },
        {
            id: 6,
            code: 'OZH',
            type: 'HUB',
            name: 'OZH HUB',
            address: 'BLK3 LOT12 SOLDIERS HILLS BRGY. PUTATAN, MUNTINLUPA CITY',
            updatedAt: new Date()
        },
        {
            id: 7,
            code: 'AB DC',
            type: 'DC',
            name: 'ABS-CBN Distribution Center',
            address:
                'DURIAN PARK, 124 DOMESTIC RD BARANGAY 191 PASAY METRO MANILA',
            zone_id: '57ce3e3a-0805-11e8-8039-38d5477c3f9a',
            hub_id: 1,
            updatedAt: new Date()
        },
        {
            id: 8,
            code: 'D DC',
            type: 'DC',
            name: 'Durian Distribution Center',
            address:
                'HANGAR, GENERAL AVIATION AREA, MANILA DOMESTIC AIRPORT BARANGAY 191 PASAY CITY METRO MANILA',
            zone_id: '5995272b-00b3-11e8-bd0f-38d54711ba42',
            hub_id: 1,
            updatedAt: new Date()
        },
        {
            id: 9,
            code: 'MN DC',
            type: 'DC',
            name: 'Manila Distribution Center',
            address:
                'KM 40 BANAWE DE STA.ROSA BLDG. F. REYES ST. PUROK 6 BRGY. BALIBAGO STA. ROSA, LAGUNA',
            zone_id: '5995272b-00b3-11e8-bd0f-38d54711ba42',
            hub_id: 1,
            updatedAt: new Date()
        }
    ],
    zones: [
        {
            id: '57ce3e3a-0805-11e8-8039-38d5477c3f9a',
            name: 'CAL-DC',
            code: 'CAL',
            site_id: 'ad24caa1-00b3-11e8-bd0f-38d54711ba42',
            string_polygon:
                '[[14.178853278890095,121.22108459472656],[14.183846179546256,121.19705200195312],[14.186841867160076,121.17473602294922],[14.226780582214117,121.18537902832031],[14.240424693263611,121.17267608642578],[14.230774065876195,121.10092163085938],[14.180184729814973,121.07654571533203],[14.116266279430716,121.09027862548828],[14.089961287449894,121.18228912353516],[14.11393557990032,121.190185546875],[14.13624272556294,121.19258880615234],[14.161543705759692,121.21353149414062],[14.178853278890095,121.22108459472656]]',
            deactivated_by: null,
            deactivated: null,
            created: '2018-02-12T09:57:45.000Z',
            updated: '2018-02-12T09:57:45.000Z',
            deleted: '0000-00-00 00:00:00'
        },
        {
            id: '5995272b-00b3-11e8-bd0f-38d54711ba42',
            name: 'LAGUNA',
            code: 'LAG',
            site_id: '5995272b-00b3-11e8-bd0f-38d54711ba42',
            string_polygon:
                '[[14.239759145994972,121.17301940917969],[14.2304412782669,121.10023498535156],[14.17985186781664,121.07620239257812],[14.115267411122709,121.08993530273438],[14.106610369052385,121.124267578125],[14.088629308442725,121.18331909179688],[14.059989881195879,121.21559143066406],[14.063320231509307,121.24443054199219],[14.06065595513735,121.26365661621094],[14.073310991460506,121.31858825683594],[14.072644954380316,121.33506774902344],[14.08596532711486,121.34468078613281],[14.100616839655807,121.36665344238281],[14.110605967789866,121.39068603515625],[14.115267411122709,121.42021179199219],[14.13990488382868,121.41677856445312],[14.13191464433473,121.45111083984375],[14.1465632023192,121.49093627929688],[14.188506120948496,121.50741577148438],[14.217794985975296,121.49162292480469],[14.240424693263611,121.49436950683594],[14.265714034831872,121.48956298828125],[14.267044974240175,121.45729064941406],[14.28501188652403,121.45111083984375],[14.31561887692128,121.47102355957031],[14.340899766268105,121.44218444824219],[14.293662110576578,121.39137268066406],[14.270372288364925,121.37077331542969],[14.255066236628496,121.343994140625],[14.238428045571926,121.33506774902344],[14.227113375214987,121.31584167480469],[14.211138758545793,121.30691528320312],[14.19383165093469,121.28974914550781],[14.194497333381152,121.26708984375],[14.191168901588155,121.25198364257812],[14.201819711161797,121.23275756835938],[14.17985186781664,121.22142791748047],[14.185177601151203,121.1956787109375],[14.187174718895449,121.17439270019531],[14.227113375214987,121.1846923828125],[14.239759145994972,121.17301940917969]]',
            deactivated_by: null,
            deactivated: null,
            created: '2018-02-12T09:57:45.000Z',
            updated: '2018-02-12T09:57:45.000Z',
            deleted: '0000-00-00 00:00:00'
        },
        {
            id: '79eb71da-0805-11e8-8039-38d5477c3f9a',
            name: 'LB-DC',
            code: 'LB',
            site_id: 'cdb27b75-00b3-11e8-bd0f-38d54711ba42',
            string_polygon:
                '[[14.175857485729008,121.22108459472656],[14.160545036264903,121.21421813964844],[14.135243944894635,121.19430541992188],[14.113269661369998,121.19155883789062],[14.089128801481156,121.18349075317383],[14.060406177636555,121.21636390686035],[14.063903037828961,121.24434471130371],[14.060988991380846,121.26399993896484],[14.07397702659981,121.31824493408203],[14.072977973163049,121.3344669342041],[14.086131826858464,121.34459495544434],[14.100949817643524,121.36648178100586],[14.111521615969561,121.39094352722168],[14.116599234560233,121.41952514648438],[14.116599234560233,121.41952514648438],[14.14323406744594,121.41677856445312],[14.163208145157155,121.39205932617188],[14.196494368982737,121.37763977050781],[14.214466896745085,121.35429382324219],[14.228943727959082,121.34476661682129],[14.237762492417684,121.33661270141602],[14.227113375214987,121.31584167480469],[14.210972350350575,121.30828857421875],[14.192999545125783,121.28837585449219],[14.193165966532087,121.26640319824219],[14.190503209361767,121.25146865844727],[14.200488387358332,121.23344421386719],[14.175857485729008,121.22108459472656]]',
            deactivated_by: null,
            deactivated: null,
            created: '2018-02-12T09:57:45.000Z',
            updated: '2018-02-12T09:57:45.000Z',
            deleted: '0000-00-00 00:00:00'
        },
        {
            id: '8a47a13e-0805-11e8-8039-38d5477c3f9a',
            name: 'STA-CRUZ-DC',
            code: 'STA-CRUZ',
            site_id: 'f16aef70-00b3-11e8-bd0f-38d54711ba42',
            string_polygon:
                '[[14.24192216744419,121.34210586547852],[14.21396767913671,121.35515213012695],[14.197160043603724,121.37781143188477],[14.163374588425839,121.39257431030273],[14.144232813026518,121.41660690307617],[14.132746974041519,121.45059585571289],[14.146896113125207,121.49042129516602],[14.188506120948496,121.50690078735352],[14.217295775712959,121.49110794067383],[14.240757466162165,121.49385452270508],[14.265714034831872,121.48921966552734],[14.266878607244056,121.4567756652832],[14.286010006273951,121.45042419433594],[14.315951538695312,121.47102355957031],[14.340068203397374,121.44235610961914],[14.294161151814583,121.39274597167969],[14.270039559163832,121.37163162231445],[14.254234356216223,121.34468078613281],[14.24192216744419,121.34210586547852]]',
            deactivated_by: null,
            deactivated: null,
            created: '2018-02-12T09:57:45.000Z',
            updated: '2018-02-12T09:57:45.000Z',
            deleted: '0000-00-00 00:00:00'
        }
    ],
    vehicles: [
        {
            id: '20765496-0803-11e8-8039-38d5477c3f9a',
            plate_number: 'AB-1234',
            max_volume: 10,
            max_weight: 1000,
            type: '2W',
            model: 'HONDA',
            status: 'SITE',
            courier_user_id: null,
            lat: null,
            lng: null,
            site_id: '5995272b-00b3-11e8-bd0f-38d54711ba42',
            deactivated_by: null,
            deactivated: null,
            created: '2018-02-12T09:57:45.000Z',
            updated: new Date('2018-02-12T09:57:45.000Z'),
            deleted: '0000-00-00 00:00:00'
        },
        {
            id: '20765496-0803-11e8-8039-38d5477c3f9b',
            plate_number: 'BB-1234',
            max_volume: 10,
            max_weight: 1000,
            type: '2W',
            model: 'HONDA',
            status: 'SITE',
            courier_user_id: null,
            lat: null,
            lng: null,
            site_id: 'ad24caa1-00b3-11e8-bd0f-38d54711ba42',
            deactivated_by: null,
            deactivated: null,
            created: '2018-02-12T09:57:45.000Z',
            updated: new Date('2018-02-12T09:57:45.000Z'),
            deleted: '0000-00-00 00:00:00'
        },
        {
            id: '20765496-0803-11e8-8039-38d5477c3f9c',
            plate_number: 'CB-1234',
            max_volume: 10,
            max_weight: 1000,
            type: '2W',
            model: 'HONDA',
            status: 'SITE',
            courier_user_id: null,
            lat: null,
            lng: null,
            site_id: 'cdb27b75-00b3-11e8-bd0f-38d54711ba42',
            deactivated_by: null,
            deactivated: null,
            created: '2018-02-12T09:57:45.000Z',
            updated: new Date('2018-02-12T09:57:45.000Z'),
            deleted: '0000-00-00 00:00:00'
        },
        {
            id: '20765496-0803-11e8-8039-38d5477c3f9d',
            plate_number: 'DB-1234',
            max_volume: 10,
            max_weight: 1000,
            type: '2W',
            model: 'HONDA',
            status: 'SITE',
            courier_user_id: null,
            lat: null,
            lng: null,
            site_id: 'f16aef70-00b3-11e8-bd0f-38d54711ba42',
            deactivated_by: null,
            deactivated: null,
            created: '2018-02-12T09:57:45.000Z',
            updated: new Date('2018-02-12T09:57:45.000Z'),
            deleted: '0000-00-00 00:00:00'
        },
        {
            id: '32f4335e-0803-11e8-8039-38d5477c3f9a',
            plate_number: 'AC-1234',
            max_volume: 20,
            max_weight: 5000,
            type: '4W',
            model: 'HONDA',
            status: 'SITE',
            courier_user_id: null,
            lat: null,
            lng: null,
            site_id: '5995272b-00b3-11e8-bd0f-38d54711ba42',
            deactivated_by: null,
            deactivated: null,
            created: '2018-02-12T09:57:45.000Z',
            updated: new Date('2018-02-12T09:57:45.000Z'),
            deleted: '0000-00-00 00:00:00'
        },
        {
            id: '32f4335e-0803-11e8-8039-38d5477c3f9b',
            plate_number: 'BC-1234',
            max_volume: 20,
            max_weight: 5000,
            type: '4W',
            model: 'HONDA',
            status: 'SITE',
            courier_user_id: null,
            lat: null,
            lng: null,
            site_id: 'ad24caa1-00b3-11e8-bd0f-38d54711ba42',
            deactivated_by: null,
            deactivated: null,
            created: '2018-02-12T09:57:45.000Z',
            updated: new Date('2018-02-12T09:57:45.000Z'),
            deleted: '0000-00-00 00:00:00'
        },
        {
            id: '32f4335e-0803-11e8-8039-38d5477c3f9c',
            plate_number: 'CC-1234',
            max_volume: 20,
            max_weight: 5000,
            type: '4W',
            model: 'HONDA',
            status: 'SITE',
            courier_user_id: null,
            lat: null,
            lng: null,
            site_id: 'cdb27b75-00b3-11e8-bd0f-38d54711ba42',
            deactivated_by: null,
            deactivated: null,
            created: '2018-02-12T09:57:45.000Z',
            updated: new Date('2018-02-12T09:57:45.000Z'),
            deleted: '0000-00-00 00:00:00'
        },
        {
            id: '32f4335e-0803-11e8-8039-38d5477c3f9d',
            plate_number: 'DC-1234',
            max_volume: 20,
            max_weight: 5000,
            type: '4W',
            model: 'HONDA',
            status: 'SITE',
            courier_user_id: null,
            lat: null,
            lng: null,
            site_id: 'f16aef70-00b3-11e8-bd0f-38d54711ba42',
            deactivated_by: null,
            deactivated: null,
            created: '2018-02-12T09:57:45.000Z',
            updated: new Date('2018-02-12T09:57:45.000Z'),
            deleted: '0000-00-00 00:00:00'
        },
        {
            id: 'edec1cc5-0802-11e8-8039-38d5477c3f9a',
            plate_number: 'AA-1234',
            max_volume: 10,
            max_weight: 1000,
            type: '2W',
            model: 'HONDA',
            status: 'SITE',
            courier_user_id: null,
            lat: null,
            lng: null,
            site_id: '5995272b-00b3-11e8-bd0f-38d54711ba42',
            deactivated_by: null,
            deactivated: null,
            created: '2018-02-12T09:57:45.000Z',
            updated: '2018-02-12T09:57:45.000Z',
            deleted: '0000-00-00 00:00:00'
        },
        {
            id: 'edec1cc5-0802-11e8-8039-38d5477c3f9b',
            plate_number: 'BA-1234',
            max_volume: 10,
            max_weight: 1000,
            type: '2W',
            model: 'HONDA',
            status: 'SITE',
            courier_user_id: null,
            lat: null,
            lng: null,
            site_id: 'ad24caa1-00b3-11e8-bd0f-38d54711ba42',
            deactivated_by: null,
            deactivated: null,
            created: '2018-02-12T09:57:45.000Z',
            updated: new Date('2018-02-12T09:57:45.000Z'),
            deleted: '0000-00-00 00:00:00'
        }
    ]
};

export default DUMMY;
