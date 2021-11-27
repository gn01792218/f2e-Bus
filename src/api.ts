//引入你配置的axios
import req from './http'

const stopProperty ="$select=StopName%2CStopUID&"
const routeProperty = "$select=RouteID%2CRouteName%2COperators%2CDepartureStopNameZh%2CDestinationStopNameZh&"
const busReallTimeProperty = '$select=RouteName%2CPlateNumb%2CBusPosition%2CDirection%2CDutyStatus&'
//公車動態API
//取得指定[縣市]的公車動態定時資料(A1)[逐筆更新]
// export const getReallTimeBusByCity = (City:string) => {
//     return req('get',`/v2/Bus/RealTimeByFrequency/City/${City}?$format=JSON`)
// }
//取得指定[縣市],[路線名稱]的公車動態定時資料(A1)[逐筆更新]
export const getReallTimeBusByCityAndRoute = (City:string,RouteName:number) => {
    return req('get',`/v2/Bus/RealTimeByFrequency/City/${City}/${RouteName}?${busReallTimeProperty}$format=JSON`)
}
//取得指定[縣市]的公車動態定點資料(A2)[逐筆更新]
// export const getReallTimeNearStopByCity = (City:string) => {
//     return req('get',`/v2/Bus/RealTimeNearStop/City/${City}?$format=JSON`)
// }
//取得指定[縣市],[路線名稱]的公車動態定點資料(A2)[逐筆更新]
export const getReallTimeNearStopByCityAndRoute = (City:string,RouteName:number) => {
    return req('get',`/v2/Bus/RealTimeNearStop/City/${City}/${RouteName}?$format=JSON`)
}
//預估到站API
//取得指定縣市的公車預估到站資料
// export const getEstimatedTimeOfArrivalByCity = (City:string) => {
//     return req('get',`/v2/Bus/EstimatedTimeOfArrival/City/${City}?$format=JSON`)
// }
//取得指定[縣市],[路線名稱]的公車預估到站資料(N1)[逐筆更新]
export const getEstimatedTimeOfArrivalByCityAndRouteName = (City:string,RouteName:number) => {
    return req('get',`/v2/Bus/EstimatedTimeOfArrival/City/${City}/${RouteName}?$format=JSON`)
}

//取得縣市公車路線資料
export const getRouteByCity = (City:string) => {  //資料減肥，只需要此縣市所有公車路線的名稱就好
    return req('get',`v2/Bus/Route/City/${City}?$format=JSON`)
}
export const getRouteByCityAndRouteName = (City:string,RouteName:number) => {
    return req('get',`/v2/Bus/Route/City/${City}/${RouteName}?$format=JSON`)
}

//站牌相關
//取得某縣市所有公車站牌
export const getStopByCity = (City:string) => {  //給站點搜尋時使用，資料減肥:只需要站牌名稱就好
    return req('get',`/v2/Bus/Stop/City/${City}?$format=JSON`)
}
//取得縣市某公車路線之公車站牌
export const getStopByCityAndRouteName = (City:string,RouteName:number) => {
    return req('get',`/v2/Bus/StopOfRoute/City/${City}/${RouteName}?$format=JSON`)
}

//取得指定縣市下所有路線的所有站牌
export const getCityAllRouteStop = (City:string) => { 
    return req('get',`/v2/Bus/StopOfRoute/City/${City}?$format=JSON`)
}

//票價API
export const getRouteFareByCity = (City:string) => { 
    return req('get',`/v2/Bus/RouteFare/City/${City}?$format=JSON`)
}
export const getRouteFareByCityAndRouteName = (City:string,RouteName:number) => {  //注意，並非所有縣市都有!
    return req('get',`/v2/Bus/RouteFare/City/${City}/${RouteName}?$format=JSON`)
}